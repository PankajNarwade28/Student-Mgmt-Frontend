import React, { useEffect, useState, useCallback } from "react";
import { 
  HiOutlineClipboardList,  
  HiOutlineRefresh,
  HiOutlineEye,
  HiOutlineX
} from "react-icons/hi";
import { toast } from "react-hot-toast";
import api from "../../../../../api/axiosInstance";

interface AuditLog {
  id: number;
  table_name: string;
  operation: "INSERT" | "UPDATE" | "DELETE";
  changed_by: string;
  changed_at: string;
  old_data: string | null;
  new_data: string | null;
}

const SystemLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, ] = useState("");
  
  // Modal State
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/audit/system/logs");
      setLogs(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch audit records.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const getOperationColor = (op: string) => {
    if (op === 'INSERT') return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    if (op === 'DELETE') return 'text-rose-600 bg-rose-50 border-rose-100';
    return 'text-amber-600 bg-amber-50 border-amber-100'; // UPDATE
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header logic remains the same as previous version */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
               <HiOutlineClipboardList className="text-indigo-600" /> Audit Trail
            </h1>
            <p className="text-sm text-slate-500">Tracking database operations across all core entities.</p>
         </div>
         <button onClick={fetchLogs} className="p-2 bg-white border rounded-xl hover:bg-slate-50 transition-all">
            <HiOutlineRefresh className={loading ? "animate-spin" : ""} />
         </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">Table</th>
              <th className="px-6 py-4">Operation</th>
              <th className="px-6 py-4">Changed By</th>
              <th className="px-6 py-4">Time</th>
              <th className="px-6 py-4 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {logs.filter(l => l.table_name.includes(searchTerm)).map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-mono text-xs font-bold text-slate-700">{log.table_name}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-black border ${getOperationColor(log.operation)}`}>
                    {log.operation}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{log.changed_by}</td>
                <td className="px-6 py-4 text-xs text-slate-400">{new Date(log.changed_at).toLocaleString()}</td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => setSelectedLog(log)}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                  >
                    <HiOutlineEye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {logs.length === 0 && !loading && (
          <div className="p-6 text-center text-sm text-slate-500">
            No audit records found.
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Operation Details</h2>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Log ID: {selectedLog.id}</p>
              </div>
              <button onClick={() => setSelectedLog(null)} className="p-2 hover:bg-slate-200 rounded-full transition-all">
                <HiOutlineX />
              </button>
            </div>

            <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Previous State (Old Data)</label>
                <pre className="bg-white p-4 rounded-2xl border border-slate-200 text-[10px] font-mono overflow-auto max-h-96 shadow-inner">
                  {selectedLog.old_data ? JSON.stringify(selectedLog.old_data, null, 2) : "NULL (New Entry)"}
                </pre>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-indigo-400 uppercase ml-2">New State (Changes Applied)</label>
                <pre className="bg-white p-4 rounded-2xl border border-indigo-100 text-[10px] font-mono overflow-auto max-h-96 shadow-inner text-indigo-900">
                  {selectedLog.new_data ? JSON.stringify(selectedLog.new_data, null, 2) : "NULL (Record Deleted)"}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemLogs;