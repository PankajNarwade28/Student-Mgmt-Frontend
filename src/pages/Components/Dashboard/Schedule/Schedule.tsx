import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {  HiOutlineClock, HiOutlineCheckCircle } from "react-icons/hi";
import { HiArrowPath } from "react-icons/hi2";
import api from "../../../../api/axiosInstance";

interface ScheduleEntry {
  id: number;
  course_name: string;
  teacher_name: string;
  class_code: string;
  start_time: string;
  day_of_week: string;
}

const MySchedule: React.FC = () => { 
    const [schedules, setSchedules] = useState<ScheduleEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Retrieve role directly from localStorage 
  const userRole = localStorage.getItem("userRole") || "Student"; 

  const timeSlots = [
    { start: "09:00", end: "10:00" },
    { start: "10:00", end: "11:00" },
    { start: "11:00", end: "13:00", isBreak: true },
    { start: "13:00", end: "14:00" },
    { start: "14:00", end: "15:00", isBreak: true },
    { start: "15:00", end: "16:00" },
    { start: "16:00", end: "17:00" },
  ];

  const fetchRegistry = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/schedule/registry?baseDate=${selectedDate.toISOString()}`);
      setSchedules(res.data.data || []);
    } catch (err) {
        console.error("Fetch Error:", err);
      toast.error("Registry synchronization failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistry();
  }, [selectedDate]);

  const handleStartSession = async (scheduleId: number) => {
    if (userRole !== "Teacher") return;
    try {
      await api.post("/api/schedule/session/start", {
        scheduleId,
        date: selectedDate.toISOString().split("T")[0]
      });
      toast.success("Attendance mode activated.");
      fetchRegistry();
    } catch (err) {
        console.error("Session Start Error:", err);
      toast.error("Unauthorized: You are not assigned to this slot.");
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><HiArrowPath className="animate-spin text-4xl text-indigo-600" /></div>;

  return (
    <div className="p-6 bg-[#f8faff] min-h-screen space-y-8">
      <div className="flex justify-between items-center border-b border-slate-100 pb-6">
        <h1 className="text-3xl font-black text-slate-800 tracking-tighter">Academic Timetable</h1>
        <div className="bg-white px-6 py-2 rounded-xl border border-slate-100 text-[10px] font-black uppercase text-indigo-600 tracking-widest">
          Access Level: {userRole}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 bg-white rounded-[3rem] p-10 shadow-xl border border-slate-50">
          <h3 className="text-xl font-black text-slate-800 mb-8 uppercase tracking-tighter italic">
            Schedule for {selectedDate.toDateString()}
          </h3>
          
          <div className="space-y-4">
            {timeSlots.map((slot, i) => {
              const session = schedules.find(s => 
                s.start_time.startsWith(slot.start) && 
                s.day_of_week === selectedDate.toLocaleDateString('en-US', { weekday: 'long' })
              );

              if (slot.isBreak) return (
                <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-dashed text-center text-[10px] font-black text-slate-300 uppercase">
                  <HiOutlineClock className="inline mr-2" /> Academic Break
                </div>
              );

              return (
                <div key={i} className="flex items-center gap-6 p-6 bg-white border border-slate-100 rounded-[2rem] hover:border-indigo-200 transition-all shadow-sm">
                  <span className="text-xs font-black text-slate-400 w-16">{slot.start}</span>
                  {session ? (
                    <div className="flex-1 flex justify-between items-center">
                      <div>
                        <p className="font-black text-slate-800 text-lg tracking-tight">{session.course_name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                          {session.teacher_name} • Code: {session.class_code}
                        </p>
                      </div>
                      {userRole === "Teacher" && (
                        <button 
                          onClick={() => handleStartSession(session.id)}
                          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700"
                        >
                          <HiOutlineCheckCircle className="inline mr-2" /> Call Roll
                        </button>
                      )}
                    </div>
                  ) : (
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Slot Unassigned</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Calendar Sidebar (Static grid mapping selectedDate.getDate()) */}
        <div className="lg:col-span-4 bg-white rounded-[2rem] p-6 shadow-sm border border-slate-50 self-start">
           <div className="grid grid-cols-7 gap-2 text-center">
              {['M','T','W','T','F','S','S'].map(d => <span key={d} className="text-[10px] font-black text-slate-300">{d}</span>)}
              {[...Array(31)].map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i + 1))}
                  className={`p-2 text-xs font-bold rounded-lg ${selectedDate.getDate() === i+1 ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  {i + 1}
                </button>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default MySchedule;