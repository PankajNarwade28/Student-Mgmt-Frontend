import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import ConfirmationModal from "../../../Modal/confirmationModal";
import { HiOutlineSearch } from "react-icons/hi";
import api from "../../../../../api/axiosInstance";
import type { Course } from "../../../../../models/course";
import {
  HiOutlineBookOpen,
  HiOutlineUser,
  HiOutlineRefresh,
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
        (course.teacher_email &&
          course.teacher_email.toLowerCase().includes(searchLower))
      );
    });

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="p-6 min-h-[calc(100vh-250px)] animate-in fade-in duration-500">
      <div className="flex flex-col gap-6 mb-8 md:flex-row md:items-center md:justify-between">
  {/* TEXT SECTION */}
  <div className="space-y-1">
    <h2 className="text-xl font-bold text-slate-800 md:text-2xl">
      Academic Courses
    </h2>
    <p className="text-gray-400 text-xs md:text-sm">
      Manage all registered courses and assignments
    </p>
  </div>

  {/* ACTIONS SECTION (Search + Buttons) */}
  <div className="flex flex-col gap-4 sm:flex-row sm:items-center w-full md:w-auto">
    
    {/* SEARCH BAR */}
    <div className="relative w-full md:w-72">
      <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder="Search name, code..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 ring-slate-800/5 outline-none transition-all text-sm"
      />
    </div>

    {/* BUTTON GROUP */}
    <div className="flex items-center justify-between gap-2 sm:justify-end">
      {/* ARCHIVE TOGGLE */}
      <button
        onClick={() => setShowDeleted(!showDeleted)}
        className={`flex flex-1 sm:flex-none items-center justify-center gap-2 px-4 py-2 rounded-full text-[10px] md:text-xs font-bold transition-all border ${
          showDeleted
            ? "bg-red-50 text-red-600 border-red-100"
            : "bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100"
        }`}
      >
        <span className="whitespace-nowrap">
          {showDeleted ? "Hide Archived" : "Show Archived"}
        </span>
        <div
          className={`w-2 h-2 rounded-full shrink-0 ${
            showDeleted ? "bg-red-500" : "bg-gray-300"
          }`}
        ></div>
      </button>

      {/* REFRESH BUTTON */}
      <button
        onClick={fetchCourses}
        className="p-2.5 bg-gray-50 border border-gray-100 sm:border-none sm:bg-transparent hover:bg-gray-100 rounded-full transition-colors text-slate-600"
      >
        <HiOutlineRefresh
          className={`text-xl ${loading ? "animate-spin" : ""}`}
        />
      </button>
    </div>
  </div>
</div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const isDeleted = course.deleted_at !== null;

            return (
              <div
                key={course.id}
                className={`relative border rounded-3xl p-6 transition-all ${
                  isDeleted
                    ? "bg-red-50/30 border-red-100 grayscale-[0.5] opacity-80"
                    : "bg-white border-gray-100 shadow-xl shadow-slate-200/40 hover:shadow-slate-200/60"
                }`}
              >
                {/* Deleted Badge */}
                {isDeleted && (
                  <div className="absolute -top-3 right-6 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">
                    Archived / Deleted
                  </div>
                )}

                <div className="flex justify-between items-start mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isDeleted
                        ? "bg-red-200 text-red-600"
                        : "bg-slate-800 text-white"
                    }`}
                  >
                    <HiOutlineBookOpen className="text-2xl" />
                  </div>
                  <span className="bg-slate-50 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold uppercase border border-slate-100">
                    {course.code}
                  </span>
                </div>

                <h3
                  className={`text-lg font-bold mb-1 ${isDeleted ? "text-red-900" : "text-slate-800"}`}
                >
                  {course.name}
                </h3>
                <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                  {course.description || "No description provided."}
                </p>

                {/* Action Buttons - Hidden or changed for deleted courses */}
                {/* Inside course map */}
                {!isDeleted ? (
                  <div className="flex justify-between gap-4 items-center mb-4">
                    <button
                      onClick={() => handleUpdate(course)}
                      className="ml-2 flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 rounded-xl text-xs font-bold transition-all border border-blue-100"
                    >
                      Edit Course
                    </button>
                    <button
                      onClick={() => openDeleteModal(course.id)}
                      className="flex-1 bg-red-50 hover:bg-red-100 text-red-500 py-2 rounded-xl text-xs font-bold transition-all border border-red-100"
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => openRestoreModal(course.id)}
                    className="w-full bg-white hover:bg-green-50 text-green-600 py-2 rounded-xl text-xs font-bold transition-all border border-green-100"
                  >
                    Restore Course
                  </button>
                )}

                {/* Teacher Footer */}
                <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <HiOutlineUser className="text-gray-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-700">
                      {course.teacher_name || "Unassigned"}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {course.teacher_email}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && courses.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400 font-medium">
            No courses found. Start by adding a new one.
          </p>
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
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">
                  Course Name
                </label>
                <input
                  className="w-full bg-gray-50 border-2 border-gray-50 p-3.5 rounded-2xl focus:border-slate-800 outline-none transition-all"
                  value={editingCourse.name}
                  onChange={(e) =>
                    setEditingCourse({ ...editingCourse, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">
                  Course Code
                </label>
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
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">
                  Assign Teacher
                </label>
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
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">
                  Description
                </label>
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
