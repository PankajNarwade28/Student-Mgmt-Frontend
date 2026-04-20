import React, { useEffect, useState } from "react";
import api from "../../../../api/axiosInstance";
import { HiOutlinePlus } from "react-icons/hi";
import { toast } from "react-hot-toast";
import CreateQuizModal from "./CreateQuizModal/CreateQuizModal";
import StudentQuiz from "./StudentQuiz/StudentQuiz";

interface Quiz {
  id: number;
  title: string;
  time_limit_minutes: number;
}
interface Course {
  id: number;
  name: string;
}

const QuizPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const endpoint =
        userRole === "Teacher" ? "/api/quiz/teacher" : "/api/quiz/student";

      const res = await api.get(endpoint);
      setCourses(res.data.data);
      
    } catch (err) {
      console.error(err);
      toast.error("Failed to load courses");
    }
  };

  const fetchQuizzes = async (courseId: number) => {
    try {
      setLoading(true);
      const res = await api.get(`/api/quiz/course/${courseId}`);
      setQuizzes(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load quizzes");
    } finally {  
      setLoading(false);
    }
  };

  const deleteQuiz = async (id: number) => {
    try {
      await api.delete(`/api/quiz/${id}`);
      toast.success("Deleted");
      if (selectedCourse) fetchQuizzes(selectedCourse);
    } catch {
      toast.error("Delete failed");
    } finally {
      fetchQuizzes(selectedCourse!);
      setLoading(false);
    }
  };

  // ✅ STUDENT → FULL PAGE SWITCH
if (userRole === "Student") {
  return <StudentQuiz />;
}

  return (
    <div className="p-4 md:p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          Quiz Dashboard 🎯
        </h1>

        {userRole === "Teacher" && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-[#00796b] text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg"
          >
            <HiOutlinePlus size={18} /> Create New Quiz
          </button>
        )}

        
      </div>

      {/* Course Cards */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {courses.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              setSelectedCourse(c.id);
              fetchQuizzes(c.id);
            }}
            className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap border transition
              ${
                selectedCourse === c.id
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-600 hover:bg-indigo-50"
              }`}
          >
            {c.id} - {c.name}
          </button>
        ))}
      </div>

      {/* Quiz Section */}
      {!selectedCourse ? (
        <div className="text-center text-gray-400 py-10">
          Select a course to view quizzes 📚
        </div>
      ) : loading ? (
        <div className="text-center text-gray-400">Loading quizzes...</div>
      ) : quizzes.length === 0 ? (
        <div className="text-center text-gray-400 py-10">
          No quizzes available 🚫
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzes.map((q) => (
            <div
              key={q.id}
              className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-lg transition border border-gray-100"
            >
              <h3 className="font-semibold text-gray-800 text-sm">{q.title}</h3>

              <p className="text-xs text-gray-400 mt-1">
                ⏱ {q.time_limit_minutes} minutes
              </p>

              <div className="mt-4">
                {userRole === "Student" ? (
                  <button className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm hover:bg-indigo-700 transition">
                    Start Quiz
                  </button>
                ) : (
                  <button
                    onClick={() => deleteQuiz(q.id)}
                    className="w-full bg-red-500 text-white py-2 rounded-lg text-sm hover:bg-red-600 transition"
                  >
                    Delete Quiz
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && <CreateQuizModal onClose={() => setShowModal(false)} />}
      
    </div>
  );
};

export default QuizPage;
