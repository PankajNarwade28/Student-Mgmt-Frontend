import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import {  
  HiOutlinePencilAlt,   
  HiOutlineBookOpen,
  HiOutlineCheckCircle, 
  HiOutlineUserCircle,
} from "react-icons/hi";
import api from "../../../../../../api/axiosInstance";

interface CourseRef { id: number; name: string; code: string; }
interface EnrolledStudent {
  enrollment_id: number;
  student_id: string;
  student_name: string;
  grade_value: string | number | null;
  remarks: string | null;
}

const Grades: React.FC = () => {
  const [courses, setCourses] = useState<CourseRef[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [students, setStudents] = useState<EnrolledStudent[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal & Input State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<EnrolledStudent | null>(null);
  const [gradeInput, setGradeInput] = useState("");
  const [remarksInput, setRemarksInput] = useState("");

  // 1. Fetch all courses for the dropdown
  const fetchCourses = useCallback(async () => {
    try {
      const { data } = await api.get("/api/admin/courses/enrollments/data");
      // Assuming 'courses' contains the list of available courses
      setCourses(data.courses || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load courses");
    }
  }, []);

  // 2. Fetch students when course changes
  const fetchStudents = useCallback(async (courseId: string) => {
    if (!courseId) return;
    try {
      setLoading(true);
      const { data } = await api.get(`/api/teacher/courses/${courseId}/students`);
      setStudents(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  useEffect(() => {
    if (selectedCourseId) fetchStudents(selectedCourseId);
    else setStudents([]);
  }, [selectedCourseId, fetchStudents]);

  const handleOpenModal = (student: EnrolledStudent) => {
    setSelectedStudent(student);
    setGradeInput(student.grade_value?.toString() || "");
    setRemarksInput(student.remarks || "");
    setIsModalOpen(true);
  };

  const handleSaveGrade = async () => {
    if (!selectedStudent) return;
    try {
      await api.post(`/api/teacher/grades`, {
        enrollmentId: selectedStudent.enrollment_id,
        grade: Number.parseFloat(gradeInput),
        remarks: remarksInput
      });
      toast.success("Grade updated successfully");
      setIsModalOpen(false);
      fetchStudents(selectedCourseId);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save grade");
    }
  };

  if(loading) {
    return (
      <div className="p-4 md:p-6 mx-auto">
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-medium">Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 mx-auto space-y-8 animate-in fade-in duration-500">
  {/* 1. HEADER & CONTROLS */}
  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
    <div className="space-y-1">
      <nav className="text-[10px] font-black text-[#00796b] uppercase tracking-[0.2em] mb-2">
        Performance Analytics
      </nav>
      <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3 tracking-tight">
        <HiOutlineCheckCircle className="text-[#00796b]" /> Grade Management
      </h1>
      <p className="text-sm text-slate-400 font-medium">Review and modify student performance evaluations.</p>
    </div>

    <div className="relative group w-full md:w-80">
      <HiOutlineBookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00796b] transition-colors" />
      <select
        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-4 ring-teal-500/5 focus:border-[#00796b] text-xs font-bold text-slate-700 appearance-none shadow-sm transition-all"
        value={selectedCourseId}
        onChange={(e) => setSelectedCourseId(e.target.value)}
      >
        <option value="">Select Course Gateway...</option>
        {courses.map((c) => (
          <option key={c.id} value={c.id}>{`${c.code} - ${c.name}`}</option>
        ))}
      </select>
    </div>
  </div>

  {/* 2. MAIN CONTENT AREA */}
  {!selectedCourseId ? (
    <div className="text-center py-24 bg-white rounded-[3rem] border-4 border-dashed border-slate-50">
      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <HiOutlineCheckCircle className="text-slate-300 text-2xl" />
      </div>
      <p className="text-slate-400 font-black text-xs uppercase tracking-[0.2em]">Select a course to start performance grading</p>
    </div>
  ) : (
    <div className="bg-white rounded-[2.5rem] border border-slate-50 shadow-xl shadow-teal-900/5 overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-50">
            <th className="px-8 py-5">Enrolled Student</th>
            <th className="px-8 py-5 text-center">Performance Grade</th>
            <th className="px-8 py-5 hidden md:table-cell">Evaluation Remarks</th>
            <th className="px-8 py-5 text-right">Action</th>
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
                <span className={`inline-flex items-center px-4 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                  student.grade_value ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border border-slate-100"
                }`}>
                  {student.grade_value || "Pending"}
                </span>
              </td>
              <td className="px-8 py-5 hidden md:table-cell text-xs text-slate-400 font-medium italic">
                {student.remarks || "No supplementary remarks."}
              </td>
              <td className="px-8 py-5 text-right">
                <button
                  onClick={() => handleOpenModal(student)}
                  className="p-2.5 bg-white border border-slate-100 text-teal-600 rounded-xl hover:bg-teal-600 hover:text-white transition-all shadow-sm active:scale-95"
                >
                  <HiOutlinePencilAlt size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}

  {/* Performance Entry Modal */}
  {isModalOpen && (
    <div className="fixed inset-0 bg-[#004d40]/30 backdrop-blur-md z-[150] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 space-y-8 animate-in zoom-in duration-200">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight text-center">Modify Performance Grade</h2>
        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-black text-[#00796b] uppercase tracking-widest ml-1">Numeric Evaluation</label>
            <input
              type="number"
              step="0.01"
              className="w-full px-6 py-5 bg-teal-50 border-2 border-transparent rounded-[1.5rem] outline-none focus:border-[#00796b] text-center text-3xl font-black text-teal-700 transition-all mt-2"
              value={gradeInput}
              onChange={(e) => setGradeInput(e.target.value)}
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-[#00796b] uppercase tracking-widest ml-1">Evaluation Remarks</label>
            <textarea
              className="w-full px-5 py-4 bg-gray-50 border border-slate-100 rounded-2xl outline-none focus:border-[#00796b] text-sm font-medium mt-2 resize-none"
              rows={4}
              value={remarksInput}
              onChange={(e) => setRemarksInput(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-xs font-black text-gray-400 uppercase tracking-widest hover:bg-gray-50 rounded-2xl transition-all">Discard</button>
          <button onClick={handleSaveGrade} className="flex-1 py-4 text-xs font-black text-white bg-[#00796b] rounded-2xl shadow-xl shadow-teal-100 uppercase tracking-widest hover:bg-[#004d40] transition-all">Update Grade</button>
        </div>
      </div>
    </div>
  )}
</div>
  );
};

export default Grades;