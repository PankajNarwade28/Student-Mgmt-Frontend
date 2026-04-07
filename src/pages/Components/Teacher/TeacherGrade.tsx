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
  HiOutlineAcademicCap,
} from "react-icons/hi";
import api from "../../../api/axiosInstance";
import { announcementSchema,gradeSchema } from "../../../validations/courseSchema"; 

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
  // Add these to your state declarations
  const [gradeErrors, setGradeErrors] = useState<{
    grade?: string;
    remarks?: string;
  }>({});
  const [announceErrors, setAnnounceErrors] = useState<{
    title?: string;
    content?: string;
    type?: string; // <--- Add this line
  }>({});

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

  const handleSaveGrade = async () => {
    if (!selectedStudent) return;

    // Validate using Zod
    const result = gradeSchema.safeParse({
      grade: gradeInput,
      remarks: remarksInput,
    });

    if (!result.success) {
      const formattedErrors = result.error.flatten().fieldErrors;
      setGradeErrors({
        grade: formattedErrors.grade?.[0],
        remarks: formattedErrors.remarks?.[0],
      });
      return;
    }

    try {
      setGradeErrors({}); // Clear errors on success
      await api.post(`/api/teacher/grades`, {
        enrollmentId: selectedStudent.enrollment_id,
        grade: result.data.grade,
        remarks: result.data.remarks,
      });
      toast.success("Grade saved");
      setIsModalOpen(false);
      fetchStudents();
    } catch (err) {
      console.error("Error saving grade", err);
      toast.error("Error saving data");
    }
  };

  const handlePostAnnouncement = async () => {
  const result = announcementSchema.safeParse({
    title: announceTitle,
    content: announceContent,
    type: announceType,
  });

  if (!result.success) {
    const formattedErrors = result.error.flatten().fieldErrors;
    setAnnounceErrors({
      title: formattedErrors.title?.[0],
      content: formattedErrors.content?.[0],
    });
    return;
  }

  try {
    setAnnounceErrors({});
    await api.post(`/api/teacher/announcements`, {
      courseId,
      ...result.data,
    });
    toast.success("Update posted");
    setIsAnnounceModalOpen(false);
    setAnnounceTitle("");
    setAnnounceContent("");
    fetchAnnouncements();
  } catch (err) {
    console.error("Error posting announcement", err);
    toast.error("Error posting update");
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
    <div className="p-4 md:p-6   mx-auto space-y-10 ">
  {/* 1. COMPACT NAV HEADER & ACTIONS */}
  <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-slate-100">
    <div className="space-y-2">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-[#00796b] transition-all group"
      >
        <HiOutlineArrowLeft className="group-hover:-translate-x-1 transition-transform" /> 
        Back to Course Registry
      </button>
      <h1 className="text-2xl md:text-4xl font-black text-slate-800 flex items-center gap-4 tracking-tighter">
        Faculty Grading Portal
      </h1>
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-black bg-teal-50 text-[#00796b] px-3 py-1 rounded-full border border-teal-100 uppercase tracking-widest">
          Course ID: {courseId}
        </span>
        <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-3 py-1 rounded-full uppercase tracking-widest">
          {students.length} Enrolled Members
        </span>
      </div>
    </div>
    
    <button
      onClick={() => setIsAnnounceModalOpen(true)}
      className="flex items-center justify-center gap-2 px-8 py-4 bg-[#00796b] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#004d40] shadow-xl shadow-teal-100 transition-all active:scale-95"
    >
      <HiOutlinePlusCircle size={18} className="text-teal-300" /> Dispatch Announcement
    </button>
  </div>

  {/* 2. GRADING REGISTRY SECTION */}
  <div className="bg-white rounded-[2.5rem] shadow-xl shadow-teal-900/5 border border-slate-50 overflow-hidden">
    <div className="p-8 border-b border-slate-50 bg-gray-50/30">
      <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
        <HiOutlineAcademicCap className="text-[#00796b]" /> Academic Performance Registry
      </h3>
    </div>

    {/* Desktop Table Registry */}
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-50">
            <th className="px-8 py-5">Student Identity</th>
            <th className="px-8 py-5 text-center">Audit Status</th>
            <th className="px-8 py-5">Faculty Remarks</th>
            <th className="px-8 py-5 text-right">Operational Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {students.map((student) => (
            <tr key={student.student_id} className="hover:bg-teal-50/30 transition-all group">
              <td className="px-8 py-5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-100 rounded-xl text-slate-400 group-hover:bg-white group-hover:text-[#00796b] transition-all shadow-sm">
                    <HiOutlineUserCircle size={22} />
                  </div>
                  <span className="font-bold text-slate-700 tracking-tight">{student.student_name}</span>
                </div>
              </td>
              <td className="px-8 py-5 text-center">
                {student.grade_value ? (
                  <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm">
                    Grade: {student.grade_value}
                  </span>
                ) : (
                  <span className="text-slate-300 text-[10px] font-black uppercase tracking-widest italic">Pending Evaluation</span>
                )}
              </td>
              <td className="px-8 py-5">
                <p className="text-[11px] text-slate-400 italic max-w-xs truncate">
                  {student.remarks ? `"${student.remarks}"` : "---"}
                </p>
              </td>
              <td className="px-8 py-5 text-right">
                <button
                  onClick={() => handleOpenModal(student)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-[#00796b] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#00796b] hover:text-white transition-all shadow-sm active:scale-95"
                >
                  {student.grade_value ? <HiOutlinePencilAlt /> : <HiOutlinePlus />} 
                  {student.grade_value ? "Edit" : "Add Grade"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Mobile Card Registry */}
    <div className="md:hidden divide-y divide-slate-50">
      {students.map((student) => (
        <div key={student.student_id} className="p-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 shrink-0">
              <HiOutlineUserCircle size={24} />
            </div>
            <div className="min-w-0">
              <p className="font-black text-slate-800 truncate text-sm">{student.student_name}</p>
              <span className={`text-[9px] font-black uppercase tracking-widest ${student.grade_value ? "text-emerald-500" : "text-slate-300"}`}>
                {student.grade_value ? `Grade: ${student.grade_value}` : "Ungraded"}
              </span>
            </div>
          </div>
          <button
            onClick={() => handleOpenModal(student)}
            className={`p-3.5 rounded-2xl transition-all shadow-md active:scale-90 ${
              student.grade_value ? "bg-slate-100 text-slate-600" : "bg-[#00796b] text-white"
            }`}
          >
            {student.grade_value ? <HiOutlinePencilAlt size={18} /> : <HiOutlinePlus size={18} />}
          </button>
        </div>
      ))}
    </div>
  </div>

  {/* 3. ANNOUNCEMENT SECTION */}
  <div className="space-y-6">
    <div className="flex items-center gap-4">
       <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] whitespace-nowrap">
          Course Stream Updates
       </h2>
       <div className="h-[1px] w-full bg-slate-100"></div>
       <span className="text-[10px] font-black text-[#00796b] uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
         {announcements.length} Logs
       </span>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {announcements.length > 0 ? (
        announcements.map((ann) => (
          <div key={ann.id} className="relative group bg-white border border-slate-100 rounded-[2rem] p-8 shadow-xl shadow-teal-900/5 hover:shadow-teal-900/10 hover:border-teal-200 transition-all duration-300 overflow-hidden">
            {/* Decorative Watermark */}
            <div className="absolute -bottom-4 -right-4 opacity-[0.02] pointer-events-none group-hover:scale-110 transition-transform">
              <HiOutlineSpeakerphone size={120} />
            </div>

            <button
              onClick={() => handleDeleteClick(ann.id)}
              className="absolute top-6 right-6 p-2.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 shadow-sm bg-white"
            >
              <HiOutlineTrash size={18} />
            </button>

            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm ${
                  ann.type === "tutorial" ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-teal-50 text-[#00796b] border-teal-100"
                }`}>
                  {ann.type}
                </span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-gray-50 px-3 py-1 mr-7 rounded-full">
                  {new Date(ann.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-800 mb-2 leading-tight tracking-tight group-hover:text-[#00796b] transition-colors">
                  {ann.title}
                </h3>
                <p className="text-sm text-slate-500 font-medium line-clamp-3 leading-relaxed italic">
                  "{ann.content}"
                </p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border-4 border-dashed border-gray-50">
          <HiOutlineSpeakerphone size={48} className="text-slate-200 mb-4" />
          <h3 className="text-slate-900 font-black uppercase tracking-widest text-xs">No updates yet</h3>
          <p className="text-slate-400 text-sm mt-2 text-center max-w-xs px-6">
            Registry stream is empty. Announcements and tutorials will appear here once dispatched.
          </p>
        </div>
      )}
    </div>
  </div>

  {/* 4. GRADE MODAL */}
  {isModalOpen && (
    <div className="fixed inset-0 bg-[#004d40]/30 backdrop-blur-md z-[150] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl p-10 space-y-8 animate-in slide-in-from-bottom sm:zoom-in duration-300">
        <div className="text-center">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Modify Evaluation</h2>
          <p className="text-[10px] font-black text-[#00796b] uppercase tracking-widest mt-1">Registry Student: {selectedStudent?.student_name}</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Numeric Performance Grade</label>
            <input
              type="number"
              step="0.01"
              className="w-full px-6 py-5 bg-teal-50 border-2 border-transparent rounded-[1.5rem] outline-none focus:border-[#00796b] text-center text-3xl font-black text-[#00796b] transition-all mt-2 shadow-inner"
              value={gradeInput}
              onChange={(e) => setGradeInput(e.target.value)}
            />
            {gradeErrors.grade && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{gradeErrors.grade}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Faculty Remarks & Feedback</label>
            <textarea
              className="w-full px-5 py-4 bg-gray-50 border border-slate-100 rounded-2xl outline-none focus:border-[#00796b] text-sm font-medium mt-2 resize-none"
              rows={4}
              value={remarksInput}
              onChange={(e) => setRemarksInput(e.target.value)}
            />
            {gradeErrors.remarks && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{gradeErrors.remarks}</p>}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button onClick={() => setIsModalOpen(false)} className="order-2 sm:order-1 flex-1 py-4 text-xs font-black text-gray-400 uppercase tracking-widest hover:bg-gray-50 rounded-2xl transition-all">Discard</button>
          <button onClick={handleSaveGrade} className="order-1 sm:order-2 flex-1 py-4 text-xs font-black text-white bg-[#00796b] rounded-2xl shadow-xl shadow-teal-100 uppercase tracking-widest hover:bg-[#004d40] transition-all">Commit Grade</button>
        </div>
      </div>
    </div>
  )}

  {/* 5. POST ANNOUNCEMENT MODAL */}
  {isAnnounceModalOpen && (
    <div className="fixed inset-0 bg-[#004d40]/30 backdrop-blur-md z-[150] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 space-y-8 animate-in zoom-in duration-300">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight text-center">Post New Update</h2>
        
        <div className="space-y-4">
          <input
            className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-[#00796b] focus:bg-white transition-all font-bold text-slate-700"
            placeholder="Title"
            value={announceTitle}
            onChange={(e) => setAnnounceTitle(e.target.value)}
          />
          {announceErrors.title && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{announceErrors.title}</p>}
          
          <select
            className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-[#00796b] focus:bg-white transition-all font-bold text-slate-700"
            value={announceType}
            onChange={(e) => setAnnounceType(e.target.value as "notice" | "tutorial")}
          >
            <option value="notice">General Notice</option>
            <option value="tutorial">Tutorial/Material</option>
          </select>
          {announceErrors.type && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{announceErrors.type}</p>}
          
          <textarea
            rows={4}
            className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-[#00796b] focus:bg-white transition-all text-sm font-medium resize-none"
            placeholder="Description..."
            value={announceContent}
            onChange={(e) => setAnnounceContent(e.target.value)}
          />
          {announceErrors.content && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{announceErrors.content}</p>}
        </div>

        <div className="flex gap-4">
          <button onClick={() => setIsAnnounceModalOpen(false)} className="flex-1 py-4 text-xs font-black text-gray-400 uppercase tracking-widest hover:bg-gray-50 rounded-2xl">Cancel</button>
          <button onClick={handlePostAnnouncement} className="flex-1 py-4 text-xs font-black text-white bg-[#00796b] rounded-2xl shadow-xl shadow-teal-100 uppercase tracking-widest">Dispatch Now</button>
        </div>
      </div>
    </div>
  )}

  {/* 6. DELETE MODAL */}
  <ConfirmationModal
    isOpen={isDeleteModalOpen}
    title="Revoke Update"
    message="Are you sure you want to remove this update? This operational data will be purged and students will lose access immediately."
    onConfirm={handleDeleteConfirm}
    onCancel={() => {
      setIsDeleteModalOpen(false);
      setAnnouncementToDelete(null);
    }}
    confirmText="Purge Log"
    type="danger"
  />
</div>
  );
};

export default TeacherGrade;
