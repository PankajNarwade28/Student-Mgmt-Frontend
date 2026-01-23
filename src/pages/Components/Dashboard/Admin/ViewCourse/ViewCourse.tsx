import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import api from "../../../../../api/axiosInstance";
import {
  HiOutlineBookOpen,
  HiOutlineUser,
  HiOutlineRefresh, 
} from "react-icons/hi";
import axios from "axios";

interface Course {
  id: number;
  name: string;
  code: string;
  deleted_at: string | null;
  createed_at: string;
  description: string;
  teacher_name: string;
  teacher_email: string;
}

const ViewCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleDelete = async (courseId: number) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      //
      await api.delete(`/api/admin/courses/${courseId}`);
      toast.success("Course deleted successfully");
      // Refresh the list locally
    //   setCourses((prev) => prev.filter((c) => c.id !== courseId));
        fetchCourses();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(
          `Error: ${error.response.data.message || "Failed to delete course"}`,
        );
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const handleRestore = async (courseId: number) => {
  try {
    console.log("Restoring course with ID:", courseId); //
    await api.patch(`/api/admin/courses/${courseId}/restore`);
    toast.success("Course restored!");
    fetchCourses(); // Refresh list
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      toast.error(
        `Error: ${error.response.data.message || "Failed to restore course"}`,
      );
    } else {        
    toast.error("Failed to restore course");
    }
  }
};

  const handleUpdate = () => {
    // Option 1: Navigate to an edit page
    // navigate(`/admin/courses/edit/${course.id}`);

    // Option 2: Open a modal (you would need to manage modal state)
    toast.loading("Edit functionality coming soon...");
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="p-6 min-h-[calc(100vh-250px)] animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Academic Courses
          </h2>
          <p className="text-gray-400 text-sm">
            Manage all registered courses and assignments
          </p>
        </div>
        <button
          onClick={fetchCourses}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-slate-600"
        >
          <HiOutlineRefresh
            className={`text-xl ${loading ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
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
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          isDeleted ? "bg-red-200 text-red-600" : "bg-slate-800 text-white"
        }`}>
          <HiOutlineBookOpen className="text-2xl" />
        </div>
        <span className="bg-slate-50 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold uppercase border border-slate-100">
          {course.code}
        </span>
      </div>

      <h3 className={`text-lg font-bold mb-1 ${isDeleted ? "text-red-900" : "text-slate-800"}`}>
        {course.name}
      </h3>
      <p className="text-gray-400 text-sm line-clamp-2 mb-4">
        {course.description || "No description provided."}
      </p>

      {/* Action Buttons - Hidden or changed for deleted courses */}
      {!isDeleted ? (
        <div className="flex gap-2 mb-4">
          <button onClick={() => handleUpdate()} className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-600 py-2 rounded-xl text-xs font-bold transition-all border border-slate-100">
            Update
          </button>
          <button onClick={() => handleDelete(course.id)} className="flex-1 bg-red-50 hover:bg-red-100 text-red-500 py-2 rounded-xl text-xs font-bold transition-all border border-red-100">
            Delete
          </button>
        </div>
      ) : (
        <div className="mb-4">
           <button 
             onClick={() => handleRestore(course.id)} 
             className="w-full bg-white hover:bg-green-50 text-green-600 py-2 rounded-xl text-xs font-bold transition-all border border-green-100"
           >
             Restore Course
           </button>
        </div>
      )}

      {/* Teacher Footer */}
      <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
          <HiOutlineUser className="text-gray-400" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-700">{course.teacher_name || "Unassigned"}</span>
          <span className="text-[10px] text-gray-400">{course.teacher_email}</span>
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
    </div>
  );
};

export default ViewCourses;
