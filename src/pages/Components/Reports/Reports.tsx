import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import {
  HiOutlineChartBar,
  HiOutlineUserGroup,
  HiOutlineAcademicCap,
  HiOutlineBookOpen,
  HiOutlineDownload,
  HiOutlineRefresh,
} from "react-icons/hi";
import api from "../../../api/axiosInstance";

interface AnalyticsData {
  stats: {
    totalStudents: number;
    activeTeachers: number;
    totalCourses: number;
    enrollmentRate: string;
  };
  recentActivity: {
    id: number;
    user: string;
    type: string;
    course: string;
    table_name: string;
    date: string;
  }[];
}

const Report: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/admin/analytics/overview");
      setData(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch system analytics.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading)
    return (
      <div className="p-6 flex justify-center items-center min-h-[400px]">
        <HiOutlineRefresh className="animate-spin text-indigo-600" size={40} />
      </div>
    );

  const handleSavePDF = () => async () => {
    toast.success("Comming Soon..");
  };
  const statsCards = [
    {
      label: "Total Students",
      value: data?.stats.totalStudents,
      icon: <HiOutlineUserGroup />,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Active Teachers",
      value: data?.stats.activeTeachers,
      icon: <HiOutlineAcademicCap />,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Total Courses",
      value: data?.stats.totalCourses,
      icon: <HiOutlineBookOpen />,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Avg. Enrollment",
      value: `${data?.stats.enrollmentRate}%`,
      icon: <HiOutlineChartBar />,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            System Analytics
          </h1>
          <p className="text-slate-500">
            Live overview of institutional performance
          </p>
        </div>
        <button
          onClick={handleSavePDF()}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-bold text-sm shadow-lg shadow-indigo-200"
        >
          <HiOutlineDownload size={18} /> Export PDF Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4"
          >
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} text-2xl`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Recent Activity Logs</h3>
            <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
              TOP 5
            </span>
          </div>
          <div className="divide-y divide-slate-50">
            {data?.recentActivity.map((log) => (
              <div
                key={log.id}
                className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {/* Color indicator based on operation type */}
                  <div
                    className={`w-2 h-2 rounded-full ${
                      log.type === "INSERT"
                        ? "bg-emerald-500"
                        : log.type === "UPDATE"
                          ? "bg-amber-500"
                          : "bg-rose-500"
                    }`}
                  ></div>

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      <b>Admin </b>
                      <span className="font-normal text-slate-500">
                        performed
                      </span>{" "}
                      {log.type}
                    </p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-tight">
                    {" "}  Target Table:{" "}
                      <span className="font-bold">{log.table_name}</span>
                    </p>
                  </div>
                </div>
                <span className="text-xs font-medium text-slate-400">
                  {new Date(log.date).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Insight Card */}
        <div className="bg-indigo-900 rounded-2xl p-6 text-white shadow-xl shadow-indigo-100 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg mb-2">Capacity Insight</h3>
            <p className="text-indigo-200 text-sm leading-relaxed">
              Based on {data?.stats.totalCourses} active courses, your system is
              currently operating at a {data?.stats.enrollmentRate}% active
              enrollment rate.
            </p>
          </div>
          <div className="mt-8 pt-6 border-t border-indigo-800">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] uppercase font-bold text-indigo-300">
                  Target Efficiency
                </p>
                <p className="text-xl font-bold">High Capacity</p>
              </div>
              <div className="h-14 w-14 rounded-full border-4 border-indigo-500 border-t-emerald-400 flex items-center justify-center text-xs font-bold">
                {data?.stats.enrollmentRate}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
