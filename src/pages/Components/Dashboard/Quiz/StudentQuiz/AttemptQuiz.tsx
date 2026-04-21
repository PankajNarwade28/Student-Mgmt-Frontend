import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../../../api/axiosInstance";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

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

interface Quiz {
  id: number;
  title: string;
  attempted: boolean;
  score: number | null;
  time_limit_minutes: number;
  questions: Question[];
}

const AttemptQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!id || isNaN(Number(id))) {
      toast.error("Invalid quiz ID");
      return;
    }

    fetchQuiz();
  }, [id]);

  const fetchQuiz = async () => {
    try {
      const res = await api.get(`/api/quiz/${id}/full`);
      setQuiz(res.data.data);
    } catch (err) {
      console.error(err);
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 400) {
          toast.error("Already attempted");
          navigate("/dashboard/quiz");
        }
      }
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

    if (Object.keys(answers).length !== quiz.questions.length) {
      toast.error("Answer all questions");
      return;
    }

    let score = 0;

    quiz.questions.forEach((q) => {
      const correct = q.options.find((o) => o.is_correct);
      if (correct && answers[q.id] === correct.id) {
        score++;
      }
    });

    try {
      await api.post("/api/quiz/submit", {
        quizId: quiz.id,
        score,
      });

      toast.success(`Score: ${score}/${quiz.questions.length}`);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      if (axios.isAxiosError(err) && err.response?.status === 400) {
        toast.error(
          err.response.data.message || "You have already attempted this quiz",
        );
      }
    }
  };
  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 5) return "text-yellow-600";
    return "text-red-600";
  };
  if (loading)
    return <p className="text-center mt-10 text-gray-400">Loading...</p>;

  if (!quiz)
    return <p className="text-center mt-10 text-gray-400">No quiz found</p>;

  return (
    <div className="min-h-screen bg-[#f8fafb] p-4 md:p-12 flex justify-center text-[#1a2b2b]">
      <div className="w-full max-w-3xl space-y-8">
        {/* Quiz Progress Header */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-[#0f1717] leading-tight">
              {quiz.title}
            </h1>
            <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <span>
                {Object.keys(answers).length} / {quiz.questions.length}{" "}
                Questions
              </span>
              <span
                className={`text-sm font-bold ${getScoreColor(quiz.score || 0)}`}
              >
                Score: {quiz.score ?? 0}
              </span>
              <span className="text-[#00796b]">● Live Session</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#00796b]/5 text-[#00796b] px-5 py-3 rounded-2xl text-xs font-black border border-[#00796b]/10">
              ⏱ {quiz.time_limit_minutes}:00
            </div>
            <button
              onClick={() => navigate("/dashboard/quiz")}
              className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#00796b] transition-colors"
            >
              Exit
            </button>
          </div>
        </div>

        {/* Question List */}
        <div className="space-y-6">
          {quiz.questions.map((q, i) => (
            <div
              key={q.id}
              className="bg-white p-8 rounded-[2.5rem] shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-gray-50"
            >
              <div className="flex items-start gap-4 mb-6">
                <span className="text-[11px] font-black text-white bg-[#00796b] w-8 h-8 flex items-center justify-center rounded-lg shadow-lg shadow-[#00796b]/20">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-bold text-[#0f1717] text-lg pt-1">
                  {q.question_text}
                </h3>
              </div>

              <div className="grid gap-3">
                {q.options.map((opt) => {
                  const selected = answers[q.id] === opt.id;
                  return (
                    <label
                      key={opt.id}
                      className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200
                    ${
                      selected
                        ? "bg-[#00796b]/5 border-[#00796b] shadow-inner"
                        : "bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                    }`}
                    >
                      <input
                        type="radio"
                        className="w-4 h-4 accent-[#00796b]"
                        checked={selected}
                        onChange={() => handleSelect(q.id, opt.id)}
                        disabled={submitted}
                      />
                      <span
                        className={`text-sm font-semibold ${selected ? "text-[#00796b]" : "text-gray-600"}`}
                      >
                        {opt.option_text}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Submission Footer */}
        <div className="sticky bottom-8 bg-white/80 backdrop-blur-md p-6 rounded-[2rem] border border-gray-100 shadow-2xl">
          <button
            onClick={handleSubmit}
            disabled={
              submitted || Object.keys(answers).length !== quiz.questions.length
            }
            className={`w-full py-5 rounded-2xl text-white font-black text-xs uppercase tracking-[0.3em] transition-all
          ${
            submitted
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-[#00796b] hover:bg-[#004d40] hover:shadow-xl hover:shadow-[#00796b]/20 active:scale-[0.98]"
          }`}
          >
            {submitted ? "Submission Recorded" : "Finalize Assessment"}
          </button>

          {submitted && (
            <div className="mt-4 animate-bounce text-center text-[#00796b] font-black text-[10px] uppercase tracking-widest">
              🎉 Results are being processed
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttemptQuiz;
