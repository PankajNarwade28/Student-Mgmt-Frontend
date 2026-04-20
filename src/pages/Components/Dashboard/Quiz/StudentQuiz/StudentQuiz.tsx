import React, { useEffect, useState } from "react";
import api from "../../../../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

interface Course {
  id: number;
  course_name: string;
}

interface Quiz {
  id: number;
  title: string;
  time_limit_minutes: number;
}

const StudentQuiz = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get("/api/quiz/student");
      setCourses(res.data.data);
      console.log("Courses for student quiz:", res.data.data);
    } catch {
      toast.error("Failed to load courses");
    }
  };

  const fetchQuizzes = async (courseId: number) => {
    try {
      setLoading(true);
      const res = await api.get(`/api/quiz/course/${courseId}`);
      setQuizzes(res.data.data);
      console.log("Quizzes for course:", res.data.data);
    } catch {
      toast.error("Failed to load quizzes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 space-y-6 bg-slate-50 min-h-screen">
      <h1 className="text-xl font-bold">Your Quizzes 🎯</h1>

      {/* Course Selection */}
      <div className="flex gap-3 overflow-x-auto">
        {courses.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              setSelectedCourse(c.id);
              fetchQuizzes(c.id);
            }}
            className={`px-4 py-2 rounded-lg text-sm ${
              selectedCourse === c.id
                ? "bg-indigo-600 text-white"
                : "bg-white border text-gray-600"
            }`}
          >
            {c.course_name}
          </button>
        ))}
      </div>

      {/* Quiz List */}
      {!selectedCourse ? (
        <p className="text-gray-400 text-center">Select a course</p>
      ) : loading ? (
        <p className="text-gray-400 text-center">Loading...</p>
      ) : quizzes.length === 0 ? (
        <p className="text-gray-400 text-center">No quizzes available</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzes.map((q) => (
            <div key={q.id} className="bg-white p-4 rounded-xl shadow">
              <h3 className="font-semibold">{q.title}</h3>
              <p className="text-sm text-gray-400">
                {q.time_limit_minutes} min
              </p>

              <button
                onClick={() => navigate(`/quiz/attempt/${q.id}`)}
                className="mt-3 w-full bg-indigo-600 text-white py-2 rounded"
              >
                Start Quiz
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentQuiz;
