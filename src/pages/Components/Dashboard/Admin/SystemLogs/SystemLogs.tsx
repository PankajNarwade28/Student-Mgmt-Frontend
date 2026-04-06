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

  const getOperationColor = (op: string) => {
    if (op === "INSERT")
      return "text-emerald-600 bg-emerald-50 border-emerald-100";
    if (op === "DELETE") return "text-rose-600 bg-rose-50 border-rose-100";
    return "text-amber-600 bg-amber-50 border-amber-100"; // UPDATE
  };

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
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header logic remains the same as previous version */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <HiOutlineClipboardList className="text-indigo-600" /> Audit Trail
          </h1>
          <p className="text-sm text-slate-500">
            Tracking database operations across all core entities.
          </p>
        </div>
        <button
          onClick={fetchLogs}
          className="p-2 bg-white border rounded-xl hover:bg-slate-50 transition-all"
        >
          <HiOutlineRefresh className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">Table</th>
              <th className="px-6 py-4">Operation</th>
              {/* <th className="px-6 py-4">Changed By</th> */}
              <th className="px-6 py-4">Time</th>
              <th className="px-6 py-4 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {logs
              .filter((l) => l.table_name.includes(searchTerm))
              .map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4 font-mono text-xs font-bold text-slate-700">
                    {log.table_name}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-md text-[10px] font-black border ${getOperationColor(log.operation)}`}
                    >
                      {log.operation}
                    </span>
                  </td>
                  {/* <td className="px-6 py-4 text-sm text-slate-600">{log.changed_by}</td> */}
                  <td className="px-6 py-4 text-xs text-slate-400">
                    {new Date(log.changed_at).toLocaleString()}
                  </td>
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
  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-3 animate-in fade-in duration-300">
    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-xl flex flex-col border border-slate-100 overflow-hidden">
      
      {/* 1. Header Section - Tightened */}
      <div className="px-5 py-3 border-b flex justify-between items-center bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl text-lg ${
            selectedLog.operation === 'DELETE' ? 'bg-red-50 text-red-600' : 
            selectedLog.operation === 'INSERT' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'
          }`}>
            <HiOutlineDatabase />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 leading-tight">
              {selectedLog.operation} • {selectedLog.table_name}
            </h2>
            <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest -mt-0.5">
              Ref: #{selectedLog.id} • By {selectedLog.changed_by}
            </p>
          </div>
        </div>
        <button onClick={() => setSelectedLog(null)} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition-all">
          <HiOutlineX size={16} />
        </button>
      </div>

      {/* 2. Content Section - Compact Diff */}
      <div className="px-5 py-4 space-y-3">
        
        {/* Comparison Header */}
        <div className="flex text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
          <div className="w-1/3">Field</div>
          <div className="w-1/3 text-center">Previous Value</div>
          <div className="w-1/3 text-center text-indigo-400">Current Value</div>
        </div>
        
        {/* Loop through changed fields - Tightened Rows */}
        <div className="space-y-1.5">
          {getChangedFields(selectedLog.old_data, selectedLog.new_data).length > 0 ? (
            getChangedFields(selectedLog.old_data, selectedLog.new_data).map((change, index) => (
              <div key={index} className="flex items-center gap-1.5 px-1 py-1 rounded-lg border border-transparent hover:bg-slate-50 hover:border-slate-100 transition-colors">
                
                {/* Field Name */}
                <div className="w-1/3 text-xs font-black text-slate-800 capitalize truncate pr-2">
                  {change.field.replace(/_/g, ' ')}
                </div>

                {/* Old Value */}
                <div className="w-1/3 bg-white px-2 py-1.5 rounded-md border border-slate-100 line-through text-slate-400 text-xs italic truncate">
                  {change.oldVal === null || change.oldVal === undefined ? "empty" : String(change.oldVal)}
                </div>

                {/* New Value */}
                <div className="w-1/3 bg-indigo-600 px-2 py-1.5 rounded-md shadow-sm text-white text-xs font-bold truncate">
                  {change.newVal === null || change.newVal === undefined ? "deleted" : String(change.newVal)}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-100">
              <p className="text-[11px] text-slate-500 font-medium italic">No structural changes detected.</p>
            </div>
          )}
        </div>
      </div>

      {/* 3. Footer Section - Single Line */}
      <div className="px-5 py-2.5 bg-slate-50 border-t flex justify-center">
        <p className="text-[9px] font-bold text-slate-400 uppercase">
          Timestamp: {new Date(selectedLog.changed_at).toLocaleString()}
        </p>
      </div>
    </div>
  </div>
)}
      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-100">
        <div className="text-xs text-slate-500 font-medium">
          Page <span className="text-slate-900">{page}</span> of{" "}
          <span className="text-slate-900">{totalPages}</span>
        </div>
        <div className="flex gap-2">
          <button
            disabled={page === 1 || loading}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 text-xs font-bold bg-white border rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Previous
          </button>
          <button
            disabled={page === totalPages || loading}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 text-xs font-bold bg-white border rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemLogs;
