import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import {
  HiOutlineChartBar,
  HiOutlineUserGroup,
  HiOutlineAcademicCap,
  HiOutlineBookOpen,
  HiOutlineDownload,
  HiOutlineRefresh, 
  HiOutlineViewGrid
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
  const handleSavePDF = async () => {
    try {
      const response = await api.get("/api/admin/reports/export-pdf");

      if(response.status !== 200) {
        toast.error("Failed to generate PDF report.");
        return;
      }
      const blob = new Blob([response.data], { type: "application/pdf" });

      // Safety check: if blob is empty, don't trigger download
      if (blob.size === 0) {
        console.error("Received empty blob from server");
        return;
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "System_Report.pdf";
      document.body.appendChild(a); // Recommended for better browser compatibility
      a.click();

      // Cleanup
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
    }
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
    <div className="p-4 md:p-6   mx-auto space-y-8 ">
  {/* 1. HEADER SECTION */}
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
    <div>
      <nav className="text-[10px] font-black text-[#00796b] uppercase tracking-[0.2em] mb-2">
        Institutional Intelligence
      </nav>
      <h1 className="text-2xl md:text-3xl font-black text-slate-800 flex items-center gap-2 tracking-tight">
        System Analytics
      </h1>
      <p className="text-slate-400 text-sm font-medium">
        Live registry of operational and institutional performance metrics.
      </p>
    </div>
    <button
      onClick={handleSavePDF}
      className="flex items-center gap-2 px-6 py-3 bg-[#00796b] hover:bg-[#004d40] text-white rounded-2xl transition-all font-black uppercase tracking-widest text-[11px] shadow-xl shadow-teal-100 active:scale-95"
    >
      <HiOutlineDownload size={18} /> Export PDF Report
    </button>
  </div>

  {/* 2. CORE METRICS GRID */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {statsCards.map((stat, index) => (
      <div
        key={index}
        className="bg-white p-6 rounded-[2rem] border border-slate-50 shadow-xl shadow-teal-900/5 flex items-center gap-5 hover:shadow-teal-900/10 transition-shadow"
      >
        <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} text-2xl shadow-inner`}>
          {stat.icon}
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
            {stat.label}
          </p>
          <p className="text-2xl font-black text-slate-800 tracking-tight">{stat.value}</p>
        </div>
      </div>
    ))}
  </div>

  {/* 3. LOGS & INSIGHTS SPLIT */}
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    
    {/* RECENT ACTIVITY LOGS */}
    <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-50 shadow-xl shadow-teal-900/5 overflow-hidden">
      <div className="px-8 py-5 border-b border-slate-50 bg-gray-50/30 flex justify-between items-center">
        <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest">Recent Activity Logs</h3>
        <span className="text-[10px] bg-teal-50 text-[#00796b] border border-teal-100 px-3 py-1 rounded-full font-black uppercase tracking-tighter">
          Registry Tracking
        </span>
      </div>
      <div className="divide-y divide-slate-50">
        {data?.recentActivity.map((log) => (
          <div
            key={log.id}
            className="px-8 py-4 flex items-center justify-between hover:bg-teal-50/30 transition-all group"
          >
            <div className="flex items-center gap-4">
              {/* Type-based indicator */}
              <div
                className={`w-2.5 h-2.5 rounded-full shadow-sm animate-pulse ${
                  log.type === "INSERT" ? "bg-emerald-500" : 
                  log.type === "UPDATE" ? "bg-amber-500" : "bg-rose-500"
                }`}
              />

              <div>
                <p className="text-sm font-bold text-slate-700">
                  <span className="text-[#00796b] font-black uppercase text-[11px] tracking-tight mr-1">Admin</span>
                  <span className="font-medium text-slate-400">performed</span>{" "}
                  <span className="text-slate-800">{log.type}</span>
                </p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                  Target Object: <span className="text-slate-600 group-hover:text-[#00796b]">{log.table_name}</span>
                </p>
              </div>
            </div>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">
              {new Date(log.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
            </span>
          </div>
        ))}
      </div>
    </div>

    {/* OPERATIONAL CAPACITY CARD */}
    <div className="bg-[#004d40] rounded-[2.5rem] p-8 text-white shadow-2xl shadow-teal-900/20 flex flex-col justify-between relative overflow-hidden group">
      {/* Abstract Background Detail */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-700" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md">
            <HiOutlineViewGrid className="text-teal-300" />
          </div>
          <h3 className="font-black uppercase tracking-widest text-[11px] text-teal-300">Capacity Insight</h3>
        </div>
        <p className="text-teal-50 text-sm leading-relaxed font-medium">
          Based on <span className="text-white font-black">{data?.stats.totalCourses}</span> active modules, the system is
          operating at <span className="text-teal-300 font-black">{data?.stats.enrollmentRate}%</span> enrollment velocity.
        </p>
      </div>

      <div className="mt-12 pt-8 border-t border-white/10 relative z-10">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[10px] uppercase font-black text-teal-400 tracking-[0.2em] mb-1">
              Efficiency Target
            </p>
            <p className="text-xl font-black tracking-tight">Optimal Load</p>
          </div>
          <div className="h-16 w-16 rounded-[1.5rem] bg-white/10 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center">
             <span className="text-lg font-black">{data?.stats.enrollmentRate}%</span>
             <span className="text-[8px] font-black uppercase opacity-60">Rate</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  );
};

export default Report;
