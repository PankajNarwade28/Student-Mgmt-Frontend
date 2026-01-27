import React, { useEffect, useState } from "react";
import { 
  HiOutlineClipboardList, 
  HiOutlineSearch, 
  HiOutlineFilter,
  HiOutlineShieldCheck,
  HiOutlineExclamationCircle,
  HiOutlineInformationCircle,
  HiOutlineDatabase
} from "react-icons/hi";
import { toast } from "react-hot-toast";



// Static Data for the UI
const STATIC_LOGS = [
  { id: 1, user: "admin@system.com", action: "Course Created", resource: "CS-101", timestamp: "2026-01-27 10:15 AM", status: "Success", type: "Create" },
  { id: 2, user: "teacher_jane@edu.com", action: "Login Attempt", resource: "Auth Service", timestamp: "2026-01-27 11:20 AM", status: "Success", type: "Auth" },
  { id: 3, user: "student_bob@edu.com", action: "Enrollment Failed", resource: "SE-202", timestamp: "2026-01-27 12:05 PM", status: "Failed", type: "Error" },
  { id: 4, user: "system_cron", action: "Database Backup", resource: "PostgreSQL", timestamp: "2026-01-27 01:00 PM", status: "Success", type: "System" },
  { id: 5, user: "admin@system.com", action: "User Role Updated", resource: "User ID: ea8ed", timestamp: "2026-01-27 02:30 PM", status: "Warning", type: "Update" },
];

const SystemLogs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
  toast.success("System Logs module is under development. Displaying static data.");
}, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Success": return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Failed": return "bg-rose-50 text-rose-700 border-rose-100";
      case "Warning": return "bg-amber-50 text-amber-700 border-amber-100";
      default: return "bg-slate-50 text-slate-700 border-slate-100";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Auth": return <HiOutlineShieldCheck className="text-indigo-500" />;
      case "Error": return <HiOutlineExclamationCircle className="text-rose-500" />;
      case "System": return <HiOutlineDatabase className="text-amber-500" />;
      default: return <HiOutlineInformationCircle className="text-blue-500" />;
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER & CONTROLS */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-3">
            <HiOutlineClipboardList className="text-indigo-600" />
            System Audit Logs
          </h1>
          <p className="text-slate-500 text-sm">Monitor platform activity and security events</p>
        </div>

        <div className="flex w-full lg:w-auto gap-3">
          <div className="relative flex-grow lg:w-80">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search logs..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 ring-indigo-500/10 transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2 text-sm font-medium text-slate-600">
            <HiOutlineFilter /> Filter
          </button>
        </div>
      </div>

      {/* LOGS TABLE */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Event Type</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Action</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Resource</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {STATIC_LOGS.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-white transition-colors">
                        {getTypeIcon(log.type)}
                      </div>
                      <span className="text-sm font-semibold text-slate-700">{log.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{log.user}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{log.action}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded font-mono">
                      {log.resource}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">{log.timestamp}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusStyle(log.status)}`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* PAGINATION FOOTER */}
        <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">Showing 5 of 128 entries</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-xs font-bold text-slate-400 cursor-not-allowed">Previous</button>
            <button className="px-3 py-1 text-xs font-bold text-indigo-600 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemLogs;