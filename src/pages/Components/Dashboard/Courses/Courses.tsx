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
} from "react-icons/hi";
import api from "../../../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  teacher_name: string;
  student_count?: number;
  progress?: number;
}

const MyCourses: React.FC = () => {
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const userRole = localStorage.getItem("userRole") || "Student";

  // FIX: useCallback prevents the 'missing dependency' linting error
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
  }, [userRole]); // Dependency on userRole ensures it re-fetches if role changes

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]); // Now fetchCourses is a safe dependency

  const filterList = (list: Course[]) =>
    list.filter(
      (c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.code.toLowerCase().includes(searchTerm.toLowerCase()),
    );

  const navigate = useNavigate();

  const handleAction = (course: Course, isEnrolled: boolean) => {
  if (isEnrolled) {
    // Navigate to the specific course grades page
    navigate(`/dashboard/mycourses/grades/${course.id}`);
  } else {
    // Enrollment logic for students
    toast.success(`Requesting enrollment for ${course.name}`);
  }
};
  const renderGrid = (title: string, list: Course[], isEnrolled: boolean) => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-800 border-l-4 border-indigo-600 pl-4 uppercase">
        {title} ({list.length})
      </h2>
      <div className="grid grid-cols-1 min-[500px]:grid-cols-2 lg:grid-cols-3 gap-6">
        {filterList(list).map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col overflow-hidden"
          >
            <div
              className={`h-2 w-full ${isEnrolled ? "bg-indigo-600" : "bg-emerald-500"}`}
            />
            <div className="p-6 flex-grow space-y-4">
              <div className="flex justify-between items-start text-[10px] font-bold uppercase tracking-wider">
                <span
                  className={
                    isEnrolled ? "text-indigo-700" : "text-emerald-700"
                  }
                >
                  {course.code}
                </span>
                <HiOutlineClipboardList className="text-slate-300" size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {course.name}
              </h3>
              <p className="text-sm text-slate-500 line-clamp-2 italic">
                {course.description}
              </p>

              <div className="pt-4 border-t border-slate-50 space-y-3 text-xs text-slate-600">
                {/* 1. Only show Instructor name if the user is NOT a teacher */}
                {userRole !== "Teacher" && (
                  <div className="flex items-center gap-2">
                    <HiOutlineAcademicCap className="text-slate-400" />
                    <span>
                      Instructor:{" "}
                      <span className="font-semibold">
                        {course.teacher_name || "N/A"}
                      </span>
                    </span>
                  </div>
                )}

                {/* 2. Only show Progress bar for Enrolled Students */}
                {isEnrolled && userRole === "Student" && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400">
                      <span>PROGRESS</span>
                      <span>{course.progress || 0}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500"
                        style={{ width: `${course.progress || 0}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* 3. Show Enrollment Count for Teachers/Admins */}
                {(userRole === "Teacher" || userRole === "Admin") && (
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <HiOutlineUserGroup className="text-slate-400" />
                    <span>Enrolled Students: {course.student_count || 0}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 pt-0">
              <button
               onClick={() => handleAction(course, isEnrolled)}
                className={`w-full py-3 text-sm font-bold rounded-2xl transition-all flex items-center justify-center gap-2 ${
                  isEnrolled
                    ? "bg-slate-50 text-slate-600 hover:bg-indigo-600 hover:text-white"
                    : "bg-emerald-600 text-white hover:bg-emerald-700"
                }`}
              >
                {isEnrolled ? (
                  <HiOutlineClock size={18} />
                ) : (
                  <HiOutlinePlusCircle size={18} />
                )}
                {isEnrolled
                  ? userRole === "Teacher"
                    ? "Manage"
                    : "Continue"
                  : "Enroll Now"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-12">
      {/* Header with Search */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-3">
          <HiOutlineBookOpen className="text-indigo-600 shrink-0" /> Academic
          Curriculum
        </h1>
        <div className="relative w-full lg:w-96">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search courses..."
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl outline-none focus:ring-2 ring-indigo-500/10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-slate-50 rounded-3xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-16">
          {userRole === "Student" ? (
            <>
              {renderGrid("My Enrolled Courses", enrolledCourses, true)}
              {availableCourses.length > 0 &&
                renderGrid("Available to Enroll", availableCourses, false)}
            </>
          ) : (
            renderGrid(
              userRole === "Teacher" ? "My Teaching Load" : "System Overview",
              enrolledCourses,
              true,
            )
          )}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
