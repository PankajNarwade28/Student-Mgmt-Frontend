import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import api from "../../../../../api/axiosInstance";

interface Course {
  id: number;
  name: string;
}

const CreateQuizModal = ({
  onClose, 
}: {
  onClose: () => void; 
}) => {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState(30);

  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number | "">("");

  const [questions, setQuestions] = useState([
    {
      question_text: "",
      options: [
        { text: "", is_correct: false },
        { text: "", is_correct: false },
      ],
    },
  ]);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const res = await api.get("/api/quiz/teacher");
        setCourses(res.data.data); 
        console.log("Courses for quiz creation:", res.data.data);
      } catch {
        toast.error("Failed to load courses");
      }
    };

    loadCourses();
  }, []);
  // Add Question
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question_text: "",
        options: [
          { text: "", is_correct: false },
          { text: "", is_correct: false },
        ],
      },
    ]);
  };

  // Add Option
  const addOption = (qIndex: number) => {
    const updated = [...questions];
    updated[qIndex].options.push({ text: "", is_correct: false });
    setQuestions(updated);
  };

  // Update Question
  const updateQuestion = (qIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].question_text = value;
    setQuestions(updated);
  };

  // Update Option
  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex].text = value;
    setQuestions(updated);
  };

  // Select Correct Option
  const selectCorrect = (qIndex: number, oIndex: number) => {
    const updated = [...questions];
    updated[qIndex].options = updated[qIndex].options.map((opt, i) => ({
      ...opt,
      is_correct: i === oIndex,
    }));
    setQuestions(updated);
  };

  // 🔥 Submit with validation
  const handleSubmit = async () => {
    if (!title || !selectedCourse) {
      toast.error("Title & Course required");
      return;
    }

    for (const q of questions) {
      if (!q.question_text) {
        toast.error("All questions must have text");
        return;
      }

      const hasCorrect = q.options.some((o) => o.is_correct);
      if (!hasCorrect) {
        toast.error("Each question must have a correct option");
        return;
      }
    }

    try {
      const payload = {
        title,
        description: "",
        course_id: selectedCourse,
        time_limit_minutes: time,
        questions,
      };

      await api.post("/api/quiz/full-create", payload);

      toast.success("Quiz created ✅"); 
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Creation failed ❌");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[95%] max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl p-5 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Create Quiz</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✖
          </button>
        </div>

        {/* Quiz Info */}
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Quiz Title"
            className="border p-2 rounded text-sm"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="number"
            placeholder="Time (minutes)"
            className="border p-2 rounded text-sm"
            value={time}
            onChange={(e) => setTime(Number(e.target.value))}
          />
        </div>

        {/* 🔥 Course Select */}
        <select
          className="w-full border p-2 rounded text-sm"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(Number(e.target.value))}
        >
          <option value="">Select Course</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.id} - {c.name}
            </option>
          ))}
        </select>

        {/* Questions */}
        {questions.map((q, qIndex) => (
          <div
            key={qIndex}
            className="border rounded-lg p-3 space-y-2 bg-gray-50"
          >
            <input
              type="text"
              placeholder={`Question ${qIndex + 1}`}
              className="w-full border p-2 rounded text-sm"
              value={q.question_text}
              onChange={(e) => updateQuestion(qIndex, e.target.value)}
            />

            {q.options.map((opt, oIndex) => (
              <div key={oIndex} className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder={`Option ${oIndex + 1}`}
                  className="flex-1 border p-2 rounded text-sm"
                  value={opt.text}
                  onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                />

                <input
                  type="radio"
                  name={`correct-${qIndex}`}
                  checked={opt.is_correct}
                  onChange={() => selectCorrect(qIndex, oIndex)}
                />
              </div>
            ))}

            <button
              onClick={() => addOption(qIndex)}
              className="text-xs text-indigo-600"
            >
              + Add Option
            </button>
          </div>
        ))}

        {/* Add Question */}
        <button onClick={addQuestion} className="text-sm text-indigo-600">
          + Add Question
        </button>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded text-sm"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
          >
            Create Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateQuizModal;
