import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import {
  HiOutlineBookOpen,
  HiOutlineAcademicCap,
  HiOutlineClock,
  HiOutlineUserGroup,
  HiOutlineClipboardList,
  HiOutlineSearch,
  HiOutlinePlusCircle,
  HiChevronRight,
} from "react-icons/hi";
import api from "../../../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  teacher_name: string;
  student_count?: number;
  enrollment_status?: "enrolled" | "pending" | "not_enrolled";
  progress?: number;
}

const MyCourses: React.FC = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole") || "Student";

  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/courses/mycourses");
      if (userRole === "Student") {
        setEnrolledCourses(response.data.enrolled || []);
        setAvailableCourses(response.data.available || []);
      } else {
        setEnrolledCourses(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to load your academic courses.");
    } finally {
      setLoading(false);
    }
  }, [userRole]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleEnrollRequest = async (course: Course) => {
    try {
      await api.post("/api/courses/request-enrollment", { courseId: course.id });
      toast.success(`Request sent for ${course.name}. Pending approval.`);
      fetchCourses();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || "Failed to send enrollment request.";
        toast.error(errorMessage);
      }
    }
  };

  const handleAction = (course: Course, isEnrolled: boolean) => {
    if (isEnrolled) {
      const path = userRole === "Teacher"
          ? `/dashboard/mycourses/grades/${course.id}`
          : `/dashboard/mycourses/access/${course.id}`;
      navigate(path);
    } else {
      handleEnrollRequest(course);
    }
  };

  const getFilteredList = (list: Course[]) =>
    list.filter((c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const renderCourseCard = (course: Course, isEnrolled: boolean) => {
    const isPending = course.enrollment_status === "pending";

    return (
      <div
        key={course.id}
        className="group relative bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-teal-900/5 hover:shadow-teal-900/10 hover:border-teal-500/30 transition-all duration-300 flex flex-col overflow-hidden"
      >
        {/* Decorative Background Pattern */}
        <div className="absolute top-0 right-0 opacity-[0.03] pointer-events-none p-4 group-hover:scale-110 transition-transform">
          <HiOutlineBookOpen size={120} />
        </div>

        {/* Status Top Bar */}
        <div className={`h-1.5 w-full ${isEnrolled ? "bg-[#00796b]" : isPending ? "bg-amber-400" : "bg-emerald-500"}`} />

        <div className="p-7 flex-grow space-y-4 relative z-10">
          <div className="flex justify-between items-start">
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-lg border ${
                isEnrolled ? "text-[#00796b] bg-teal-50 border-teal-100" : "text-emerald-700 bg-emerald-50 border-emerald-100"
            }`}>
              {course.code}
            </span>
            <HiOutlineClipboardList className="text-slate-200 group-hover:text-teal-500/20 transition-colors" size={24} />
          </div>

          <h3 className="text-lg font-black text-slate-800 tracking-tight leading-tight group-hover:text-[#00796b] transition-colors">
            {course.name}
          </h3>
          
          <p className="text-xs text-slate-400 font-medium line-clamp-2 italic">
            {course.description || "No curriculum description provided for this module."}
          </p>

          <div className="pt-4 border-t border-slate-50 space-y-4">
            {userRole !== "Teacher" && (
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-slate-50 rounded-lg text-teal-600"><HiOutlineAcademicCap size={14} /></div>
                <span className="text-[11px] font-bold text-slate-500">
                  Faculty: <span className="text-slate-800 font-black uppercase tracking-tighter ml-1">{course.teacher_name || "Registry Pending"}</span>
                </span>
              </div>
            )}

            {isEnrolled && userRole === "Student" && (
              <div className="space-y-2 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                <div className="flex justify-between text-[9px] font-black text-[#00796b] uppercase tracking-widest">
                  <span>Knowledge Capture</span>
                  <span>{course.progress || 0}%</span>
                </div>
                <div className="h-1.5 bg-white rounded-full overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-[#00796b] transition-all duration-1000"
                    style={{ width: `${course.progress || 0}%` }}
                  />
                </div>
              </div>
            )}

            {(userRole === "Teacher" || userRole === "Admin") && (
              <div className="flex items-center justify-between bg-teal-50/30 p-3 rounded-xl border border-teal-100/50">
                <div className="flex items-center gap-2 text-[11px] font-black text-slate-700 uppercase tracking-tighter">
                  <HiOutlineUserGroup className="text-teal-600" />
                  <span>Enrolled Capacity</span>
                </div>
                <span className="text-sm font-black text-[#00796b]">{course.student_count || 0}</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-7 pt-0 relative z-10">
          <button
            onClick={() => isPending ? toast.error("Verification in progress") : handleAction(course, isEnrolled)}
            disabled={isPending}
            className={`w-full py-3.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-[1.25rem] transition-all flex items-center justify-center gap-2 shadow-sm ${
              isEnrolled
                ? "bg-slate-800 text-white hover:bg-[#00796b] shadow-slate-200"
                : isPending
                  ? "bg-amber-50 text-amber-600 border border-amber-100 cursor-not-allowed"
                  : "bg-[#00796b] text-white hover:bg-[#004d40] shadow-teal-100"
            }`}
          >
            {isEnrolled ? (
               <HiChevronRight size={16} />
            ) : isPending ? (
              <HiOutlineClock size={16} className="animate-spin" />
            ) : (
              <HiOutlinePlusCircle size={16} />
            )}

            {isEnrolled
              ? userRole === "Teacher" ? "Administrative Portal" : "Continue Module"
              : isPending ? "Awaiting Approval" : "Request Access"}
          </button>
        </div>
      </div>
    );
  };

  const renderGrid = (title: string, list: Course[], isEnrolled: boolean) => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
         <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] whitespace-nowrap">
            {title} <span className="text-[#00796b] ml-1">[{list.length}]</span>
         </h2>
         <div className="h-[1px] w-full bg-slate-100"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {getFilteredList(list).map((course) => renderCourseCard(course, isEnrolled))}
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-8  mx-auto space-y-12  ">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 pb-8 border-b border-slate-100">
        <div>
          <nav className="text-[10px] font-black text-[#00796b] uppercase tracking-[0.2em] mb-2">Academic Ledger</nav>
          <h1 className="text-2xl md:text-4xl font-black text-slate-800 flex items-center gap-3 tracking-tighter">
            <HiOutlineBookOpen className="text-[#00796b] shrink-0" />
            Curriculum Registry
          </h1>
          <p className="text-slate-400 text-sm font-medium mt-1">Operational view of available and enrolled learning modules.</p>
        </div>
        
        <div className="relative w-full lg:w-96 group">
          <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00796b] transition-colors" />
          <input
            type="text"
            placeholder="Search Registry..."
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-[1.25rem] outline-none focus:bg-white focus:border-[#00796b] transition-all font-bold text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 bg-slate-50 rounded-[2rem] border border-slate-100" />
          ))}
        </div>
      ) : (
        <div className="space-y-20">
          {userRole === "Student" ? (
            <>
              {renderGrid("Active Enrollments", enrolledCourses, true)}
              {availableCourses.length > 0 && renderGrid("Available Modules", availableCourses, false)}
            </>
          ) : (
            renderGrid(userRole === "Teacher" ? "Assigned Teaching Load" : "System Curriculum", enrolledCourses, true)
          )}
        </div>
      )}
    </div>
  );
};

export default MyCourses;