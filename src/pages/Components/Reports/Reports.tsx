import React ,{useEffect} from "react";
import { toast } from "react-hot-toast";
import { 
  HiOutlineChartBar, 
  HiOutlineUserGroup, 
  HiOutlineAcademicCap, 
  HiOutlineBookOpen,
  HiOutlineDownload
} from "react-icons/hi";

const Report: React.FC = () => {
  // Static Summary Data

  useEffect(() => { 
    toast.success("This is for demo purposes only. Report data is static. (Demo)");
  } , []);
  const stats = [
    { label: "Total Students", value: "842", icon: <HiOutlineUserGroup />, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Active Teachers", value: "36", icon: <HiOutlineAcademicCap />, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Total Courses", value: "12", icon: <HiOutlineBookOpen />, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Avg. Enrollment", value: "70.1%", icon: <HiOutlineChartBar />, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  const recentActivity = [
    { id: 1, type: "Enrollment", user: "Pankaj Narwade", course: "Advanced React", date: "2026-01-24" },
    { id: 2, type: "New Course", user: "Dr. Smith", course: "Node.js Backend", date: "2026-01-23" },
    { id: 3, type: "Certification", user: "John Doe", course: "Database Design", date: "2026-01-22" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header with Export Action */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            System Analytics
          </h1>
          <p className="text-slate-500">Overview of institutional performance and data</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-bold text-sm shadow-lg shadow-indigo-200">
          <HiOutlineDownload size={18} />
          Export PDF Report
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} text-2xl`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed (2/3 width) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50">
            <h3 className="font-bold text-slate-800">Recent System Activity</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {recentActivity.map((act) => (
              <div key={act.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {act.user} <span className="font-normal text-slate-500">performed</span> {act.type}
                    </p>
                    <p className="text-xs text-slate-400">{act.course}</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-slate-400">{act.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Insights (1/3 width) */}
        <div className="bg-indigo-900 rounded-2xl p-6 text-white shadow-xl shadow-indigo-100 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg mb-2">Enrollment Insight</h3>
            <p className="text-indigo-200 text-sm leading-relaxed">
              Course enrollments have increased by 12% this month. The most popular category remains "Full-Stack Development".
            </p>
          </div>
          <div className="mt-8 pt-6 border-t border-indigo-800">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] uppercase font-bold text-indigo-300">Target Goal</p>
                <p className="text-xl font-bold">92% Capacity</p>
              </div>
              <div className="h-12 w-12 rounded-full border-4 border-indigo-500 border-t-white flex items-center justify-center text-[10px] font-bold">
                78%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;