import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { HiOutlineChartPie, HiOutlinePlus } from "react-icons/hi";
import api from "../../../../api/axiosInstance";
interface Quiz {
  id: number;
  title: string;
  time_limit_minutes: number;
}
interface Analytics {
  title: string;
  course_name: string;
  avg_score: number;
  total_attempts: number;
}
const Quiz = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [analytics, setAnalytics] = useState<Analytics[]>([]);
  const [loading, setLoading] = useState(true);
  const userRole = localStorage.getItem("userRole") || "Student";

  useEffect(() => {
    fetchData();
  }, [userRole]);

  const fetchData = async () => {
    try {
      setLoading(true);

      if (userRole === "Admin") {
        const res = await api.get("/api/quiz/analytics");
        setAnalytics(res.data.data);
      } else if (userRole === "Teacher") {
        const res = await api.get("/api/quiz/teacher");
        setQuizzes(res.data.data);
      } else {
        const res = await api.get("/api/quiz/course/1");
        setQuizzes(res.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const deleteQuiz = async (id: number) => {
    try {
      await api.delete(`/api/quiz/${id}`);
      toast.success("Quiz deleted");
      fetchData();
    } catch (err) {
      console.error(err);

      toast.error("Delete failed");
    }
  };
 
  const createQuiz = async () => {
    try {
      const newQuiz = {
        title: "New Quiz",
        description: "Quiz Description",
        course_id: 34, // Change as needed
        time_limit_minutes: 30,
        questions: [
          {
            question_text: "Sample Question?",
            options: [
              { text: "Option 1", is_correct: false },
              { text: "Option 2", is_correct: true },
              { text: "Option 3", is_correct: false },
            ],
          },
        ],
      };
      await api.post("/api/quiz/full-create", newQuiz);
      toast.success("Quiz created");
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Creation failed");
    }
  };


  if (loading) return <>Loading...</>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        {userRole === "Admin"
          ? "Analytics"
          : userRole === "Teacher"
            ? "Manage Quizzes"
            : "Attempt Quizzes"}
      </h1>

      {/* ADMIN */}
      {userRole === "Admin" && (
        <div className="grid grid-cols-3 gap-4">
          {analytics.length > 0 ? (
            analytics.map((item, i) => (
              <div key={i} className="p-6 bg-white shadow rounded-xl">
                <HiOutlineChartPie />
                <h3>{item.title}</h3>
                <p>{item.course_name}</p>
                <p>Avg: {item.avg_score}%</p>
                <p>Attempts: {item.total_attempts}</p>
              </div>
            ))
          ) : (
            <p>No analytics</p>
          )}
        </div>
      )}

      {/* TEACHER */}
      {userRole === "Teacher" && (
        <div className="space-y-4">
          {/* Always show Create Button */}
          <button onClick={() => createQuiz()} className="bg-[#00796b] text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg">
            <HiOutlinePlus size={18} /> Create New Quiz
          </button>

          {/* If quizzes exist */}
          {quizzes && quizzes.length > 0 ? (
            quizzes.map((quiz) => (
              <div key={quiz.id} className="bg-white p-6 rounded-xl shadow">
                <h3 className="font-bold">{quiz.title}</h3>
                <p>{quiz.time_limit_minutes} Minutes</p>
                <button
                  onClick={() => deleteQuiz(quiz.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded mt-2"
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            // Empty state
            <div className="text-center text-slate-400 font-semibold py-10">
              No quizzes available 🚫 <br />
              <span className="text-sm">
                Click "Create New Quiz" to get started
              </span>
            </div>
          )}
        </div>
      )}

      {/* STUDENT */}
      {userRole === "Student" && (
        <div>
          {quizzes.length > 0 ? (
            quizzes.map((q) => (
              <div key={q.id} className="p-4 bg-white shadow rounded">
                <h3>{q.title}</h3>
                <p>{q.time_limit_minutes} min</p>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded">
                  Start Quiz
                </button>
              </div>
            ))
          ) : (
            <p>No quizzes available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Quiz;
