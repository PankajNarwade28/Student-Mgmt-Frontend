import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { 
  HiOutlineAcademicCap, 
  HiOutlineMail, 
  HiOutlineBookOpen,
  HiOutlineUserCircle, 
  HiOutlineShieldCheck
} from "react-icons/hi";
import api from "../../../../../api/axiosInstance";

interface InstructorCourse {
  id: number;
  name: string;
  code: string;
}

interface Instructor {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  bio?: string;
  course_count: number;
  courses: InstructorCourse[] | null;
}

const Instructor: React.FC = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        setLoading(true);
        // Ensure you have a route /api/instructors pointing to the new repo function
        const response = await api.get("/api/courses/instructors");
        setInstructors(response.data);
      } catch (error) {
        toast.error("Failed to load instructor profiles.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  if (loading) {
    return (
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-64 bg-slate-50 animate-pulse rounded-3xl border border-slate-100" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6  mx-auto space-y-10 ">
  {/* 1. COMPACT HEADER */}
  <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-slate-100">
    <div className="space-y-1">
      <nav className="text-[10px] font-black text-[#00796b] uppercase tracking-[0.2em] mb-2">
        Faculty Directory
      </nav>
      <h1 className="text-2xl md:text-4xl font-black text-slate-800 tracking-tighter flex items-center gap-3">
        <HiOutlineAcademicCap className="text-[#00796b]" /> Academic Faculty
      </h1>
      <p className="text-slate-400 text-sm font-medium">
        Registry of authorized instructors and their associated curriculum nodes.
      </p>
    </div>
  </div>

  {/* 2. FACULTY REGISTRY GRID */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {instructors.map((teacher) => (
      <div 
        key={teacher.user_id} 
        className="group relative bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-teal-900/5 hover:shadow-teal-900/10 hover:border-teal-500/30 transition-all duration-300 flex flex-col overflow-hidden"
      >
        {/* Decorative Watermark */}
        <div className="absolute top-0 right-0 opacity-[0.03] pointer-events-none p-6 group-hover:scale-110 transition-transform">
          <HiOutlineUserCircle size={120} />
        </div>

        <div className="p-7 flex-grow space-y-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 bg-teal-50 rounded-[1.25rem] border border-teal-100 flex items-center justify-center text-[#00796b] shadow-inner">
              <HiOutlineUserCircle size={40} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight group-hover:text-[#00796b] transition-colors">
                {teacher.full_name}
              </h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-50 text-[#00796b] text-[9px] font-black uppercase tracking-widest border border-teal-100 mt-1">
                <HiOutlineShieldCheck /> Verified Faculty
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-xs font-bold text-slate-500 bg-gray-50/50 p-3 rounded-xl border border-slate-100">
              <HiOutlineMail className="text-[#00796b] text-base shrink-0" />
              <span className="truncate">{teacher.email}</span>
            </div>
          </div>

          <div className="pt-5 border-t border-slate-50">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <HiOutlineBookOpen className="text-teal-500" /> Assigned Nodes ({teacher.course_count})
            </h3>
            
            <div className="flex flex-wrap gap-2">
              {teacher.courses && teacher.courses.length > 0 ? (
                teacher.courses.map((course) => (
                  <span 
                    key={course.id} 
                    className="bg-white text-slate-600 text-[10px] font-black px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-sm hover:border-[#00796b] hover:text-[#00796b] transition-all cursor-default"
                    title={course.name}
                  >
                    {course.code}
                  </span>
                ))
              ) : (
                <div className="w-full py-4 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Active Assignments</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-7 pt-0 relative z-10">
          <button className="w-full py-4 bg-slate-800 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-[#00796b] transition-all shadow-xl shadow-slate-200 active:scale-95 flex items-center justify-center gap-2">
            View Registry Profile
          </button>
        </div>
      </div>
    ))}
  </div>

  {/* 3. SYSTEM FOOTER METADATA */}
  <div className="pt-8 flex flex-col items-center gap-2">
    <div className="h-[1px] w-24 bg-slate-200"></div>
    <p className="text-[9px] text-slate-300 font-black uppercase tracking-[0.4em]">
      Faculty Information Protocol • Modern ERP v4.2.0
    </p>
  </div>
</div>
  );
};

export default Instructor;