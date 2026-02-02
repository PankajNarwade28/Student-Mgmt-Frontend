import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../../../../../api/axiosInstance";
import {
  HiOutlineUserAdd,
  HiOutlineTrash,
  HiOutlineX,
  HiOutlineBookOpen,
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

  // const fetchData = useCallback(async () => {
  //   try {
  //     setLoading(true);
  //     const response = await api.get("/api/admin/courses/enrollment-data");
  //     setCourses(response.data.courses);
  //     setAllStudents(response.data.students);
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Failed to load enrollment data");
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);

  // useEffect(() => {
  //   fetchData();
  // }, [fetchData]);

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
    } catch (err) {
      console.error(err);
      toast.error("Operation failed");
    }
  };

  if (loading)
    return <div className="animate-pulse h-40 bg-white rounded-2xl" />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <div
            key={course.id}
            onClick={() => setSelectedCourse(course)}
            className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-500 cursor-pointer transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <HiOutlineBookOpen size={20} />
              </div>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                {course.code}
              </span>
            </div>
            <h3 className="font-bold text-slate-900 truncate">{course.name}</h3>
            <p className="text-xs text-indigo-600 font-semibold mt-2">
              {course.enrolled_students?.length || 0} Students Enrolled
            </p>
          </div>
        ))}
      </div>

      {/* ASSIGNMENT MODAL */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-100 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Manage Enrollment
                </h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  {selectedCourse.name}
                </p>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
              >
                <HiOutlineX />
              </button>
            </div>

            <div className="p-6 max-h-[50vh] overflow-y-auto space-y-2">
              {allStudents.map((student) => {
                const isEnrolled = selectedCourse.enrolled_students?.some(
                  (s) => s.id === student.id,
                );
                return (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-50 bg-slate-50/30 group hover:bg-slate-50"
                  >
                    <span className="text-sm font-medium text-slate-700">
                      {student.name}
                    </span>
                    <button
                      onClick={() =>
                        toggleEnrollment(
                          student.id,
                          selectedCourse.id,
                          !!isEnrolled,
                        )
                      }
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                        isEnrolled
                          ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
                          : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                      }`}
                    >
                      {isEnrolled ? (
                        <>
                          <HiOutlineTrash /> Remove
                        </>
                      ) : (
                        <>
                          <HiOutlineUserAdd /> Assign
                        </>
                      )}
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
