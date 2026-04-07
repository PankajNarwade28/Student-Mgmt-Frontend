import React, { useEffect, useState } from "react";
import api from "../../../../../../api/axiosInstance";
import {
  HiOutlineMail, 
  HiOutlineCalendar,
} from "react-icons/hi";
import { toast } from "react-hot-toast"; 

interface Student {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  created_at: string;
}

const StudentList: React.FC = () => {
  // Pass the interface to the Hook: <Student[]>
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = Number.parseInt(import.meta.env.STUDENT_PAGINATION_LIMIT) || 6; // Default to 5 if not set

  const fetchStudents = async () => {
    setLoading(true);
    try {
      // Pass current page to the API
      const response = await api.get(
        `/api/admin/students?page=${currentPage}&limit=${limit}`,
      );

      if (response.data.success) {
        setStudents(response.data.students);
        setTotalPages(response.data.pagination.totalPages);
        toast.success(`Page ${currentPage} loaded`);
      }
    } catch (error) {
      console.error("Fetch Students Error:", error);
      toast.error("Unable to fetch students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [currentPage]); // Re-fetch when page changes

  
  if (loading)
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-gray-100 rounded-xl" />
        ))}
      </div>
    );

  return (
    <div className="animate-in fade-in duration-500 space-y-2">
  {/* Header Row (Desktop Only) */}
  <div className="hidden md:grid grid-cols-12 px-8 py-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
    <div className="col-span-5">Student Identity</div>
    <div className="col-span-3">Registration Date</div>
    <div className="col-span-2 text-center">Account Status</div>
    <div className="col-span-2 text-right">Reference</div>
  </div>

  {/* Row-wise List */}
  <div className="space-y-2">
    {students.map((student) => (
      <div
        key={student.id}
        className="bg-white border border-slate-50 rounded-2xl p-4 md:px-8 md:py-4 shadow-sm hover:shadow-md hover:border-teal-100 transition-all group grid grid-cols-1 md:grid-cols-12 items-center gap-4"
      >
        {/* Identity Section */}
        <div className="col-span-1 md:col-span-5 flex items-center gap-4">
          <div className="h-10 w-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center border border-teal-100 group-hover:bg-teal-600 group-hover:text-white transition-all shrink-0 shadow-sm font-black text-sm">
            {student?.full_name?.[0] || student.email[0].toUpperCase()}
          </div>
          <div className="flex flex-col min-w-0">
            <h4 className="font-bold text-slate-800 truncate text-sm">
              {student?.full_name?.trim() ? student.full_name : "System User"}
            </h4>
            <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium truncate">
              <HiOutlineMail className="text-teal-500/70" /> {student.email}
            </span>
          </div>
        </div>

        {/* Date Section */}
        <div className="col-span-1 md:col-span-3 flex items-center gap-2 text-xs text-slate-500 font-semibold">
          <HiOutlineCalendar className="text-teal-500/50" />
          {new Date(student.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
        </div>

        {/* Status Section */}
        <div className="col-span-1 md:col-span-2 flex md:justify-center">
          <span
            className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.15em] border shadow-sm ${
              student.is_active 
                ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                : "bg-red-50 text-red-600 border-red-100"
            }`}
          >
            {student.is_active ? "Active" : "Inactive"}
          </span>
        </div>

        {/* System ID Section (Desktop only) */}
        <div className="hidden md:block col-span-2 text-right">
           <span className="text-[10px] font-mono text-slate-300 uppercase tracking-tighter">
             UID: {student.id.slice(0, 8)}
           </span>
        </div>
      </div>
    ))}
  </div>

  {/* Pagination Controls */}
  <div className="mt-8 flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 pt-6 gap-4">
    <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
      Registry Page <span className="text-teal-600">{currentPage}</span> of <span className="text-slate-800">{totalPages}</span>
    </div>

    <div className="flex gap-2">
      <button
        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        disabled={currentPage === 1 || loading}
        className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-500 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
      >
        Prev
      </button>

      <button
        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages || loading}
        className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-white bg-teal-600 rounded-xl hover:bg-teal-700 disabled:opacity-30 disabled:cursor-not-allowed shadow-xl shadow-teal-100 transition-all active:scale-95"
      >
        Next
      </button>
    </div>
  </div>
</div>
  );
};

export default StudentList;
