import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import { 
  HiOutlineUserCircle, 
  HiOutlinePencilAlt,   
  HiOutlineBookOpen,
  HiOutlineCheckCircle
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
  const [, setLoading] = useState(false);

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
        grade: parseFloat(gradeInput),
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

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <HiOutlineCheckCircle className="text-indigo-600" /> Grade Management
          </h1>
          <p className="text-sm text-slate-500">Select a course to view and modify student performance.</p>
        </div>

        {/* Course Selector */}
        <div className="relative w-full md:w-80">
          <HiOutlineBookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <select
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 ring-indigo-500/20 font-medium text-slate-700 appearance-none shadow-sm"
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
          >
            <option value="">Select a Course...</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>{course.code} - {course.name}</option>
            ))}
          </select>
        </div>
      </div>

      {!selectedCourseId ? (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-medium">Please select a course to begin grading.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Responsive Table/Card View */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Grade</th>
                  <th className="px-6 py-4 hidden md:table-cell">Remarks</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {students.map((student) => (
                  <tr key={student.student_id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-full text-slate-400 hidden sm:block">
                          <HiOutlineUserCircle size={20} />
                        </div>
                        <span className="font-bold text-slate-700">{student.student_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        student.grade_value ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
                      }`}>
                        {student.grade_value || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <p className="text-xs text-slate-500 truncate max-w-[200px]">
                        {student.remarks || "No remarks provided."}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleOpenModal(student)}
                        className="p-2 md:px-4 md:py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all inline-flex items-center gap-2"
                      >
                        <HiOutlinePencilAlt size={16} /> <span className="hidden sm:inline">Modify</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Grade Entry Modal (Responsive) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl p-6 md:p-8 space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Modify Grade</h2>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Numeric Grade</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 ring-indigo-500/10 text-center text-xl font-black text-indigo-600"
                  value={gradeInput}
                  onChange={(e) => setGradeInput(e.target.value)}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Remarks</label>
                <textarea
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 ring-indigo-500/10 text-sm"
                  rows={4}
                  value={remarksInput}
                  onChange={(e) => setRemarksInput(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-sm font-bold text-slate-500 bg-slate-100 rounded-2xl">Cancel</button>
              <button onClick={handleSaveGrade} className="flex-1 py-3 text-sm font-bold text-white bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200">Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Grades;