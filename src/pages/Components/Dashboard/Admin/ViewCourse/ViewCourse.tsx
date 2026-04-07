import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import ConfirmationModal from "../../../Modal/confirmationModal"; 
import api from "../../../../../api/axiosInstance";
import type { Course } from "../../../../../models/course";
import {
  HiOutlineBookOpen,
  HiOutlineUser,
  HiOutlineRefresh,
  HiOutlineSearch
} from "react-icons/hi";
import axios from "axios";

const ViewCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleted, setShowDeleted] = useState(false);
  const [teachers, setTeachers] = useState<
    { id: string; teacher_name: string }[]
  >([]); // To hold the dropdown list

  // Triggers for opening modals
  const openDeleteModal = (id: number) => {
    setSelectedCourseId(id);
    setIsDeleteModalOpen(true);
  };

  const openRestoreModal = (id: number) => {
    setSelectedCourseId(id);
    setIsRestoreModalOpen(true);
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/admin/courses");
      toast.success("Courses fetched successfully");
      setCourses(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(
          `Error: ${error.response.data.message || "Unable to fetch courses"}`,
        );
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  // Actual API call for Deletion
  const handleDeleteConfirm = async () => {
    if (!selectedCourseId) return;
    try {
      await api.delete(`/api/admin/courses/${selectedCourseId}`);
      toast.success("Course deleted successfully");
      fetchCourses();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(`Error: ${error.response.data.message || "Delete failed"}`);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedCourseId(null);
    }
  };

  // Actual API call for Restoration
  const handleRestoreConfirm = async () => {
    if (!selectedCourseId) return;
    try {
      await api.patch(`/api/admin/courses/${selectedCourseId}/restore`);
      toast.success("Course restored!");
      fetchCourses();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(
          `Error: ${error.response.data.message || "Restore failed"}`,
        );
      } else {
        toast.error("Failed to restore course");
      }
    } finally {
      setIsRestoreModalOpen(false);
      setSelectedCourseId(null);
    }
  };

  const handleUpdate = async (course: Course) => {
    // Pre-fill existing data
    setEditingCourse({ ...course });

    // Ensure teacher list is loaded immediately
    try {
      const response = await api.get("/api/admin/teachers");
      setTeachers(response.data);
      setIsEditModalOpen(true);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(
          `Error: ${error.response.data.message || "Unable to load teachers"}`,
        );
      } else {
        toast.error("Failed to load teacher list");
      }
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;

    try {
      // API uses the course integer ID
      await api.put(`/api/admin/courses/${editingCourse.id}`, {
        name: editingCourse.name,
        code: editingCourse.code,
        description: editingCourse.description,
        teacher_id: editingCourse.teacher_id, // UUID from users table
      });

      toast.success("Course updated!");
      setIsEditModalOpen(false);
      fetchCourses(); // Refresh the list
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(`Error: ${error.response.data.message || "Update failed"}`);
      } else {
        toast.error("Failed to update course");
      }
    }
  };

  const filteredCourses = courses
    .filter((course) => (showDeleted ? true : course.deleted_at === null))
    .filter((course) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        course.name.toLowerCase().includes(searchLower) ||
        course.code.toLowerCase().includes(searchLower) ||
        course.teacher_email?.toLowerCase().includes(searchLower)
      );
    });

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="p-4 md:p-6 min-h-[calc(100vh-250px)] animate-in fade-in duration-500">
  {/* 1. COMPACT HEADER */}
  <div className="flex flex-col gap-4 mb-8 md:flex-row md:items-center md:justify-between">
    <div>
      <h2 className="text-xl font-black text-slate-800 tracking-tight">Academic Courses</h2>
      <p className="text-gray-400 text-xs">Manage registered modules and assignments</p>
    </div>

    <div className="flex flex-col gap-3 sm:flex-row sm:items-center w-full md:w-auto">
      {/* COMPACT SEARCH */}
      <div className="relative w-full md:w-64 group">
        <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00796b] text-sm" />
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-white border border-gray-100 rounded-xl focus:ring-2 ring-teal-500/5 focus:border-[#00796b] outline-none transition-all text-xs shadow-sm"
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowDeleted(!showDeleted)}
          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
            showDeleted
              ? "bg-amber-50 text-amber-700 border-amber-100"
              : "bg-teal-50 text-[#00796b] border-teal-100 hover:bg-teal-100/50"
          }`}
        >
          {showDeleted ? "Active Only" : "Archived"}
        </button>

        <button
          onClick={fetchCourses}
          className="p-2 bg-white border border-gray-100 hover:text-[#00796b] rounded-xl transition-all shadow-sm active:scale-95"
        >
          <HiOutlineRefresh className={`text-lg ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>
    </div>
  </div>

  {/* 2. COMPACT 4-COLUMN GRID */}
  {loading ? (
    <div className="flex justify-center items-center h-48">
      <div className="w-8 h-8 border-3 border-teal-50 border-t-[#00796b] rounded-full animate-spin" />
    </div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {filteredCourses.map((course) => {
        const isDeleted = course.deleted_at !== null;

        return (
          <div
            key={course.id}
            className={`relative border rounded-[1.5rem] p-4 transition-all duration-300 flex flex-col justify-between ${
              isDeleted
                ? "bg-gray-50 border-gray-200 opacity-70"
                : "bg-white border-gray-50 shadow-sm hover:shadow-md hover:-translate-y-1"
            }`}
          >
            {/* COMPACT BADGE */}
            <div className="flex justify-between items-start mb-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg ${
                isDeleted ? "bg-gray-200 text-gray-500" : "bg-teal-50 text-[#00796b]"
              }`}>
                <HiOutlineBookOpen />
              </div>
              <span className="text-[9px] font-black uppercase tracking-tighter text-teal-600 bg-teal-50/50 px-2 py-0.5 rounded-md border border-teal-100/50">
                {course.code}
              </span>
            </div>

            {/* CONTENT */}
            <div className="mb-4">
              <h3 className={`text-sm font-black mb-1 truncate ${isDeleted ? "text-gray-500" : "text-slate-800"}`}>
                {course.name}
              </h3>
              <p className="text-gray-400 text-[11px] leading-snug line-clamp-2 h-8">
                {course.description || "No module description available for this course entry."}
              </p>
            </div>

            {/* TEACHER MINIMIZED */}
            <div className="flex items-center gap-2 mb-4 p-2 bg-gray-50/50 rounded-xl border border-gray-100/50">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-[10px] text-gray-400 border border-gray-100">
                <HiOutlineUser />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-[10px] font-black text-slate-700 truncate uppercase tracking-tighter">
                  {course.teacher_name || "Lead Pending"}
                </span>
              </div>
            </div>

            {/* COMPACT ACTIONS */}
            <div className="flex gap-2">
              {isDeleted ? (
                <button
                  onClick={() => openRestoreModal(course.id)}
                  className="w-full bg-[#00796b] text-white py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-[#004d40] transition-all"
                >
                  Restore
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleUpdate(course)}
                    className="flex-1 bg-white hover:bg-teal-50 text-[#00796b] py-2 rounded-lg text-[9px] font-black uppercase border border-teal-50 transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteModal(course.id)}
                    className="flex-1 bg-white hover:bg-red-50 text-red-500 py-2 rounded-lg text-[9px] font-black uppercase border border-red-50 transition-all"
                  >
                    Archive
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  )}
      {/* SIMPLE EDIT MODAL */}
      {isEditModalOpen && editingCourse && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-100 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
              Update Course
            </h2>

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase ml-1">
                  Course Name
                </div>
                <input
                  className="w-full bg-gray-50 border-2 border-gray-50 p-3.5 rounded-2xl focus:border-slate-800 outline-none transition-all"
                  value={editingCourse.name}
                  onChange={(e) =>
                    setEditingCourse({ ...editingCourse, name: e.target.value })
                  }
                />
              </div>

              <div>
                <div className="text-xs font-bold text-slate-500 uppercase ml-1">
                  Course Code
                </div>
                <input
                  className="w-full bg-gray-50 border-2 border-gray-50 p-3.5 rounded-2xl focus:border-slate-800 outline-none transition-all"
                  value={editingCourse.code}
                  onChange={(e) =>
                    setEditingCourse({
                      ...editingCourse,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                />
              </div>

              <div>
                <div className="text-xs font-bold text-slate-500 uppercase ml-1">
                  Assign Teacher
                </div>
                <select
                  className="w-full bg-gray-50 border-2 border-gray-50 p-3.5 rounded-2xl focus:border-slate-800 outline-none transition-all"
                  // Bind directly to teacher_id UUID from DB
                  value={editingCourse.teacher_id || ""}
                  onChange={(e) =>
                    setEditingCourse({
                      ...editingCourse,
                      teacher_id: e.target.value,
                    })
                  }
                >
                  <option value="" disabled>
                    Select Teacher
                  </option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {/* Use the name from the profile join */}
                      {t.teacher_name || t.id}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-500 uppercase ml-1">
                  Description
                </div>
                <textarea
                  className="w-full bg-gray-50 border-2 border-gray-50 p-3.5 rounded-2xl focus:border-slate-800 outline-none transition-all h-24"
                  value={editingCourse.description}
                  onChange={(e) =>
                    setEditingCourse({
                      ...editingCourse,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-slate-800 text-white py-4 rounded-2xl font-bold hover:bg-slate-900 transition-all shadow-lg"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Archive Course"
        message="Are you sure you want to delete this course? It will be moved to the archived section."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteModalOpen(false)}
        confirmText="Delete Course"
        type="danger"
      />

      {/* Restore Confirmation Modal */}
      <ConfirmationModal
        isOpen={isRestoreModalOpen}
        title="Restore Course"
        message="Do you want to restore this course to active status? It will be visible to students again."
        onConfirm={handleRestoreConfirm}
        onCancel={() => setIsRestoreModalOpen(false)}
        confirmText="Restore Now"
        type="info"
      />
    </div>
  );
};

export default ViewCourses;
