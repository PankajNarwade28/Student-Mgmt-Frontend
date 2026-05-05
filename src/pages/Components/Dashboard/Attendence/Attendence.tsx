import React, { useState } from 'react';
import { Calendar, CheckCircle, XCircle, Clock, Search, Filter, Plus, Download } from 'lucide-react';

const Attendance = () => {
  const [role] = useState(() => localStorage.getItem('userRole') ?? 'Student'); // Default state

  // Static Data
  const [attendanceData] = useState([
    { id: 1, name: "Rahul Narwade", date: "2026-05-05", status: "Present", checkIn: "09:00 AM", class: "MCA-II" },
    { id: 2, name: "Aditya Patil", date: "2026-05-05", status: "Absent", checkIn: "-", class: "MCA-II" },
    { id: 3, name: "Snehal Shinde", date: "2026-05-05", status: "Present", checkIn: "09:15 AM", class: "MCA-II" },
  ]);

  const isAdmin = role === 'Admin';
  const isTeacher = role === 'Teacher';
  const isStudent = role === 'Student';

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen text-slate-900 font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
            {isStudent ? 'My Attendance' : 'Attendance Dashboard'}
          </h1>
          <p className="text-slate-500 mt-1">
            {isAdmin ? "System-wide attendance monitoring." : 
             isTeacher ? "Manage your class records." : "View your academic presence."}
          </p>
        </div>

        {/* Role-Based Actions */}
        <div className="flex items-center gap-3">
          {(isAdmin || isTeacher) && (
            <>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all text-sm font-semibold shadow-sm">
                <Download className="w-4 h-4" /> Export
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all text-sm font-semibold shadow-md shadow-indigo-100">
                <Plus className="w-4 h-4" /> {isTeacher ? 'Mark Attendance' : 'Add Record'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Stats Section - Visible to All, but Content varies */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        <StatCard label={isStudent ? "Total Lectures" : "Total Students"} value="48" icon={<Calendar className="text-blue-600"/>} color="bg-blue-100" />
        <StatCard label="Present" value="42" icon={<CheckCircle className="text-emerald-600"/>} color="bg-emerald-100" />
        <StatCard label="Absent" value="04" icon={<XCircle className="text-rose-600"/>} color="bg-rose-100" />
        {isStudent && (
          <StatCard label="Percentage" value="87.5%" icon={<Clock className="text-amber-600"/>} color="bg-amber-100" />
        )}
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Search & Filter - Hidden for Students if they only see their own data */}
        {!isStudent && (
          <div className="p-5 border-b border-slate-50 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search by name or UID..." 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-sm"
              />
            </div>
            <button className="p-2.5 border border-slate-200 rounded-xl hover:bg-slate-50">
              <Filter className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider">
                {!isStudent && <th className="px-6 py-4 font-bold">Student</th>}
                <th className="px-6 py-4 font-bold">Date</th>
                {isAdmin && <th className="px-6 py-4 font-bold">Class</th>}
                <th className="px-6 py-4 font-bold">Check-In</th>
                <th className="px-6 py-4 font-bold text-center">Status</th>
                {(isAdmin || isTeacher) && <th className="px-6 py-4 font-bold text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {attendanceData.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/80 transition-colors group">
                  {!isStudent && (
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-700">{row.name}</div>
                    </td>
                  )}
                  <td className="px-6 py-4 text-slate-600 text-sm">{row.date}</td>
                  {isAdmin && <td className="px-6 py-4 text-slate-600 text-sm">{row.class}</td>}
                  <td className="px-6 py-4 text-slate-600 text-sm font-mono">{row.checkIn}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <StatusBadge status={row.status} />
                    </div>
                  </td>
                  {(isAdmin || isTeacher) && (
                    <td className="px-6 py-4 text-right">
                      <button className="text-xs font-bold text-indigo-600 hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
                        Edit
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Sub-components for cleaner code
type StatCardProps = {
  label: string;
  value: string;
  icon: React.ReactNode;
  color?: string;
};

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, color }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
    <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
    <div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-black text-slate-800">{value}</p>
    </div>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    Present: "bg-emerald-50 text-emerald-700 border-emerald-100",
    Absent: "bg-rose-50 text-rose-700 border-rose-100",
    Late: "bg-amber-50 text-amber-700 border-amber-100"
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${styles[status as keyof typeof styles]}`}>
      {status}
    </span>
  );
};

export default Attendance;