import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import ConfirmationModal from "../Modal/confirmationModal";
import {
  HiOutlineArrowLeft,
  HiOutlinePencilAlt,
  HiOutlineSpeakerphone,
  HiOutlinePlusCircle,
  HiOutlinePlus,
  HiOutlineUserCircle,
  HiOutlineTrash,
} from "react-icons/hi";
import api from "../../../api/axiosInstance";

interface EnrolledStudent {
  enrollment_id: number;
  student_id: string;
  student_name: string;
  grade_value: string | null;
  remarks: string | null;
}

interface Announcement {
  id: number | string;
  course_id: string;
  title: string;
  content: string;
  type: "notice" | "tutorial";
  created_at: string;
}

const TeacherGrade: React.FC = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  // Student & Loading States
  const [students, setStudents] = useState<EnrolledStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] =
    useState<EnrolledStudent | null>(null);
  const [gradeInput, setGradeInput] = useState("");
  const [remarksInput, setRemarksInput] = useState("");

  // Announcement States
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isAnnounceModalOpen, setIsAnnounceModalOpen] =
    useState<boolean>(false);
  const [announceTitle, setAnnounceTitle] = useState("");
  const [announceContent, setAnnounceContent] = useState("");
  const [announceType, setAnnounceType] = useState<"notice" | "tutorial">(
    "notice",
  );

  // NEW: Delete Confirmation States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState<
    number | string | null
  >(null);

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/api/teacher/courses/${courseId}/students`,
      );
      setStudents(response.data);
    } catch (err: unknown) {
      console.error(err);
      toast.error("Failed to load students.");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  const fetchAnnouncements = useCallback(async () => {
    try {
      const response = await api.get(
        `/api/teacher/courses/${courseId}/announcements`,
      );
      setAnnouncements(response.data);
    } catch (err) {
      console.error("Failed to load announcements", err);
    }
  }, [courseId]);

  useEffect(() => {
    fetchStudents();
    fetchAnnouncements();
  }, [fetchStudents, fetchAnnouncements]);

  // Trigger Delete Modal
  const handleDeleteClick = (id: number | string) => {
    setAnnouncementToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // Execute Delete
  const handleDeleteConfirm = async () => {
    if (!announcementToDelete) return;
    try {
      await api.delete(`/api/teacher/announcements/${announcementToDelete}`);
      toast.success("Announcement removed");
      fetchAnnouncements();
    } catch (err: unknown) {
      console.error("Failed to delete announcement", err);
      toast.error("Failed to delete");
    } finally {
      setIsDeleteModalOpen(false);
      setAnnouncementToDelete(null);
    }
  };

  const handlePostAnnouncement = async () => {
    if (!announceTitle || !announceContent)
      return toast.error("Fill in all fields");
    try {
      await api.post(`/api/teacher/announcements`, {
        courseId,
        title: announceTitle,
        content: announceContent,
        type: announceType,
      });
      toast.success("Update posted");
      setIsAnnounceModalOpen(false);
      setAnnounceTitle("");
      setAnnounceContent("");
      fetchAnnouncements();
    } catch (err: unknown) {
      console.error("Error posting update", err);
      toast.error("Error posting update");
    }
  };

  const handleSaveGrade = async () => {
    if (!selectedStudent) return;
    try {
      await api.post(`/api/teacher/grades`, {
        enrollmentId: selectedStudent.enrollment_id,
        grade: Number.parseFloat(gradeInput),
        remarks: remarksInput,
      });
      toast.success("Grade saved");
      setIsModalOpen(false);
      fetchStudents();
    } catch (err: unknown) {
      console.error("Error saving grade", err);
      toast.error("Error saving data");
    }
  };

  const handleOpenModal = (student: EnrolledStudent) => {
    setSelectedStudent(student);
    setGradeInput(student.grade_value || "");
    setRemarksInput(student.remarks || "");
    setIsModalOpen(true);
  };
  if (loading)
    return (
      <div className="animate-pulse space-y-4">
        {/* ... loading skeletons ... */}
        <div className="h-6 bg-slate-200 rounded w-1/4"></div>
        <div className="h-48 bg-slate-200 rounded"></div>
        <div className="h-6 bg-slate-200 rounded w-1/3"></div>
        <div className="h-32 bg-slate-200 rounded"></div>
      </div>
    );

  return (
    <div className="p-3 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-4 md:y-6">
      {/* Header & Back Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors py-2"
        >
          <HiOutlineArrowLeft />{" "}
          <span className="text-sm md:text-base">Back to Courses</span>
        </button>
        <button
          onClick={() => setIsAnnounceModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
        >
          <HiOutlinePlusCircle size={20} /> Post Announcement
        </button>
      </div>
      <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Header Section */}
        <div className="p-4 md:p-6 border-b border-slate-50 bg-slate-50/50 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900">
              Student Grading Sheet
            </h1>
            <p className="text-[10px] md:text-xs text-slate-500 uppercase font-bold tracking-widest mt-1">
              Course ID: {courseId}
            </p>
          </div>
          <div className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full w-fit">
            {students.length} Students Total
          </div>
        </div>

        {/* 1. TABLE VIEW: Hidden on mobile, visible on tablet+ */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4 text-center">Grade Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {students.map((student) => (
                <tr
                  key={student.student_id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-full text-slate-400">
                      <HiOutlineUserCircle size={20} />
                    </div>
                    <span className="font-bold text-slate-700">
                      {student.student_name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {student.grade_value ? (
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold">
                        {student.grade_value}
                      </span>
                    ) : (
                      <span className="text-slate-300 italic text-xs">
                        Not Graded
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleOpenModal(student)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all"
                    >
                      {student.grade_value ? (
                        <>
                          <HiOutlinePencilAlt /> Edit
                        </>
                      ) : (
                        <>
                          <HiOutlinePlus /> Add Grade
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 2. CARD VIEW: Visible on mobile only */}
        <div className="md:hidden divide-y divide-slate-100">
          {students.map((student) => (
            <div
              key={student.student_id}
              className="p-4 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 bg-slate-50 rounded-full text-slate-400 shrink-0">
                  <HiOutlineUserCircle size={24} />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-800 truncate">
                    {student.student_name}
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-tighter">
                    {student.grade_value ? (
                      <span className="text-emerald-500">
                        Grade: {student.grade_value}
                      </span>
                    ) : (
                      <span className="text-slate-400">Ungraded</span>
                    )}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleOpenModal(student)}
                className={`p-3 rounded-xl transition-all ${
                  student.grade_value
                    ? "bg-slate-100 text-slate-600"
                    : "bg-indigo-600 text-white"
                }`}
              >
                {student.grade_value ? (
                  <HiOutlinePencilAlt size={18} />
                ) : (
                  <HiOutlinePlus size={18} />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
      {/* Grade Entry Modal - Optimized for all screens */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-sm rounded-t-[2.5rem] sm:rounded-3xl shadow-2xl p-6 md:p-8 space-y-6 animate-in slide-in-from-bottom sm:zoom-in duration-300">
            {/* Modal Header */}
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-bold text-slate-900">Assign Grade</h2>
              <p className="text-sm text-slate-500">
                Grading:{" "}
                <span className="font-bold text-indigo-600">
                  {selectedStudent?.student_name}
                </span>
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label
                  htmlFor="gradeInput"
                  className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1"
                >
                  Grade (Numeric)
                </label>
                <input
                  id="gradeInput"
                  type="number"
                  step="0.01"
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 ring-indigo-500/10 text-center text-2xl font-black text-indigo-600"
                  placeholder="0.00"
                  value={gradeInput}
                  onChange={(e) => setGradeInput(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="remarksInput"
                  className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1"
                >
                  Teacher Remarks
                </label>
                <textarea
                  id="remarksInput"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 ring-indigo-500/10 text-sm resize-none"
                  placeholder="Provide feedback to the student..."
                  rows={4}
                  value={remarksInput}
                  onChange={(e) => setRemarksInput(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="order-2 sm:order-1 flex-1 py-4 text-sm font-bold text-slate-500 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveGrade}
                className="order-1 sm:order-2 flex-1 py-4 text-sm font-bold text-white bg-indigo-600 rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
              >
                Save Grade
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="space-y-6">
        {/* Section Header with Stats */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <HiOutlineSpeakerphone className="text-indigo-600" />
            Course Stream
          </h2>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md">
            {announcements.length} Updates
          </span>
        </div>

        {/* Announcement Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {announcements.length > 0 ? (
            announcements.map((ann) => (
              <div
                key={ann.id}
                className="relative group bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-300"
              >
                {/* Action: Delete (Only visible on hover/focus) */}
                <div className="absolute top-4 right-4 z-10">
                  <button
                    onClick={() => handleDeleteClick(ann.id)}
                    className="p-2.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="Delete Update"
                  >
                    <HiOutlineTrash size={18} />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Meta Info */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                        ann.type === "tutorial"
                          ? "bg-amber-50 text-amber-600"
                          : "bg-indigo-50 text-indigo-600"
                      }`}
                    >
                      {ann.type}
                    </span>
                  </div>

                  {/* Content Header */}
                  <div>
                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        {/* Title - Left Side */}
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug pr-4">
                          {ann.title}
                        </h3>

                        {/* Date - Right Side */}
                        <span className="text-[11px] font-semibold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg shrink-0 w-fit self-end sm:self-auto">
                          {new Date(ann.created_at).toLocaleDateString(
                            undefined,
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </div>

                      {/* Content Section */}
                      <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
                        {ann.content}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            /* Empty State Illustration Placeholder */
            <div className="col-span-full flex flex-col items-center justify-center py-16 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200">
              <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                <HiOutlineSpeakerphone size={32} className="text-slate-300" />
              </div>
              <h3 className="text-slate-900 font-bold">No updates yet</h3>
              <p className="text-slate-400 text-sm mt-1 text-center max-w-xs px-6">
                Announcements and tutorials posted for this course will appear
                here.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* POST MODAL */}
      {isAnnounceModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 md:p-8 space-y-6">
            <h2 className="text-xl font-bold text-slate-900">
              Post New Update
            </h2>
            <div className="space-y-4">
              <input
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 ring-indigo-500"
                placeholder="Title"
                value={announceTitle}
                onChange={(e) => setAnnounceTitle(e.target.value)}
              />
              <select
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 ring-indigo-500 text-sm"
                value={announceType}
                onChange={(e) =>
                  setAnnounceType(e.target.value as "notice" | "tutorial")
                }
              >
                <option value="notice">General Notice</option>
                <option value="tutorial">Tutorial/Material</option>
              </select>
              <textarea
                rows={4}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 ring-indigo-500 text-sm resize-none"
                placeholder="Description..."
                value={announceContent}
                onChange={(e) => setAnnounceContent(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsAnnounceModalOpen(false)}
                className="flex-1 py-3 text-sm font-bold text-slate-500 bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handlePostAnnouncement}
                className="flex-1 py-3 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700"
              >
                Post Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Announcement"
        message="Are you sure you want to remove this update? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setAnnouncementToDelete(null);
        }}
        confirmText="Delete Now"
        type="danger"
      />
    </div>
  );
};

export default TeacherGrade;
