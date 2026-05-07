import React, { useState, useEffect } from 'react';
import { Save, Loader2, CheckCircle2, XCircle, ClipboardList } from 'lucide-react';
import api from '../../../../../api/axiosInstance'; 
import { toast } from 'react-hot-toast';

interface Student {
  id: string;
  name: string;
  enrollment_no: string;
}

const TeacherAttendance: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent'>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [topic, setTopic] = useState<string>("");

  useEffect(() => {
    const fetchClass = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/attendance/teacher/my-students");
        setStudents(response.data);
        const initialStatus: Record<string, 'present' | 'absent'> = {};
        response.data.forEach((s: Student) => initialStatus[s.id] = 'present');
        setAttendance(initialStatus);
      } catch (error) {

        toast.error("Failed to load student list." + (error instanceof Error ? error.message : ""));
      } finally {
        setLoading(false);
      }
    };
    fetchClass();
  }, []);

  const toggleStatus = (id: string) => {
    setAttendance(prev => ({
      ...prev,
      [id]: prev[id] === 'present' ? 'absent' : 'present'
    }));
  };

  const handleSubmit = async () => {
    if (!topic) return toast.error("Please enter the topic covered.");
    try {
      setIsSubmitting(true);
      await api.post('/api/attendance/teacher/submit', { topic, records: attendance });
      toast.success("Attendance submitted successfully!");
    } catch (error) {
      toast.error("Submission failed." + (error instanceof Error ? error.message : ""));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-indigo-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-indigo-600" /> Session Details
        </h2>
        <input 
          className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700"
          placeholder="Enter Topic Covered Today..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-50 shadow-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <tr>
              <th className="px-8 py-4">Student Name</th>
              <th className="px-8 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-slate-50/50">
                <td className="px-8 py-4">
                  <p className="font-bold text-slate-700">{student.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{student.enrollment_no}</p>
                </td>
                <td className="px-8 py-4 flex justify-center">
                  <button 
                    onClick={() => toggleStatus(student.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all ${
                      attendance[student.id] === 'present' 
                      ? 'bg-emerald-50 text-emerald-600' 
                      : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {attendance[student.id] === 'present' ? <CheckCircle2 size={14}/> : <XCircle size={14}/>}
                    {attendance[student.id].toUpperCase()}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-6 bg-slate-50/50 flex justify-end">
          <button onClick={handleSubmit} disabled={isSubmitting} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-2 shadow-lg">
            {isSubmitting ? <Loader2 className="animate-spin w-4 h-4" /> : <Save size={16} />}
            Finalize Attendance
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherAttendance;