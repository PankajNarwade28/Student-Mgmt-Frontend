import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineHome,
  HiOutlineShieldCheck,
  HiOutlineAcademicCap,
  HiOutlineChartBar,
  HiOutlineUserGroup,
  HiOutlineBookOpen,
  HiOutlineDocumentSearch,
  HiOutlineDatabase,
  HiOutlineChartPie,
  HiOutlineUser,
  HiOutlineLibrary,
  HiOutlineServer,
  HiOutlineLightningBolt,
  HiOutlineBell,
  HiChevronRight, 
} from "react-icons/hi";

const Main: React.FC = () => {
  const navigate = useNavigate();
  const [role] = useState<string | null>(() =>
    localStorage.getItem("userRole"),
  );
  const [activeTab, setActiveTab] = useState("overview");

  // const getTabStyle = (tabId: string) => `
  //   flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all border-b-2 -mb-[1px]
  //   ${
  //     activeTab === tabId
  //       ? "border-slate-800 text-slate-900 font-semibold"
  //       : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
  //   }
  // `;

  return (
   <div className="dashboard-container p-4 md:p-8 bg-[#f8fafc] min-h-screen relative overflow-hidden">
  
  {/* DECORATIVE BACKGROUND SVGS - Fills empty space with a subtle tech pattern */}
  <div className="absolute top-0 right-0 opacity-[0.03] pointer-events-none translate-x-1/4 -translate-y-1/4">
    <svg width="600" height="600" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" stroke="currentColor" fill="none" strokeWidth="0.5" strokeDasharray="2 2" /></svg>
  </div>

  {/* 1. ULTRA-COMPACT HEADER */}
  <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
    <div className="flex items-center gap-4">
      <div className="h-14 w-14 bg-[#00796b] rounded-[1.25rem] flex items-center justify-center text-white shadow-lg shadow-teal-200">
        <HiOutlineUser className="text-2xl" />
      </div>
      <div>
        <nav className="text-[9px] font-black text-[#00796b] uppercase tracking-[0.3em] mb-0.5 flex items-center gap-2">
          <span className="inline-block w-2 h-[1px] bg-teal-600"></span> System Gateway
        </nav>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none">
          Welcome, {role || "User"}
        </h1>
      </div>
    </div>
    
    <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
      <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
        <HiOutlineShieldCheck className="text-[#00796b]" />
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Auth Level</span>
        <span className="text-[10px] font-black text-[#00796b] uppercase tracking-tighter bg-teal-50 px-2 py-0.5 rounded-md">{role}</span>
      </div>
    </div>
  </div>

  {/* 2. MAIN REGISTRY SURFACE */}
  <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-teal-900/5 border border-white relative overflow-hidden">
    
    {/* TAB NAVIGATION with Micro-Icons */}
    <div className="flex items-center border-b border-slate-50 bg-slate-50/40 px-6">
      <button
        onClick={() => setActiveTab("overview")}
        className={`flex items-center gap-2 px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2 -mb-[1px] ${
          activeTab === "overview" 
          ? "border-[#00796b] text-[#00796b] bg-white shadow-[0_-4px_10px_rgba(0,121,107,0.03)]" 
          : "border-transparent text-slate-400 hover:text-slate-600"
        }`}
      >
        <HiOutlineHome size={16} /> Overview
      </button>

      {role === "Teacher" && (
        <button
          onClick={() => setActiveTab("classes")}
          className={`flex items-center gap-2 px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2 -mb-[1px] ${
            activeTab === "classes" 
            ? "border-[#00796b] text-[#00796b] bg-white shadow-[0_-4px_10px_rgba(0,121,107,0.03)]" 
            : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          <HiOutlineAcademicCap size={16} /> Classes
        </button>
      )}
    </div>

    {/* 3. CORE CONTENT AREA */}
    <div className="p-6 md:p-10 relative">
      
      {/* BACKGROUND WATERMARK ICON - Fills the empty "white space" of the card */}
      <div className="absolute bottom-10 right-10 opacity-[0.02] pointer-events-none">
        <HiOutlineLibrary size={300} />
      </div>

      {activeTab === "overview" && (
        <div className="space-y-10 relative z-10">
          
          {/* STATISTICS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Active Nodes", val: "12", icon: <HiOutlineServer />, color: "teal" },
              { label: "Pending Jobs", val: "04", icon: <HiOutlineLightningBolt />, color: "emerald" },
              { label: "System Alerts", val: "07", icon: <HiOutlineBell />, color: "amber" },
            ].map((stat, i) => (
              <div key={i} className="group p-6 bg-white border border-slate-100 rounded-[2rem] hover:shadow-xl hover:shadow-teal-900/5 transition-all flex justify-between items-end relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                  <p className="text-4xl font-black text-slate-800 tracking-tighter">{stat.val}</p>
                </div>
                <div className="text-3xl text-slate-100 group-hover:text-teal-50 transition-colors absolute right-4 top-4">
                  {stat.icon}
                </div>
              </div>
            ))}
          </div>

          {/* ADMIN ACTION GRID - Filling space with a 2x2 density */}
          {role === "Admin" && (
            <div className="pt-8 border-t border-slate-50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Operational Controls</h3>
                <div className="h-[1px] flex-1 bg-slate-50 mx-4"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "User Registry", desc: "Access level & permission protocols", icon: <HiOutlineShieldCheck />, path: "/dashboard/admin" },
                  { label: "Security Audit", desc: "Timestamped system activity logs", icon: <HiOutlineDocumentSearch />, path: "/dashboard/admin/logs" },
                  { label: "Curriculum Map", desc: "Initialize new educational modules", icon: <HiOutlineBookOpen />, path: "/dashboard/admin/addcourse" },
                  { label: "Faculty Hub", desc: "Manage instructor access nodes", icon: <HiOutlineUserGroup />, path: "/dashboard/admin/instructors" },
                ].map((action, i) => (
                  <button
                    key={i}
                    onClick={() => navigate(action.path)}
                    className="flex items-center justify-between p-5 bg-white border border-slate-50 rounded-[1.5rem] hover:border-[#00796b] hover:bg-teal-50/20 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-slate-50 rounded-xl text-slate-300 group-hover:bg-[#00796b] group-hover:text-white transition-all">
                        <span className="text-2xl">{action.icon}</span>
                      </div>
                      <div className="text-left">
                        <p className="font-black text-slate-800 text-sm tracking-tight">{action.label}</p>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter mt-0.5">{action.desc}</p>
                      </div>
                    </div>
                    <HiChevronRight className="text-slate-200 group-hover:text-[#00796b] group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* DATA VISUALIZATION AREA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="p-8 bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-300 min-h-[160px] relative overflow-hidden group">
              <HiOutlineChartPie size={48} className="mb-4 opacity-20 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500" />
              <p className="text-[9px] font-black uppercase tracking-[0.4em]">Resource Distribution</p>
            </div>
            <div className="p-8 bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-300 min-h-[160px] relative overflow-hidden group">
              <HiOutlineChartBar size={48} className="mb-4 opacity-20 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500" />
              <p className="text-[9px] font-black uppercase tracking-[0.4em]">Velocity Analytics</p>
            </div>
          </div>
        </div>
      )}
    </div>

    {/* 4. STATUS BAR FOOTER - Fills the bottom area */}
    <div className="bg-slate-50/80 px-10 py-4 flex flex-col md:flex-row justify-between items-center border-t border-slate-50 gap-4">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Network Secure</span>
        </div>
        <div className="flex items-center gap-2">
          <HiOutlineDatabase className="text-teal-600" />
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Database Sync Active</span>
        </div>
      </div>
      <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
        System v4.2.0 • Last Audit: {new Date().toLocaleTimeString()}
      </div>
    </div>
  </div>
</div>
  );
};

export default Main;
