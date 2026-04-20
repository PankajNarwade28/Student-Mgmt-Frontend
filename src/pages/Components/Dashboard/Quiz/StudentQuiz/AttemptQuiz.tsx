import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../../../api/axiosInstance";
import { toast } from "react-hot-toast";

interface Quiz {
  id: number;
  title: string;
  time_limit_minutes: number;
}

interface Option {
  id: number;
  option_text: string;
  is_correct: boolean;
}

interface Question {
  id: number;
  question_text: string;
  options: Option[];
}

interface FullQuiz extends Quiz {
  questions: Question[];
}

const AttemptQuiz = () => {
  const { id } = useParams();

  const [quiz, setQuiz] = useState<FullQuiz | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
  if (!id) {
    toast.error("Invalid quiz ID");
    return;
  }

  fetchQuiz();
}, [id]);
  const fetchQuiz = async () => {
    try {
      const res = await api.get(`/api/quiz/${id}/full`);
      setQuiz(res.data.data);
    } catch {
      toast.error("Failed to load quiz");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (qId: number, optionId: number) => {
    if (submitted) return;

    setAnswers((prev) => ({
      ...prev,
      [qId]: optionId,
    }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    // 🔥 Validation
    if (Object.keys(answers).length !== quiz.questions.length) {
      toast.error("Please answer all questions");
      return;
    }

    let score = 0;

    quiz.questions.forEach((q) => {
      const correct = q.options.find((o) => o.is_correct);

      if (correct && answers[q.id] === correct.id) {
        score += 1;
      }
    });

    try {
      await api.post("/api/quiz/submit", {
        quizId: quiz.id,
        score,
      });

      toast.success(`Submitted! Score: ${score}/${quiz.questions.length}`);
      setSubmitted(true);
    } catch {
      toast.error("Submit failed");
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-400">Loading...</p>;

  if (!quiz)
    return <p className="text-center mt-10 text-gray-400">No quiz found</p>;

  return (
    <div className="p-5 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">{quiz.title}</h1>
        <span className="text-sm text-gray-500">
          ⏱ {quiz.time_limit_minutes} min
        </span>
      </div>

      {/* Questions */}
      {quiz.questions.map((q, index) => (
        <div
          key={q.id}
          className="bg-white p-4 rounded-xl shadow border border-gray-100"
        >
          <h3 className="font-semibold mb-3 text-gray-800">
            Q{index + 1}. {q.question_text}
          </h3>

          <div className="space-y-2">
            {q.options.map((opt) => {
              const isSelected = answers[q.id] === opt.id;

              return (
                <label
                  key={opt.id}
                  className={`flex items-center gap-2 p-2 rounded cursor-pointer border
                    ${
                      isSelected
                        ? "bg-indigo-50 border-indigo-400"
                        : "hover:bg-gray-50"
                    }`}
                >
                  <input
                    type="radio"
                    name={`q-${q.id}`}
                    checked={isSelected}
                    onChange={() => handleSelect(q.id, opt.id)}
                    disabled={submitted}
                  />
                  {opt.option_text}
                </label>
              );
            })}
          </div>
        </div>
      ))}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={submitted}
        className={`w-full py-3 rounded-xl text-white font-semibold transition
          ${
            submitted
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
      >
        {submitted ? "Submitted ✅" : "Submit Quiz"}
      </button>
    </div>
  );
};

export default AttemptQuiz;
