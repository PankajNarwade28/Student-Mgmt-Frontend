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
    <div className="p-6 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <HiOutlineCalendar className="text-indigo-600" /> Academic Logs
          </h1>
          <p className="text-slate-500">Daily schedule and session logs for Modern College of Engineering</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button 
            onClick={() => setViewAs("Student")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${viewAs === "Student" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500"}`}
          >
            Student Schedule
          </button>
          <button 
            onClick={() => setViewAs("Teacher")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${viewAs === "Teacher" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500"}`}
          >
            Teacher Roster
          </button>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="relative border-l-2 border-slate-100 ml-4 md:ml-32 space-y-8 pb-10">
        {scheduleData.map((log) => (
          <div key={log.id} className="relative pl-8 group">
            {/* Time Indicator for Desktop */}
            <div className="hidden md:block absolute -left-32 top-1 text-right w-24">
              <p className="text-sm font-bold text-slate-900">{log.time}</p>
              <p className="text-[10px] text-slate-400 font-medium uppercase">{log.duration}</p>
            </div>

            {/* Timeline Dot */}
            <div className={`absolute -left-[9px] top-2 w-4 h-4 rounded-full border-4 border-white shadow-sm transition-all group-hover:scale-125 ${
              log.type === "Lecture" ? "bg-blue-500" : 
              log.type === "Lab" ? "bg-emerald-500" : 
              "bg-rose-500"
            }`} />

            {/* Log Card */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-1 inline-block ${
                    log.type === "Lecture" ? "bg-blue-50 text-blue-600" : 
                    log.type === "Lab" ? "bg-emerald-50 text-emerald-600" : 
                    "bg-rose-50 text-rose-600"
                  }`}>
                    {log.type}
                  </span>
                  <h3 className="font-bold text-slate-800 text-lg">{log.title}</h3>
                </div>
                <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg">
                  <HiOutlineDotsVertical />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <HiOutlineClock className="text-indigo-400" />
                  <span className="md:hidden font-bold text-slate-700 mr-1">{log.time}</span>
                  {log.duration}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <HiOutlineLocationMarker className="text-indigo-400" />
                  {log.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <HiOutlineUser className="text-indigo-400" />
                  {viewAs === "Student" ? log.instructor : log.batch}
                </div>
              </div>
              
              {/* Mobile Time Label */}
              <div className="mt-4 pt-4 border-t border-slate-50 flex gap-2">
                <button className="flex-1 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                  View Resources
                </button>
                <button className="flex-1 py-2 border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-50 transition-all">
                  Set Reminder
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {scheduleData.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400">No scheduled sessions for today.</p>
        </div>
      )}
    </div>
  );
};

export default Logs;