import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HiOutlineHome,
  HiOutlineShieldCheck,
  HiOutlineAcademicCap, 
  HiOutlineUserGroup,
  HiOutlineBookOpen,
  HiOutlineDocumentSearch, 
  HiOutlineChartPie,
  HiOutlineUser,
  HiOutlineLibrary,
  HiOutlineServer,
  HiOutlineLightningBolt,
  HiOutlineBell,
  HiOutlineRefresh, 
} from "react-icons/hi";

const Main: React.FC = () => {
  const navigate = useNavigate();
  const [role] = useState<string | null>(() =>
    localStorage.getItem("userRole"),
  );
  const [activeTab, setActiveTab] = useState("overview");
 
  return (
  <div className="dashboard-container p-4 md:p-6 bg-[#f8fafc] min-h-screen relative overflow-hidden font-sans">
  
  {/* BACKGROUND CIRCUIT PATTERN - Visual Depth */}
  <svg className="absolute top-0 right-0 opacity-[0.04] pointer-events-none" width="400" height="400" viewBox="0 0 100 100">
    <path d="M0 20 H30 V50 H100 M30 50 V100" fill="none" stroke="#00796b" strokeWidth="0.5" />
    <circle cx="30" cy="20" r="1.5" fill="#00796b" />
    <circle cx="100" cy="50" r="1.5" fill="#00796b" />
  </svg>

  {/* 1. TOP UTILITY BAR - Ultra Compact */}
  <div className="mb-6 flex flex-wrap items-center justify-between gap-4 relative z-10">
    <div className="flex items-center gap-3">
      <div className="h-12 w-12 bg-[#00796b] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-teal-200/50 group cursor-crosshair">
        <HiOutlineUser className="text-xl group-hover:scale-110 transition-transform" />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-ping"></span>
          <nav className="text-[8px] font-black text-[#00796b] uppercase tracking-[0.4em] leading-none">System Live</nav>
        </div>
        <h1 className="text-xl font-black text-slate-800 tracking-tighter leading-tight">
          ID: {role || "User"}_NODE_01
        </h1>
      </div>
    </div>
    
    {/* Micro-Vitals Filler */}
    <div className="hidden lg:flex items-center gap-6 px-6 py-2.5 bg-white rounded-2xl border border-slate-100 shadow-sm">
      {[
        { label: "CPU", val: "12%", color: "text-emerald-500" },
        { label: "MEM", val: "4.2GB", color: "text-blue-500" },
        { label: "LATENCY", val: "24ms", color: "text-teal-500" }
      ].map((v, i) => (
        <div key={i} className="flex flex-col">
          <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">{v.label}</span>
          <span className={`text-[10px] font-bold ${v.color} tabular-nums`}>{v.val}</span>
        </div>
      ))}
    </div>
  </div>

  {/* 2. MAIN HUB CARD */}
  <div className="bg-white rounded-[2rem] shadow-2xl shadow-teal-900/5 border border-white relative overflow-hidden transition-all duration-500">
    
    {/* TAB NAVIGATION - Tab-style with active glow */}
    <div className="flex items-center border-b border-slate-50 bg-slate-50/30 px-4">
      {[
        { id: "overview", label: "Overview", icon: <HiOutlineHome /> },
        { id: "classes", label: "Roster", icon: <HiOutlineAcademicCap />, hide: role !== "Teacher" }
      ].map((tab) => !tab.hide && (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center gap-2 px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] transition-all relative group ${
            activeTab === tab.id ? "text-[#00796b]" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          {tab.icon} {tab.label}
          {activeTab === tab.id && (
            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00796b] shadow-[0_-4px_8px_rgba(0,121,107,0.3)]" />
          )}
        </button>
      ))}
    </div>

    {/* 3. CONTENT GRID */}
    <div className="p-5 md:p-8 relative">
      
      {/* BACKGROUND GRAPHIC */}
      <HiOutlineLibrary className="absolute -bottom-10 -right-10 opacity-[0.015] pointer-events-none" size={280} />

      {activeTab === "overview" && (
        <div className="space-y-8 relative z-10">
          
          {/* STATS BENTO */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Active Nodes", val: "12", icon: <HiOutlineServer />, color: "bg-teal-50" },
              { label: "Sync Rate", val: "99%", icon: <HiOutlineRefresh />, color: "bg-blue-50" },
              { label: "Alerts", val: "07", icon: <HiOutlineBell />, color: "bg-amber-50" },
              { label: "Load", val: "Normal", icon: <HiOutlineLightningBolt />, color: "bg-emerald-50" },
            ].map((stat, i) => (
              <div key={i} className="p-4 bg-white border border-slate-100 rounded-2xl flex flex-col gap-2 group hover:border-teal-200 transition-colors">
                <div className={`w-8 h-8 ${stat.color} rounded-lg flex items-center justify-center text-slate-600 group-hover:scale-110 transition-transform`}>
                  {React.cloneElement(stat.icon, { size: 14 })}
                </div>
                <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">{stat.label}</p>
                  <p className="text-xl font-black text-slate-800 tracking-tighter">{stat.val}</p>
                </div>
              </div>
            ))}
          </div>

          {/* INTUITIVE ACTION TILES */}
          {role === "Admin" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h3 className="text-[9px] font-black text-[#00796b] uppercase tracking-[0.3em]">Quick Directives</h3>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-teal-100 to-transparent"></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Registry", icon: <HiOutlineShieldCheck />, path: "/dashboard/admin" },
                  { label: "Audits", icon: <HiOutlineDocumentSearch />, path: "/dashboard/admin/logs" },
                  { label: "Modules", icon: <HiOutlineBookOpen />, path: "/dashboard/admin/addcourse" },
                  { label: "Faculty", icon: <HiOutlineUserGroup />, path: "/dashboard/admin/instructors" },
                ].map((action, i) => (
                  <button
                    key={i}
                    onClick={() => navigate(action.path)}
                    className="flex flex-col items-center justify-center p-5 bg-white border border-slate-100 rounded-2xl hover:border-[#00796b] hover:bg-teal-50/10 transition-all group relative overflow-hidden"
                  >
                    {/* Hover Graphic Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-500/0 via-teal-500/0 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-[#00796b] group-hover:text-white group-hover:rotate-6 transition-all mb-3 shadow-sm">
                      {action.icon}
                    </div>
                    <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* COMPACT ANALYTICS PLACEHOLDERS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 p-6 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-100 flex items-center justify-center gap-4 group">
               <HiOutlineChartPie className="text-slate-200 group-hover:text-teal-200 transition-colors" size={32} />
               <div className="text-left">
                  <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.3em]">Resource Map</p>
                  <p className="text-[10px] font-medium text-slate-400">Visualization data stream pending...</p>
               </div>
            </div>
            <div className="p-6 bg-[#00796b] rounded-[2rem] text-white flex flex-col justify-between relative overflow-hidden">
               <HiOutlineLightningBolt className="absolute -right-4 -top-4 text-7xl text-white/10" />
               <p className="text-[8px] font-black uppercase tracking-[0.4em] opacity-60">System Pulse</p>
               <p className="text-lg font-black leading-tight">Optimization is at Peak</p>
               <div className="h-1 w-full bg-white/20 rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-white w-2/3 animate-pulse"></div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>

    {/* 4. TIGHT STATUS FOOTER */}
    <div className="bg-slate-50/50 px-8 py-3 flex flex-wrap justify-between items-center border-t border-slate-50 gap-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">SSL Encrypted</span>
        </div>
        <div className="h-3 w-[1px] bg-slate-200"></div>
        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">User: {role}</span>
      </div>
      <div className="text-[8px] font-black text-slate-300 uppercase tracking-widest tabular-nums">
        {new Date().toLocaleDateString()} • v4.2.0-STABLE
      </div>
    </div>
  </div>
</div>
  );
};

export default Main;
