import React, { useEffect, useState, useCallback } from "react";
import {
  HiOutlineClipboardList,
  HiOutlineRefresh,
  HiOutlineEye,
  HiOutlineX,
} from "react-icons/hi";
import { HiOutlineDatabase } from "react-icons/hi";
import { toast } from "react-hot-toast";
import api from "../../../../../api/axiosInstance";

interface AuditLog {
  id: number;
  table_name: string;
  operation: "INSERT" | "UPDATE" | "DELETE";
  changed_by: string;
  changed_at: string;
  old_data: Record<string, unknown> | null;
  new_data: Record<string, unknown> | null;
}

const SystemLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // Items per page

  // Modal State
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      // Assuming your controller updated to handle query params: ?page=1&limit=10
      const { data } = await api.get(
        `/api/audit/system/logs?page=${page}&limit=${limit}`,
      );

      // Adjust based on your API response structure
      setLogs(data.items);
      setTotalPages(Math.ceil(data.total / limit));
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch audit records.");
    } finally {
      setLoading(false);
    }
  }, [page]); // Re-fetch when page changes

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);
 

  const getChangedFields = (oldData: Record<string, unknown> | null, newData: Record<string, unknown> | null) => {
  if (!oldData && !newData) return []; // Fallback for edge cases
  
  const changes: { field: string; oldVal: unknown; newVal: unknown }[] = [];
  
  // Combine all unique keys from both objects
  const allKeys = Array.from(new Set([...Object.keys(oldData || {}), ...Object.keys(newData || {})]));

  allKeys.forEach((key) => {
    const oldVal = oldData?.[key];
    const newVal = newData?.[key];

    // If values are different, add to changes list
    // We use JSON.stringify for a deep comparison if needed
    if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
      changes.push({ field: key, oldVal, newVal });
    }
  });

  return changes;
};
  return (
   <div className="p-4 md:p-6   mx-auto space-y-10 ">
  {/* 1. COMPACT HEADER & REFRESH */}
  <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-slate-100">
    <div className="space-y-1">
      <nav className="text-[10px] font-black text-[#00796b] uppercase tracking-[0.2em] mb-2">Security & Governance</nav>
      <h1 className="text-2xl md:text-4xl font-black text-slate-800 tracking-tighter flex items-center gap-3">
        <HiOutlineClipboardList className="text-[#00796b]" /> System Audit Trail
      </h1>
      <p className="text-slate-400 text-sm font-medium">
        Cryptographic ledger of database operations across all authorized nodes.
      </p>
    </div>
    
    <button
      onClick={fetchLogs}
      className="p-3 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:border-[#00796b] hover:text-[#00796b] transition-all shadow-sm active:scale-95"
    >
      <HiOutlineRefresh className={`text-xl ${loading ? "animate-spin" : ""}`} />
    </button>
  </div>

  {/* 2. AUDIT REGISTRY TABLE */}
  <div className="bg-white rounded-[2.5rem] shadow-xl shadow-teal-900/5 border border-slate-50 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-50">
            <th className="px-4 py-3">Object Node</th>
            <th className="px-4 py-3">Operation Type</th>
            <th className="px-4 py-3">Audit Timestamp</th>
            <th className="px-4 py-3 text-right">Data View</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {logs
            .filter((l) => l.table_name.includes(searchTerm))
            .map((log) => (
              <tr key={log.id} className="hover:bg-teal-50/30 transition-all group">
                <td className="px-2 py-1.5">
                  <span className="font-mono text-[11px] font-bold text-[#00796b] bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-100 group-hover:bg-white transition-colors">
                    {log.table_name}
                  </span>
                </td>
                <td className="px-2 py-1.5">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter border shadow-sm ${
                    log.operation === 'INSERT' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                    log.operation === 'DELETE' ? 'bg-red-50 text-red-600 border-red-100' :
                    'bg-amber-50 text-amber-600 border-amber-100'
                  }`}>
                    {log.operation}
                  </span>
                </td>
                <td className="px-2 py-1.5">
                  <span className="text-xs font-bold text-slate-400">
                    {new Date(log.changed_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </td>
                <td className="px-2 py-1.5 text-right">
                  <button
                    onClick={() => setSelectedLog(log)}
                    className="p-2.5 text-slate-400 hover:text-[#00796b] hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-teal-100 active:scale-90"
                  >
                    <HiOutlineEye size={20} />
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>

    {logs.length === 0 && !loading && (
      <div className="py-20 text-center bg-white border-t border-slate-50">
        <HiOutlineClipboardList className="mx-auto text-4xl text-slate-100 mb-2" />
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No audit records detected</p>
      </div>
    )}

    {/* PAGINATION CONTROLS */}
    <div className="flex items-center justify-between px-4 py-3 bg-gray-50/50 border-t border-slate-50">
      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
        Registry Page <span className="text-[#00796b]">{page}</span> of {totalPages}
      </div>
      <div className="flex gap-2">
        <button
          disabled={page === 1 || loading}
          onClick={() => setPage((p) => p - 1)}
          className="px-5 py-2 text-[10px] font-black uppercase tracking-widest bg-white border border-slate-200 rounded-xl hover:text-[#00796b] hover:border-[#00796b] disabled:opacity-30 transition-all shadow-sm active:scale-95"
        >
          Prev
        </button>
        <button
          disabled={page === totalPages || loading}
          onClick={() => setPage((p) => p + 1)}
          className="px-5 py-2 text-[10px] font-black uppercase tracking-widest bg-white border border-slate-200 rounded-xl hover:text-[#00796b] hover:border-[#00796b] disabled:opacity-30 transition-all shadow-sm active:scale-95"
        >
          Next
        </button>
      </div>
    </div>
  </div>

  {/* 3. COMPACT DATA DIFF MODAL */}
  {selectedLog && (
    <div className="fixed inset-0 bg-[#004d40]/40 backdrop-blur-md z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl flex flex-col border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-4 py-3 border-b border-slate-50 flex justify-between items-center bg-gray-50/30">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl shadow-inner text-xl ${
              selectedLog.operation === 'DELETE' ? 'bg-red-50 text-red-600' : 
              selectedLog.operation === 'INSERT' ? 'bg-emerald-50 text-emerald-600' : 'bg-teal-50 text-[#00796b]'
            }`}>
              <HiOutlineDatabase />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800 tracking-tight leading-none uppercase">
                {selectedLog.operation} Registry Lock
              </h2>
              <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1.5">
                Node: {selectedLog.table_name} • ID: #{selectedLog.id}
              </p>
            </div>
          </div>
          <button onClick={() => setSelectedLog(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-800 transition-all">
            <HiOutlineX size={20} />
          </button>
        </div>

        {/* Diff Content Section */}
        <div className="p-8 space-y-4">
          <div className="flex text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 mb-2">
            <div className="w-1/3">Property Node</div>
            <div className="w-1/3 text-center">Previous State</div>
            <div className="w-1/3 text-center text-[#00796b]">Modified State</div>
          </div>
          
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {getChangedFields(selectedLog.old_data, selectedLog.new_data).length > 0 ? (
              getChangedFields(selectedLog.old_data, selectedLog.new_data).map((change, index) => (
                <div key={index} className="flex items-center gap-2 p-1.5 rounded-2xl border border-transparent hover:bg-slate-50 transition-colors">
                  {/* Field */}
                  <div className="w-1/3 text-[11px] font-black text-slate-800 uppercase tracking-tight truncate pl-2">
                    {change.field.replace(/_/g, ' ')}
                  </div>

                  {/* Old Data */}
                  <div className="w-1/3 bg-gray-50 px-3 py-2 rounded-xl border border-slate-100 text-[10px] font-bold text-slate-400 line-through truncate text-center">
                    {change.oldVal === null || change.oldVal === undefined ? "empty" : String(change.oldVal)}
                  </div>

                  {/* New Data */}
                  <div className="w-1/3 bg-teal-50 px-3 py-2 rounded-xl border border-teal-100 shadow-sm text-[#00796b] text-[10px] font-black truncate text-center uppercase tracking-tighter">
                    {change.newVal === null || change.newVal === undefined ? "purged" : String(change.newVal)}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No structural mutations detected.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Audit Data */}
        <div className="px-8 py-4 bg-gray-50/50 border-t border-slate-50 flex justify-between items-center">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Authorized By: {selectedLog.changed_by}</span>
          <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
            v4.2.0 Audit Sync
          </span>
        </div>
      </div>
    </div>
  )}
</div>
  );
};

export default SystemLogs;
