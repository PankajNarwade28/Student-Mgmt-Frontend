import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  HiOutlineArrowLeft,
  HiOutlineSpeakerphone,
  HiOutlineTrash,
  HiOutlineCalendar,
  HiOutlineHashtag,
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

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const userRole = localStorage.getItem("userRole") || "Student";

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

  const openDeleteModal = (id: number) => {
    setSelectedId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedId) return;
    try {
      await api.delete(`/api/teacher/announcements/${selectedId}`);
      toast.success("Broadcast entry revoked");
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-44 bg-slate-50 rounded-[2rem] border border-slate-100" />
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
              className="relative group p-8 bg-white border border-slate-100 rounded-[2rem] shadow-xl shadow-teal-900/5 hover:shadow-teal-900/10 hover:border-teal-500/30 transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              {/* Subtle Background Watermark */}
              <div className="absolute -bottom-4 -right-4 opacity-[0.02] pointer-events-none group-hover:scale-110 transition-transform">
                <HiOutlineSpeakerphone size={120} />
              </div>

              {(userRole === "Admin" || userRole === "Teacher") && (
                <button
                  onClick={() => openDeleteModal(ann.id)}
                  className="absolute top-6 right-6 p-2.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 z-10 shadow-sm bg-white"
                  title="Revoke Broadcast"
                >
                  <HiOutlineTrash size={18} />
                </button>
              )}

              <div>
                <div className="flex justify-between items-center mb-5">
                  <span
                    className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm ${
                      ann.type === "tutorial"
                        ? "bg-amber-50 text-amber-600 border-amber-100"
                        : "bg-teal-50 text-teal-600 border-teal-100"
                    }`}
                  >
                    {ann.type}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full">
                    <HiOutlineCalendar className="text-teal-500" />
                    {new Date(ann.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                  </div>
                </div>

                <h3 className="text-xl font-black text-slate-800 mb-3 pr-10 leading-tight tracking-tight group-hover:text-teal-700 transition-colors">
                  {ann.title}
                </h3>
                
                <p className="text-sm text-slate-500 font-medium line-clamp-3 leading-relaxed italic">
                  "{ann.content}"
                </p>
              </div>
              
              <div className="mt-6 pt-5 border-t border-slate-50 flex items-center justify-between">
                 <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1">
                   <HiOutlineHashtag /> Entry_{ann.id}
                 </span>
                 <button className="text-[10px] font-black text-teal-600 uppercase tracking-widest hover:underline decoration-2 underline-offset-4">
                    Read Metadata
                 </button>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="text-center py-24 bg-white rounded-[3rem] border-4 border-dashed border-gray-50">
        <div className="bg-slate-50 p-6 rounded-[2rem] w-fit mx-auto mb-6">
          <HiOutlineSpeakerphone className="text-5xl text-slate-200" />
        </div>
        <h3 className="text-xl font-black text-slate-800 tracking-tight">Broadcast Registry Empty</h3>
        <p className="text-slate-400 text-sm font-medium mt-2">No active announcements have been deployed for this module.</p>
      </div>
    );
  })();

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500">
      {/* 1. COMPACT NAV HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-slate-100">
        <div className="space-y-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-teal-600 transition-all group"
          >
            <HiOutlineArrowLeft className="group-hover:-translate-x-1 transition-transform" /> 
            Back to Course Registry
          </button>
          
          <h1 className="text-2xl md:text-4xl font-black text-slate-800 flex items-center gap-4 tracking-tighter">
            <HiOutlineSpeakerphone className="text-teal-600 shrink-0" />
            Module Broadcast Stream
          </h1>
          
          <div className="flex items-center gap-3 mt-2">
             <span className="text-[10px] font-black bg-teal-50 text-teal-600 px-3 py-1 rounded-full border border-teal-100 uppercase tracking-widest">
               ID: {courseId}
             </span>
             <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-3 py-1 rounded-full uppercase tracking-widest">
               Live Sync Active
             </span>
          </div>
        </div>
      </div>

      {/* 2. DYNAMIC CONTENT AREA */}
      <section className="relative">
        {announcementsContent}
      </section>

      {/* 3. REFINED CONFIRMATION MODAL */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setSelectedId(null);
        }}
        title="Revoke Broadcast"
        message="Are you sure you want to permanently revoke this broadcast entry? This data will be purged from the student registry and cannot be recovered."
        confirmText="Revoke Entry"
      />
    </div>
  );
};

export default AccessCourse;