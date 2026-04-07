import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { 
  HiOutlineCalendar, 
  HiOutlineClock, 
  HiOutlineLocationMarker, 
  HiOutlineUser,
  HiOutlineDotsVertical
} from "react-icons/hi";

interface LogEntry {
  id: string;
  title: string;
  time: string;
  duration: string;
  location: string;
  instructor?: string;
  batch?: string;
  type: "Lecture" | "Lab" | "Exam" | "Seminar";
}


const Logs: React.FC = () => {
  // Simulating the view based on role
  const [viewAs, setViewAs] = useState<"Student" | "Teacher">("Student");

 
 useEffect(() => {
  toast.success("This is for demo purposes only. Schedule data is static. (Demo)");
}, []);
  const scheduleData: LogEntry[] = [
    {
      id: "L1",
      title: "AngularJS - Directives & Data Binding",
      time: "10:00 AM",
      duration: "1h 30m",
      location: "Lab 04",
      instructor: "Prof. S. Patil",
      batch: "MCA-II",
      type: "Lecture"
    },
    {
      id: "L2",
      title: "DMBI Practical - Power BI Dashboard",
      time: "12:30 PM",
      duration: "2h 00m",
      location: "Center of Excellence",
      instructor: "Dr. A. K. Sharma",
      batch: "MCA-II",
      type: "Lab"
    },
    {
      id: "L3",
      title: "SQA Weekly Assessment",
      time: "03:30 PM",
      duration: "1h 00m",
      location: "Seminar Hall B",
      instructor: "Prof. M. Deshpande",
      batch: "MCA-II",
      type: "Exam"
    }
  ];

  return (
    <div className="p-4 md:p-8  mx-auto space-y-8 animate-in fade-in duration-500">
  {/* 1. COMPACT HEADER & VIEW TOGGLE */}
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
    <div className="space-y-1">
      <nav className="text-[10px] font-black text-[#00796b] uppercase tracking-[0.2em] mb-2">Institutional Ledger</nav>
      <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
        <HiOutlineCalendar className="text-[#00796b]" /> Academic Logs
      </h1>
      <p className="text-slate-400 text-sm font-medium">Daily operational schedule for Modern College of Engineering</p>
    </div>

    <div className="flex bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
      <button 
        onClick={() => setViewAs("Student")}
        className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${viewAs === "Student" ? "bg-white text-[#00796b] shadow-md" : "text-slate-500 hover:text-slate-700"}`}
      >
        Student View
      </button>
      <button 
        onClick={() => setViewAs("Teacher")}
        className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${viewAs === "Teacher" ? "bg-white text-[#00796b] shadow-md" : "text-slate-500 hover:text-slate-700"}`}
      >
        Faculty Roster
      </button>
    </div>
  </div>

  {/* 2. TIMELINE REGISTRY */}
  <div className="relative border-l-4 border-slate-100 ml-4 md:ml-40 space-y-6 pb-12">
    {scheduleData.map((log) => (
      <div key={log.id} className="relative pl-8 md:pl-12 group">
        
        {/* TIME STAMP (Desktop Lateral) */}
        <div className="hidden md:block absolute -left-40 top-2 text-right w-32 pr-4">
          <p className="text-sm font-black text-slate-800 tracking-tighter leading-none">{log.time}</p>
          <p className="text-[9px] text-[#00796b] font-black uppercase tracking-widest mt-1 opacity-70">{log.duration}</p>
        </div>

        {/* TIMELINE NODE (Modern Teal Style) */}
        <div className={`absolute -left-[10px] top-3 w-4 h-4 rounded-full border-4 border-white shadow-md transition-all group-hover:scale-125 z-10 ${
          log.type === "Lecture" ? "bg-teal-500" : 
          log.type === "Lab" ? "bg-emerald-500" : "bg-rose-500"
        }`} />

        {/* LOG REGISTRY CARD */}
        <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-xl shadow-teal-900/5 hover:shadow-teal-900/10 hover:border-teal-200 transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-1">
              <span className={`text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-widest border shadow-sm ${
                log.type === "Lecture" ? "bg-teal-50 text-teal-600 border-teal-100" : 
                log.type === "Lab" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : 
                "bg-rose-50 text-rose-600 border-rose-100"
              }`}>
                {log.type}
              </span>
              <h3 className="font-black text-slate-800 text-lg tracking-tight group-hover:text-[#00796b] transition-colors">
                {log.title}
              </h3>
            </div>
            <button className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
              <HiOutlineDotsVertical size={20} />
            </button>
          </div>

          {/* METADATA GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-50 pt-5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <div className="p-1.5 bg-slate-50 rounded-lg text-[#00796b]"><HiOutlineClock /></div>
              <span className="md:hidden text-slate-800 mr-1">{log.time} • </span>
              {log.duration}
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <div className="p-1.5 bg-slate-50 rounded-lg text-[#00796b]"><HiOutlineLocationMarker /></div>
              {log.location}
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <div className="p-1.5 bg-slate-50 rounded-lg text-[#00796b]"><HiOutlineUser /></div>
              {viewAs === "Student" ? log.instructor : log.batch}
            </div>
          </div>
          
          {/* ACTION STRIP */}
          <div className="mt-6 flex gap-3">
            <button className="flex-1 py-3 bg-[#00796b] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-[#004d40] transition-all shadow-lg shadow-teal-100 active:scale-95">
              Access Resources
            </button>
            <button className="px-6 py-3 border border-slate-200 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-slate-50 hover:text-slate-600 transition-all">
              Log Data
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
  
  {/* EMPTY STATE */}
  {scheduleData.length === 0 && (
    <div className="text-center py-24 bg-white rounded-[3rem] border-4 border-dashed border-gray-50">
      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
         <HiOutlineCalendar className="text-slate-200 text-3xl" />
      </div>
      <p className="text-slate-300 font-black text-xs uppercase tracking-[0.2em]">Operational Schedule Clear for Today</p>
    </div>
  )}
</div>
  );
};

export default Logs;