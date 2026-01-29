import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  HiOutlineArrowLeft,
  HiOutlineSpeakerphone,
  HiOutlineTrash,
} from "react-icons/hi";
import api from "../../../../../api/axiosInstance";
import { toast } from "react-hot-toast";
import ConfirmationModal from "../../../Modal/confirmationModal";

interface Announcement {
  id: number;
  title: string;
  content: string;
  type: "notice" | "tutorial";
  created_at: string;
}

const AccessCourse: React.FC = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  // Unified State for Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const userRole = localStorage.getItem("userRole") || "Student";

  // RBAC Check
  useEffect(() => {
    if (userRole !== "Student" && userRole !== "Teacher" && userRole !== "Admin") {
      toast.error("Unauthorized access.");
      navigate("/dashboard");
    }
  }, [userRole, navigate]);

  const fetchCourseData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/teacher/courses/${courseId}/announcements`);
      setAnnouncements(response.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load course content");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchCourseData();
  }, [fetchCourseData]);

  // Unified Trigger Function
  const openDeleteModal = (id: number) => {
    setSelectedId(id);
    setIsDeleteModalOpen(true);
  };

  // Unified Confirm Action
  const handleDeleteConfirm = async () => {
    if (!selectedId) return;
    try {
      await api.delete(`/api/teacher/announcements/${selectedId}`);
      toast.success("Announcement deleted");
      fetchCourseData(); 
    } catch (err) {
      console.error(err);
      toast.error("Error deleting announcement");
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedId(null);
    }
  };

  const announcementsContent = (() => {
    if (loading) {
      return (
        <div className="space-y-4 animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 bg-slate-100 rounded-3xl" />
          ))}
        </div>
      );
    }

    if (announcements.length > 0) {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className="relative group p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md hover:border-indigo-200 transition-all flex flex-col justify-between"
            >
              {(userRole === "Admin" || userRole === "Teacher") && (
                <button
                  onClick={() => openDeleteModal(ann.id)}
                  className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100 z-10"
                  title="Delete Announcement"
                >
                  <HiOutlineTrash size={20} />
                </button>
              )}

              <div>
                <div className="flex justify-between items-start mb-3">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                      ann.type === "tutorial"
                        ? "bg-amber-50 text-amber-600"
                        : "bg-indigo-50 text-indigo-600"
                    }`}
                  >
                    {ann.type}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium bg-slate-50 px-2 py-1 rounded-md">
                    {new Date(ann.created_at).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 pr-8 leading-tight">
                  {ann.title}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed">
                  {ann.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="text-center py-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
        <p className="text-slate-400">No announcements available yet.</p>
      </div>
    );
  })();

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors py-2"
      >
        <HiOutlineArrowLeft /> <span className="text-sm md:text-base">Back to My Courses</span>
      </button>

      <section className="space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-3">
            <HiOutlineSpeakerphone className="text-indigo-600" />
            Course Stream
          </h1>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
            Course ID: {courseId}
          </p>
        </div>

        {announcementsContent}
      </section>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteModalOpen(false)}
        title="Delete Announcement"
        message="This will permanently remove this update. This action cannot be undone."
      />
    </div>
  );
};

export default AccessCourse;