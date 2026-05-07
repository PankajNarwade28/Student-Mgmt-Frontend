import React, { useState, useEffect } from 'react';
import { Clock, History } from 'lucide-react';
import api from '../../../../../api/axiosInstance';

interface AttendanceLog {
  date: string;
  topic_covered: string;
  status: 'present' | 'absent';
}

const StudentAttendance: React.FC = () => {
  const [history, setHistory] = useState<AttendanceLog[]>([]);
  const [stats, setStats] = useState({ total: 0, present: 0, percentage: 0 });

  useEffect(() => {
    const fetchMyAttendance = async () => {
      const response = await api.get("/api/attendance/student/my-records");
      setHistory(response.data.records);
      setStats(response.data.summary);
    };
    fetchMyAttendance();
  }, []);

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 max-w-sm">
        <div className="p-4 bg-indigo-50 rounded-2xl"><Clock className="text-indigo-600" /></div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Attendance Rate</p>
          <p className="text-3xl font-black text-slate-800">{stats.percentage}%</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-50 shadow-xl overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center gap-2">
          <History className="w-4 h-4 text-indigo-600" />
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Presence Log</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <tr>
                <th className="px-8 py-4">Date</th>
                <th className="px-8 py-4">Topic</th>
                <th className="px-8 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {history.map((record, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="px-8 py-4 font-bold text-slate-700 text-sm">{record.date}</td>
                  <td className="px-8 py-4 text-slate-500 text-sm">{record.topic_covered}</td>
                  <td className="px-8 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                      record.status === 'present' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendance;