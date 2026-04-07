import React, { useState, useEffect } from 'react';
import { BookOpen, History, Save, Loader2 } from 'lucide-react';
import api from '../../../../../api/axiosInstance'; 
import { toast } from 'react-hot-toast';
import { ChevronDown } from 'lucide-react';

interface Course {
  id: number;
  name: string;
  code: string;
  base_amount?: number; 
}

const FeeStructure: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Fetch Logic: Combined into a single reliable call for the joined data
  useEffect(() => {
    const fetchFeesData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/admin/courses-with-fees");
        setCourses(response.data);
      } catch (error) {
        toast.error("Failed to load global fee structure.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeesData();
  }, []);

  const handleUpdateFee = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const courseId = Number(formData.get('courseId'));
    const amount = Number(formData.get('amount'));

    try {
      setIsSubmitting(true);
      const response = await api.post('/api/admin/fees/update', { courseId, amount });

      if (response.status === 200) {
        toast.success("Fee updated successfully!");

        // Immediate UI Reflection
        setCourses((prevCourses) =>
          prevCourses.map((course) =>
            course.id === courseId 
              ? { ...course, base_amount: amount } 
              : course
          )
        );

        (e.target as HTMLFormElement).reset();
      }
    } catch (error) {
      toast.error("Failed to update fee.");
      console.error("Update error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
   <div className="mx-auto space-y-4  ">
  <header className="mb-4">
    <nav className="text-[10px] font-black text-[#00796b] uppercase tracking-[0.2em] mb-2">
      Financial Management
    </nav>
    <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
      Fee Administration
    </h1>
    <p className="text-sm text-slate-400 font-medium">Assign and modify student fees for all active curriculum modules.</p>
  </header>

  {/* SECTION 1: Update Fee Form */}
  <section className="mb-4">
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-teal-900/5">
      <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-[#00796b]" />
        Update Module Pricing
      </h2>
      
      <form onSubmit={handleUpdateFee} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider ml-1">Target Module</label>
          <div className="relative group">
            <select 
              name="courseId"
              required
              className="w-full p-3.5 pl-4 border-2 border-gray-50 bg-gray-50 rounded-2xl focus:border-[#00796b] focus:bg-white outline-none transition-all appearance-none text-sm font-bold text-slate-700 cursor-pointer"
            >
              <option value="">-- Select Module --</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name} ({course.code})
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-[#00796b]">
               <ChevronDown size={16} />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider ml-1">Fee Amount (INR)</label>
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00796b] font-bold">₹</span>
            <input 
              name="amount"
              type="number" 
              required
              className="w-full pl-9 p-3.5 border-2 border-gray-50 bg-gray-50 rounded-2xl focus:border-[#00796b] focus:bg-white outline-none transition-all text-sm font-bold text-slate-700" 
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="flex items-end">
          <button 
            type="submit"
            disabled={isSubmitting || loading}
            className="w-full bg-[#00796b] hover:bg-[#004d40] text-white font-black uppercase tracking-widest text-[11px] py-4 rounded-2xl transition-all flex items-center justify-center shadow-lg shadow-teal-100 disabled:opacity-50 active:scale-[0.98]"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Commit Changes
          </button>
        </div>
      </form>
    </div>
  </section>

  {/* SECTION 2: Global Fee Registry Table */}
  <section className="bg-white rounded-[2.5rem] border border-slate-50 shadow-xl shadow-teal-900/5 overflow-hidden">
    <div className="p-8 border-b border-slate-50 bg-gray-50/30">
      <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
        <History className="w-4 h-4 text-teal-600" />
        Operational Fee Registry
      </h2>
    </div>
    
    <div className="overflow-x-auto"> 
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-50">
            <th className="px-6 py-4">Index Code</th>
            <th className="px-6 py-4">Module Identity</th>
            <th className="px-6 py-4 text-right">Current Valuation</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {loading ? (
             <tr>
              <td colSpan={3} className="px-8 py-20 text-center">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-[#00796b]" />
                  <span className="text-[10px] font-black text-[#00796b] uppercase tracking-widest">Syncing Registry...</span>
                </div>
              </td>
            </tr>
          ) : courses.length === 0 ? (
            <tr><td colSpan={3} className="px-8 py-16 text-center text-slate-400 font-bold text-xs uppercase tracking-widest">No active records found.</td></tr>
          ) : (
            courses.map((course) => (
              <tr key={course.id} className="hover:bg-teal-50/30 transition-all group">
                <td className="px-6 py-4">
                  <span className="font-mono text-xs font-bold text-[#00796b] bg-teal-50 px-2 py-1 rounded-md border border-teal-100 group-hover:bg-white transition-colors">
                    {course.code}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-slate-700 text-sm tracking-tight">{course.name}</td>
                <td className="px-6 py-4 text-right">
                  <div className="inline-flex items-center px-4 py-1.5 rounded-xl bg-gray-50 border border-slate-100 group-hover:bg-white group-hover:border-teal-200 transition-all">
                    {course.base_amount ? (
                      <span className="text-slate-800 font-black text-sm tracking-tight">₹{course.base_amount.toLocaleString('en-IN')}</span>
                    ) : (
                      <span className="text-slate-300 italic text-[10px] font-black uppercase tracking-tighter">Valuation Pending</span>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </section>
</div>
  );
};

export default FeeStructure;