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
      const { data } = await api.get(`/api/admin/courses/${courseId}/enrollments`);
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
          await api.patch(`/api/admin/enrollments/${student.enrollment_id}/status`, {
            status: newStatus,
          });
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
    statusFilter === "ALL" ? true : s.status === statusFilter
  );

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <HiOutlineShieldCheck className="text-indigo-600" /> Enrollment Status
          </h1>
          <p className="text-sm text-slate-500">Manage student enrollment lifecycle and states.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative w-full md:w-64">
            <HiOutlineBookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 ring-indigo-500/20 text-sm font-medium text-slate-700 appearance-none shadow-sm"
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
            >
              <option value="">Select Course...</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.code}</option>
              ))}
            </select>
          </div>

          <div className="relative w-full md:w-48">
            <HiOutlineFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 ring-indigo-500/20 text-sm font-medium text-slate-700 appearance-none shadow-sm"
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

      {!selectedCourseId ? (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-medium">Please select a course to manage enrollments.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Current Status</th>
                <th className="px-6 py-4 text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={3} className="text-center py-10 animate-pulse text-slate-400">
                    Loading students...
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-10 text-slate-400">
                    No students found with the selected status.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.student_id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-full text-slate-400">
                          <HiOutlineUserCircle size={20} />
                        </div>
                        <span className="font-bold text-slate-700">{student.student_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          student.status === "Active"
                            ? "bg-emerald-50 text-emerald-600"
                            : student.status === "Dropped"
                              ? "bg-red-50 text-red-600"
                              : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <select
                        className="text-xs font-bold bg-slate-100 border-none rounded-lg px-2 py-1 outline-none focus:ring-2 ring-indigo-500 cursor-pointer"
                        value={student.status}
                        onChange={(e) => handleStatusChange(student, e.target.value)}
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