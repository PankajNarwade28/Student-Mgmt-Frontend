import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  HiOutlineArrowLeft,
  HiOutlinePencilAlt,
  HiOutlinePlus,
  HiOutlineUserCircle,
} from "react-icons/hi";
import api from "../../../api/axiosInstance";

interface EnrolledStudent {
  enrollment_id: number;
  student_id: string;
  student_name: string;
  grade_value: string | null;
  remarks: string | null;
}

const TeacherGrade: React.FC = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState<EnrolledStudent[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] =
    useState<EnrolledStudent | null>(null);
  const [gradeInput, setGradeInput] = useState("");
  const [remarksInput, setRemarksInput] = useState("");

  // FIX: Remove 'loading' from the dependency array to stop the loop
  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/api/teacher/courses/${courseId}/students`,
      );
      setStudents(response.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load students for this course.");
    } finally { 
        setLoading(false); // Just set it to false without checking its current state

    }
  }, [courseId]); // Dependency only on courseId

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleOpenModal = (student: EnrolledStudent) => {
    setSelectedStudent(student);
    setGradeInput(student.grade_value || "");
    // FIX: Ensure existing remarks are loaded into the state when opening the modal
    setRemarksInput(student.remarks || "");
    setIsModalOpen(true);
  };

  if (loading)
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-gray-100 rounded-xl" />
        ))}
      </div>
    );
  const handleSaveGrade = async () => {
    // Validation: prevent saving if no student is selected
    if (!selectedStudent) return;

    try {
      await api.post(`/api/teacher/grades`, {
        enrollmentId: selectedStudent.enrollment_id,
        grade: parseFloat(gradeInput),
        remarks: remarksInput,
      });

      toast.success("Grade and remarks saved");
      setIsModalOpen(false);
      // Reset inputs
      setGradeInput("");
      setRemarksInput("");
      fetchStudents();
    } catch (err) {
      console.error(err);
      toast.error("Error saving data");
    }
  };
  return ( 
    <div className="p-3 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-4 md:y-6">
      {/* Back Button - Increased touch target for mobile */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors py-2"
      >
        <HiOutlineArrowLeft /> <span className="text-sm md:text-base">Back to Courses</span>
      </button>

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
                <tr key={student.student_id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-full text-slate-400">
                      <HiOutlineUserCircle size={20} />
                    </div>
                    <span className="font-bold text-slate-700">{student.student_name}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {student.grade_value ? (
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold">
                        {student.grade_value}
                      </span>
                    ) : (
                      <span className="text-slate-300 italic text-xs">Not Graded</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleOpenModal(student)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all"
                    >
                      {student.grade_value ? <><HiOutlinePencilAlt /> Edit</> : <><HiOutlinePlus /> Add Grade</>}
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
            <div key={student.student_id} className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 bg-slate-50 rounded-full text-slate-400 shrink-0">
                  <HiOutlineUserCircle size={24} />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-800 truncate">{student.student_name}</p>
                  <p className="text-[10px] font-bold uppercase tracking-tighter">
                    {student.grade_value ? (
                      <span className="text-emerald-500">Grade: {student.grade_value}</span>
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
                {student.grade_value ? <HiOutlinePencilAlt size={18} /> : <HiOutlinePlus size={18} />}
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
                Grading: <span className="font-bold text-indigo-600">{selectedStudent?.student_name}</span>
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Grade (Numeric)
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 ring-indigo-500/10 text-center text-2xl font-black text-indigo-600"
                  placeholder="0.00"
                  value={gradeInput}
                  onChange={(e) => setGradeInput(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Teacher Remarks
                </label>
                <textarea
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
    </div>

  );

};

export default TeacherGrade;
