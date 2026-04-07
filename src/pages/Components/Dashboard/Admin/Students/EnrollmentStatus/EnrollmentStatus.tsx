import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import {
  HiOutlineUserCircle,
  HiOutlineBookOpen,
  HiOutlineShieldCheck,
  HiOutlineFilter,
} from "react-icons/hi";
import api from "../../../../../../api/axiosInstance";
import ConfirmationModal from "../../../../Modal/confirmationModal";

interface CourseRef {
  id: number;
  name: string;
  code: string;
}
interface EnrolledStudent {
  enrollment_id: number;
  student_id: string;
  student_name: string;
  status: string;
}

interface ModalConfig {
  title: string;
  message: string;
  type: "danger" | "warning" | "info" | "success";
  confirmText: string;
  onConfirm: () => Promise<void> | void;
}

const EnrollmentStatus: React.FC = () => {
  const [courses, setCourses] = useState<CourseRef[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [students, setStudents] = useState<EnrolledStudent[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [loading, setLoading] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);

  const fetchCourses = useCallback(async () => {
    try {
      const { data } = await api.get("/api/admin/courses/enrollments/data");
      console.log("Fetched courses for enrollment status:", data);
      setCourses(data.courses || []);
    } catch (err: unknown) {
      console.error(err);
      toast.error("Failed to load courses");
    }
  }, []);

  const fetchStudents = useCallback(async (courseId: string) => {
    if (!courseId) return;
    try {
      setLoading(true);
      const { data } = await api.get(
        `/api/admin/courses/${courseId}/enrollments`,
      );
      setStudents(data);
    } catch (err: unknown) {
      console.error(err);
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    if (selectedCourseId) fetchStudents(selectedCourseId);
    else setStudents([]);
  }, [selectedCourseId, fetchStudents]);

  const handleStatusChange = (student: EnrolledStudent, newStatus: string) => {
    if (student.status === newStatus) return;

    setModalConfig({
      title: "Update Enrollment Status",
      message: `Are you sure you want to change ${student.student_name}'s status from ${student.status} to ${newStatus}?`,
      type: newStatus === "Dropped" ? "danger" : "warning",
      confirmText: "Confirm Change",
      onConfirm: async () => {
        try {
          await api.patch(
            `/api/admin/enrollments/${student.enrollment_id}/status`,
            {
              status: newStatus,
            },
          );
          toast.success("Status updated successfully");
          fetchStudents(selectedCourseId);
        } catch (err: unknown) {
          console.error(err);
          toast.error("Failed to update status");
        } finally {
          setIsModalOpen(false);
        }
      },
    });
    setIsModalOpen(true);
  };

  // FIX: The filter now checks against the exact DB strings
  const filteredStudents = students.filter((s) =>
    statusFilter === "ALL" ? true : s.status === statusFilter,
  );

  return (
    <div className="p-2 md:p-4  mx-auto">
      <div className="p-2 md:p-4 mx-auto   animate-in fade-in duration-500">
        {/* 1. HEADER & CONTROLS */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <nav className="text-[10px] font-black text-[#00796b] uppercase tracking-[0.2em] mb-2">
              Student Lifecycle
            </nav>
            <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3 tracking-tight">
              <HiOutlineShieldCheck className="text-[#00796b]" />
              Enrollment Status
            </h1>
            <p className="text-sm text-slate-400 font-medium">
              Manage student enrollment lifecycle and states.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Course Selector */}
            <div className="relative group w-full md:w-64">
              <HiOutlineBookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00796b] transition-colors" />
              <select
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-4 ring-teal-500/5 focus:border-[#00796b] text-xs font-bold text-slate-700 appearance-none shadow-sm transition-all"
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
              >
                <option value="">Select Course...</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {`${c.code} - ${c.name}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Selector */}
            <div className="relative group w-full md:w-48">
              <HiOutlineFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00796b] transition-colors" />
              <select
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-4 ring-teal-500/5 focus:border-[#00796b] text-xs font-bold text-slate-700 appearance-none shadow-sm transition-all"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Dropped">Dropped</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. MAIN CONTENT AREA */}
        {!selectedCourseId ? (
          <div className="text-center py-24 bg-white rounded-[3rem] border-4 border-dashed border-slate-50">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiOutlineBookOpen className="text-slate-300 text-2xl" />
            </div>
            <p className="text-slate-400 font-black text-xs uppercase tracking-[0.2em]">
              Please select a course to manage enrollments
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] border border-slate-50 shadow-xl shadow-teal-900/5 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-50">
                  <th className="px-8 py-5">Student Identity</th>
                  <th className="px-8 py-5">Current State</th>
                  <th className="px-8 py-5 text-right">Operational Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="text-center py-20">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-4 border-teal-50 border-t-[#00796b] rounded-full animate-spin" />
                        <span className="text-[10px] font-black text-[#00796b] uppercase tracking-widest">
                          Syncing Records...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="text-center py-20 text-slate-400 font-bold text-xs uppercase tracking-widest"
                    >
                      No matching student records found.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr
                      key={student.student_id}
                      className="hover:bg-teal-50/30 transition-all group"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-slate-100 rounded-xl text-slate-400 group-hover:bg-white group-hover:text-[#00796b] transition-all shadow-sm">
                            <HiOutlineUserCircle size={22} />
                          </div>
                          <span className="font-bold text-slate-700 tracking-tight">
                            {student.student_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter border shadow-sm ${
                            student.status === "Active"
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                              : student.status === "Dropped"
                                ? "bg-red-50 text-red-600 border-red-100"
                                : "bg-amber-50 text-amber-600 border-amber-100"
                          }`}
                        >
                          {student.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <select
                          className="text-[10px] font-black uppercase tracking-widest bg-gray-50 border-none rounded-xl px-4 py-2 outline-none focus:ring-4 ring-teal-500/10 cursor-pointer text-slate-600 hover:text-[#00796b] transition-all"
                          value={student.status}
                          onChange={(e) =>
                            handleStatusChange(student, e.target.value)
                          }
                        >
                          <option value="Active">Active</option>
                          <option value="Dropped">Dropped</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && modalConfig && (
        <ConfirmationModal
          isOpen={isModalOpen}
          title={modalConfig.title}
          message={modalConfig.message}
          type={modalConfig.type}
          confirmText={modalConfig.confirmText}
          onConfirm={modalConfig.onConfirm}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default EnrollmentStatus;
