import React, { useEffect, useState } from "react";
import api from "../../../../api/axiosInstance";
import { HiOutlinePlus,
  HiOutlineClock,
  HiOutlineBookOpen,
  HiOutlineTrash
 } from "react-icons/hi";
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
      console.log("Courses for quiz page:", res.data.data);
      setSelectedCourse(res.data.data[0]?.id || null);
      fetchQuizzes(res.data.data[0]?.id);
      
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
    <div className="p-6 md:p-10 space-y-8 bg-[#f8fafb] min-h-screen font-sans text-[#1a2b2b]">
      
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">System Live</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-[#0f1717]">
            Quiz Dashboard <span className="text-[#00796b]">.</span>
          </h1>
        </div>

        {userRole === "Teacher" && (
          <button
            onClick={() => setShowModal(true)}
            className="group relative bg-[#00796b] hover:bg-[#004d40] text-white px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-[0_10px_20px_rgba(0,121,107,0.2)] hover:shadow-[0_15px_25px_rgba(0,121,107,0.3)] active:scale-95 flex items-center gap-3"
          >
            <HiOutlinePlus size={20} className="group-hover:rotate-90 transition-transform" />
            Create New Quiz
          </button>
        )}
      </header>

      {/* Navigation / Course Selector */}
      <nav className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
        {courses.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              setSelectedCourse(c.id);
              fetchQuizzes(c.id);
            }}
            className={`px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider border-2 transition-all duration-200 whitespace-nowrap
              ${selectedCourse === c.id
                ? "bg-white border-[#00796b] text-[#00796b] shadow-sm"
                : "bg-transparent border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              }`}
          >
            {c.name}
          </button>
        ))}
      </nav>

      {/* Main Content Area */}
      <main className="min-h-[400px]">
        {!selectedCourse ? (
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-[2rem] bg-white/50">
            <HiOutlineBookOpen size={40} className="text-gray-300 mb-4" />
            <p className="text-gray-400 font-medium italic">Select a course module to begin</p>
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-[#00796b]/20 border-t-[#00796b] rounded-full animate-spin" />
          </div>
        ) : quizzes.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2rem] shadow-sm border border-gray-100">
            <span className="text-4xl block mb-4">Empty</span>
            <p className="text-gray-400">No active assessments found for this unit.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((q) => (
              <div
                key={q.id}
                className="group bg-white p-8 rounded-[2rem] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500 border border-gray-50 relative overflow-hidden"
              >
                {/* Decorative Accent */}
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                    <HiOutlineBookOpen size={60} />
                </div>

                <h3 className="font-bold text-[#0f1717] text-lg leading-tight mb-2 pr-8">{q.title}</h3>
                
                <div className="flex items-center gap-2 text-[#00796b] font-bold text-[11px] uppercase tracking-tighter mb-6">
                  <HiOutlineClock size={14} />
                  <span>{q.time_limit_minutes} Minutes Duration</span>
                </div>

                <div className="mt-auto">
                  {userRole === "Student" ? (
                    <button className="w-full bg-[#00796b] text-white py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#004d40] transition-colors shadow-lg shadow-[#00796b]/10">
                      Start Assessment
                    </button>
                  ) : (
                    <button
                      onClick={() => deleteQuiz(q.id)}
                      className="w-full border-2 border-red-50 text-red-400 py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <HiOutlineTrash size={16} /> Delete Data
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer Meta */}
      <footer className="pt-10 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] border-t border-gray-100 gap-4">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500" /> SSL Encrypted
          </span>
          <span>User: {userRole}</span>
        </div>
        <div>
          {new Date().toLocaleDateString()} — V4.2.0-STABLE
        </div>
      </footer>

      {showModal && <CreateQuizModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default QuizPage;
