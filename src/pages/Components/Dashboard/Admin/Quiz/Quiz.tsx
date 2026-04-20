import React, { useEffect, useState } from "react";
import { HiOutlineChartPie } from "react-icons/hi";
import { toast } from "react-hot-toast";
import api from "../../../../../api/axiosInstance";

interface Analytics {
  title: string;
  course_name: string;
  avg_score: number;
  total_attempts: number;
}

const AdminQuizAnalytics = () => {
  const [analytics, setAnalytics] = useState<Analytics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get("/api/quiz/analytics");
      setAnalytics(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-[60vh] text-gray-400 text-sm">
        Loading analytics...
      </div>
    );

  return (
    <div className="p-4 md:p-6 space-y-5 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          Quiz Analytics 📊
        </h1>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {analytics.length > 0 ? (
          analytics.map((item, i) => (
            <div
              key={i}
              className="group relative bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              {/* Top Section */}
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 transition">
                  <HiOutlineChartPie size={18} />
                </div>

                <span className="text-xs font-semibold text-gray-400">
                  #{i + 1}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-sm font-semibold text-gray-800 line-clamp-1">
                {item.title}
              </h3>

              {/* Course */}
              <p className="text-xs text-gray-400 mb-3 line-clamp-1">
                {item.course_name}
              </p>

              {/* Stats */}
              <div className="flex items-center justify-between text-xs mt-2">
                <div>
                  <p className="text-gray-400">Avg Score</p>
                  <p className="font-bold text-indigo-600">
                    {item.avg_score}%
                  </p>
                </div>

                <div>
                  <p className="text-gray-400">Attempts</p>
                  <p className="font-bold text-gray-700">
                    {item.total_attempts}
                  </p>
                </div>
              </div>

              {/* Bottom Accent Line */}
              <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-indigo-500 group-hover:w-full transition-all duration-300 rounded-b-2xl"></div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-400 py-10">
            No analytics available 🚫
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminQuizAnalytics;