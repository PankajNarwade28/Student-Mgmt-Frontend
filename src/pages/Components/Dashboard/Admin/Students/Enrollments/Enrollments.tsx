import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import api from "../../../../../../api/axiosInstance";
import {
  HiOutlineUserAdd,
  HiOutlineTrash,
  HiOutlineX,
  HiOutlineBookOpen,
  HiOutlineChevronRight,
} from "react-icons/hi";

interface StudentRef {
  id: string;
  name: string;
}
interface CourseDetail {
  id: number;
  name: string;
  code: string;
  enrolled_students: StudentRef[];
}

const Enrollments: React.FC = () => {
  const [courses, setCourses] = useState<CourseDetail[]>([]);
  const [allStudents, setAllStudents] = useState<StudentRef[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<CourseDetail | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
  // Move the function inside so it's not a dependency
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/admin/courses/enrollment-data");
      setCourses(response.data.courses);
      setAllStudents(response.data.students);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load enrollment data");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []); // Empty array means this runs only ONCE on mount

  const toggleEnrollment = async (
    studentId: string,
    courseId: number,
    isCurrentlyEnrolled: boolean,
  ) => {
    try {
      const action = isCurrentlyEnrolled ? "remove" : "add";
      await api.post(`/api/admin/courses/enrollments/${action}`, {
        studentId,
        courseId,
      });

      const studentName = allStudents.find((s) => s.id === studentId)?.name;
      const courseName = selectedCourse?.name;

      if (isCurrentlyEnrolled) {
        toast.error(`Removed ${studentName} from ${courseName}`, {
          icon: "⚠️",
          style: {
            background: "#FFFBEB", // Light yellow/orange
            color: "#92400E", // Dark brown/orange
            border: "1px solid #FCD34D",
          },
        });
      } else {
        toast.success(`Assigned ${studentName} to ${courseName}`);
      }

      // 1. Refresh the main background list
      // await fetchData();

      // 2. IMPORTANT: Update the modal state manually so the buttons flip immediately
      if (selectedCourse) {
        const updatedEnrolledStudents = isCurrentlyEnrolled
          ? selectedCourse.enrolled_students.filter((s) => s.id !== studentId) // Remove locally
          : [
              ...selectedCourse.enrolled_students,
              allStudents.find((s) => s.id === studentId)!,
            ]; // Add locally

        setSelectedCourse({
          ...selectedCourse,
          enrolled_students: updatedEnrolledStudents,
        });
      }
    } catch (err: unknown) {
      console.error(err);

      if (axios.isAxiosError(err)) {
        console.log("Error response from server:", err.response);
      }

      const errorMsg = axios.isAxiosError<{ message?: string }>(err)
        ? err.response?.data?.message || "Failed to update enrollment"
        : "Failed to update enrollment";

      toast.error(errorMsg);
    }
  };

  if (loading)
    return <div className="animate-pulse h-40 bg-white rounded-2xl" />;

  return (
   <div className="space-y-6 animate-in fade-in duration-500">
  {/* Course Selection Grid */}
 <div className="space-y-4 animate-in fade-in duration-500">
  {/* Header Section for Context */}
  <div className="flex items-center justify-between px-2">
    <div>
      <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Available Modules</h3>
      <p className="text-[10px] text-slate-400 font-medium">Select a course to manage enrollment status</p>
    </div>
    <div className="text-[10px] font-black text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
      {courses.length} ACTIVE
    </div>
  </div>

  {/* Compact 4-Column Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {courses.map((course) => (
      <button
        key={course.id}
        onClick={() => setSelectedCourse(course)}
        className="group relative bg-white p-4 rounded-2xl border border-slate-50 shadow-sm hover:shadow-md hover:border-teal-500 transition-all duration-300 text-left flex flex-col justify-between h-full"
      >
        {/* Top Section: Icon and Code */}
        <div className="flex justify-between items-start mb-3">
          <div className="p-2 bg-teal-50 text-teal-600 rounded-xl group-hover:bg-teal-600 group-hover:text-white transition-all shadow-sm">
            <HiOutlineBookOpen size={18} />
          </div>
          <span className="text-[9px] font-black text-teal-600/70 bg-teal-50/50 px-2 py-0.5 rounded-md border border-teal-100/30 uppercase tracking-tighter">
            {course.code}
          </span>
        </div>

        {/* Middle Section: Name */}
        <div className="mb-4">
          <h4 className="font-bold text-slate-800 text-sm leading-tight group-hover:text-teal-700 transition-colors line-clamp-1">
            {course.name}
          </h4>
          <p className="text-[10px] text-slate-400 font-medium mt-0.5 line-clamp-1">
            System Identity Registry
          </p>
        </div>

        {/* Bottom Section: Stats Footer */}
        <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight">
              {course.enrolled_students?.length || 0} Members
            </span>
          </div>
          <div className="text-[9px] font-bold text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            Manage <HiOutlineChevronRight />
          </div>
        </div>
      </button>
    ))}
  </div>
</div>

  {/* ASSIGNMENT MODAL */}
  {selectedCourse && (
    <div className="fixed inset-0 bg-[#004d40]/30 backdrop-blur-md z-[150] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-teal-50/30">
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">
              Manage Enrollment
            </h2>
            <p className="text-[10px] text-teal-600 font-black uppercase tracking-[0.2em] mt-1">
              {selectedCourse.name}
            </p>
          </div>
          <button
            onClick={() => setSelectedCourse(null)}
            className="p-2.5 hover:bg-white rounded-full transition-all text-slate-400 hover:text-red-500"
          >
            <HiOutlineX size={20} />
          </button>
        </div>

        <div className="p-8 max-h-[50vh] overflow-y-auto space-y-3 scrollbar-hide">
          {allStudents.map((student) => {
            const isEnrolled = selectedCourse.enrolled_students?.some((s) => s.id === student.id);
            return (
              <div
                key={student.id}
                className="flex items-center justify-between p-4 rounded-[1.25rem] border border-slate-50 bg-slate-50/50 hover:bg-white hover:shadow-sm transition-all"
              >
                <span className="text-sm font-bold text-slate-700">
                  {student.name}
                </span>
                <button
                  onClick={() => toggleEnrollment(student.id, selectedCourse.id, !!isEnrolled)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    isEnrolled
                      ? "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white"
                      : "bg-teal-50 text-teal-600 hover:bg-teal-600 hover:text-white"
                  }`}
                >
                  {isEnrolled ? <><HiOutlineTrash /> Remove</> : <><HiOutlineUserAdd /> Assign</>}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )}
</div>
  );
};

export default Enrollments;
