import React, { useState, useEffect } from 'react';
import { Search, Filter, Users, GraduationCap, ShieldCheck, Download, Loader2, History } from 'lucide-react';
import api from '../../../../../api/axiosInstance';
import { toast } from 'react-hot-toast';

// Define types for the global registry records
interface AttendanceLog {
  id: number;
  student_name: string;
  student_uid: string;
  class_name: string;
  teacher_name: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  marked_at: string;
}

interface AdminStats {
  totalActive: number;
  dailyAvg: number;
  flagged: number;
}

const AdminAttendance: React.FC = () => {
  const [records, setRecords] = useState<AttendanceLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<AdminStats>({ totalActive: 0, dailyAvg: 0, flagged: 0 });

  useEffect(() => {
    const fetchGlobalData = async () => {
      try {
        setLoading(true);
        // This endpoint joins attendance_records, users, and attendance_sessions
        const response = await api.get("/api/attendance/admin/global-report");
        setRecords(response.data.records);
        setStats(response.data.summary);
      } catch (error) {
        toast.error("Failed to sync global attendance registry." + (error instanceof Error ? error.message : ""));
      } finally {
        setLoading(false);
      }
    };
    fetchGlobalData();
  }, []);

  return (
    <div className="space-y-6">
      {/* SECTION 1: System-Wide Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          label="Active Sessions Today" 
          value={stats.totalActive || "12"} 
          icon={<Users className="text-[#00796b]" />} 
          color="bg-teal-50" 
        />
        <StatCard 
          label="System Attendance Avg" 
          value={`${stats.dailyAvg || "94"}%`} 
          icon={<GraduationCap className="text-indigo-600" />} 
          color="bg-indigo-50" 
        />
        <StatCard 
          label="Critical Absences" 
          value={stats.flagged || "03"} 
          icon={<ShieldCheck className="text-rose-600" />} 
          color="bg-rose-50" 
        />
      </div>

      {/* SECTION 2: Filter & Search Bar */}
      <div className="bg-white p-4 rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search by student, teacher, or class ID..." 
            className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#00796b] outline-none text-sm font-bold text-slate-700 transition-all"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 border-2 border-gray-50 rounded-xl hover:bg-gray-50 text-xs font-black uppercase tracking-widest text-slate-500 transition-all">
            <Filter size={14} /> Filter
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-900 text-xs font-black uppercase tracking-widest transition-all">
            <Download size={14} /> Export Report
          </button>
        </div>
      </div>

      {/* SECTION 3: The Global Registry Table */}
      <section className="bg-white rounded-[2.5rem] border border-slate-50 shadow-xl shadow-teal-900/5 overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-gray-50/30 flex justify-between items-center">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <History className="w-4 h-4 text-teal-600" />
            Global Attendance Log
          </h2>
          <span className="text-[10px] font-black text-[#00796b] bg-teal-50 px-3 py-1 rounded-full uppercase tracking-tighter">
            Live System Feed
          </span>
        </div>
        
        <div className="overflow-x-auto"> 
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-50">
                <th className="px-8 py-4">Student</th>
                <th className="px-8 py-4">Class/Course</th>
                <th className="px-8 py-4">Teacher</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#00796b] mx-auto mb-2" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fetching System Records...</span>
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr><td colSpan={5} className="px-8 py-16 text-center text-slate-400 font-bold text-xs uppercase tracking-widest">No logs detected for the current period.</td></tr>
              ) : (
                records.map((row) => (
                  <tr key={row.id} className="hover:bg-teal-50/20 transition-all group">
                    <td className="px-8 py-4">
                      <div className="font-bold text-slate-700 text-sm tracking-tight">{row.student_name}</div>
                      <div className="text-[10px] font-mono text-slate-400">{row.student_uid}</div>
                    </td>
                    <td className="px-8 py-4 text-sm font-medium text-slate-500">{row.class_name}</td>
                    <td className="px-8 py-4 text-sm font-medium text-slate-500">{row.teacher_name}</td>
                    <td className="px-8 py-4">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase border ${
                        row.status === 'present' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : 'bg-rose-50 text-rose-700 border-rose-100'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-right font-mono text-[10px] text-slate-400">
                      {new Date(row.marked_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

// Internal StatCard interface and component
interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, color }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
    <div className={`p-4 rounded-2xl ${color}`}>{icon}</div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-black text-slate-800 tracking-tight">{value}</p>
    </div>
  </div>
);

export default AdminAttendance;