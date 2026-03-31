import React, { useState, useEffect } from 'react';
import { BookOpen, History, Save, Loader2 } from 'lucide-react';
import api from '../../../../../api/axiosInstance'; // Your centralized API client [cite: 63]
import { toast } from 'react-hot-toast'; // Consistent error feedback [cite: 67]

// Interface based on your PostgreSQL schema
interface Course {
  id: number;
  name: string;
  code: string;
  base_amount?: number; 
}

const Fees: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // 1. Fetch Logic: Using the pattern from your instructor fetch example
  useEffect(() => {
    const fetchCoursesData = async () => {
      try {
        setLoading(true);
        // Using your courseController.ts getAllCourses logic
        const response = await api.get("/api/admin/courses");
        setCourses(response.data);
      } catch (error) {
        toast.error("Failed to load course list for fee assignment.");  
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoursesData();
  }, []);

  useEffect(() => {
  const fetchFeesData = async () => {
    try {
      setLoading(true); // [cite: 81]
      // Points to the new joined-data endpoint
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
    // 1. API Call to update the raw SQL database [cite: 39, 40]
    const response = await api.post('/api/admin/fees/update', { courseId, amount });

    if (response.status === 200) {
      toast.success("Fee updated successfully!");

      // 2. IMMEDIATE UI REFLECTION: Update local state
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.id === courseId 
            ? { ...course, base_amount: amount } 
            : course
        )
      );

      // 3. Clear the form for the next entry 
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
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Fee Administration</h1>
          <p className="text-gray-600">Assign and modify student fees for all active courses.</p>
        </header>

        {/* SECTION 1: Update Fee Form */}
        <section className="mb-10">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
              <BookOpen className="mr-2 w-5 h-5 text-indigo-600" />
              Update Course Pricing
            </h2>
            
            <form onSubmit={handleUpdateFee} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="block text-sm font-medium text-gray-700 mb-1">Target Course</div>
                <select 
                  name="courseId"
                  required
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition bg-white"
                >
                  <option value="">-- Select Course --</option>
                  {/* Mapping fetched courses to dropdown */}
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name} ({course.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="block text-sm font-medium text-gray-700 mb-1">New Fee Amount (INR)</div>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
                  <input 
                    name="amount"
                    type="number" 
                    required
                    className="w-full pl-8 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition" 
                    placeholder="Enter amount"
                  />
                </div>
              </div>

              <div className="flex items-end">
                <button 
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition-all flex items-center justify-center shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* SECTION 2: Global Fee Registry Table */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-800 flex items-center">
              <History className="mr-2 w-5 h-5 text-gray-500" />
              Current Fee Structure
            </h2>
          </div>
          
          <div className="overflow-x-auto"> 
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-100 text-gray-500 text-xs uppercase tracking-wider font-bold">
                  <th className="px-6 py-4">Course Code</th>
                  <th className="px-6 py-4">Course Name</th>
                  <th className="px-6 py-4">Current Fee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                   <tr>
                    <td colSpan={3} className="px-6 py-10 text-center text-gray-400">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                      Fetching fee data...
                    </td>
                  </tr>
                ) : courses.length === 0 ? (
                  <tr><td colSpan={3} className="px-6 py-10 text-center text-gray-400">No active courses found.</td></tr>
                ) : (
                  courses.map((course) => (
                    <tr key={course.id} className="hover:bg-indigo-50/30 transition-colors">
                      <td className="px-6 py-4 font-mono text-sm text-indigo-600">{course.code}</td>
                      <td className="px-6 py-4 font-medium text-gray-800">{course.name}</td>
                      <td className="px-6 py-4 text-gray-700 font-semibold">
                        {course.base_amount ? `₹${course.base_amount}` : <span className="text-gray-300 italic text-xs">Not Set</span>}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Fees;