import React, { useEffect, useState } from "react";
import api from "../../../../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

interface Course {
  id: number;
  course_id: number;
  course_name: string;
}

interface Quiz {
  id: number;
  title: string;
  time_limit_minutes: number;
  attempted: boolean;
  score: number | null;
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
      setSelectedCourse(res.data.data[0]?.course_id || null);
      fetchQuizzes(res.data.data[0]?.course_id); // auto load quizzes
      console.log("Courses for student quiz:", res.data.data);
    } catch {
      toast.error("Failed to load courses");
    }
  };

  const fetchQuizzes = async (courseId: number) => {
    try {
      setLoading(true);
      const res = await api.get(`/api/quiz/course/${courseId}`);
      console.log(`${courseId} quizzes response:`, res.data);
      setQuizzes(res.data.data);
      console.log("Quizzes for course:", res.data.data);
    } catch {
      toast.error("Failed to load quizzes");
    } finally {
      setLoading(false);
    }
  };

  const uniqueCourses = Array.from(
    new Map(courses.map((c) => [c.course_id, c])).values(),
  );

  return (
    <div className="p-6 md:p-10 space-y-8 bg-[#f8fafb] min-h-screen text-[#1a2b2b]">
      {/* Header */}
      <header className="flex justify-between items-end">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00796b]">
            Available Modules
          </span>
          <h1 className="text-3xl font-black text-[#0f1717]">
            Your Quizzes <span className="text-[#00796b]">.</span>
          </h1>
        </div>
      </header>

      {/* Course Selection Tabs */}
      <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
        {uniqueCourses.map((c) => (
          <button
            key={c.course_id}
            onClick={() => {
              setSelectedCourse(c.course_id);
              fetchQuizzes(c.course_id);
            }}
            className={`px-6 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all border-2
            ${
              selectedCourse === c.course_id
                ? "bg-[#00796b] border-[#00796b] text-white shadow-lg shadow-[#00796b]/20"
                : "bg-white border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            }`}
          >
            {c.course_name}
          </button>
        ))}
      </div>

      {/* Quiz List Grid */}
      {!selectedCourse ? (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-200 rounded-[2rem] bg-white/50">
          <p className="text-gray-400 font-medium italic">
            Select a module to view assignments
          </p>
        </div>
      ) : loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#00796b]/20 border-t-[#00796b] rounded-full animate-spin" />
        </div>
      ) : quizzes.length === 0 ? (
        <p className="text-center text-gray-400 py-20 bg-white rounded-[2rem]">
          No active quizzes found.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((q) => (
            <div
              key={q.id}
              className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50 hover:shadow-xl transition-all duration-300 group"
            >
              <h3 className="font-bold text-[#0f1717] text-lg mb-2">
                {q.title}
              </h3>

              <div className="flex items-center gap-2 text-[#00796b] text-[10px] font-black uppercase tracking-tighter mb-6">
                <span className="bg-[#00796b]/10 px-2 py-1 rounded-md">
                  ⏱ {q.time_limit_minutes} Min
                </span>
              </div>

              {/* ✅ ACTION AREA */}
              {q.attempted ? (
                <div className="w-full flex flex-col items-center justify-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.2em]">
                  <span>Completed</span>
                  <span className="text-sm font-bold normal-case tracking-normal">
                    Score: {q.score ?? 0}
                  </span>
                </div>
              ) : (
                <button
                  onClick={() => navigate(`/dashboard/quiz/attempt/${q.id}`)}
                  className="w-full bg-[#00796b] text-white py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#004d40] transition-colors active:scale-95"
                >
                  Begin Attempt
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentQuiz;
