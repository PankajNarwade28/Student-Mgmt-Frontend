import React, { useState, useEffect } from 'react';
import { HiOutlineLockClosed, HiOutlineCreditCard, HiOutlineCheckCircle } from "react-icons/hi";
import api from '../../../../api/axiosInstance';
import { toast } from 'react-hot-toast';

interface EnrolledCourse {
  enrollment_id: number;
  course_name: string;
  course_code: string;
  fee_amount: number;
  payment_status: 'Paid' | 'Pending';
}

const MyCourses: React.FC = () => {
  const [myCourses, setMyCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyData = async () => {
      try {
        // This endpoint should join enrollments, courses, and fees
        const response = await api.get("/api/student/my-enrollments");
        setMyCourses(response.data);
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
        toast.error("Failed to load your courses");
      } finally {
        setLoading(false);
      }
    };
    fetchMyData();
  }, []);

  if(loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Enrolled Subjects</h1>
      
      <div className="grid gap-4">
        {myCourses.map((item) => (
          <div key={item.enrollment_id} className="bg-white border rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-lg text-gray-800">{item.course_name}</h3>
              <p className="text-sm text-gray-500 font-mono">{item.course_code}</p>
            </div>

            <div className="flex items-center gap-6">
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400">Fee Status</p>
                <div className={`flex items-center gap-1 font-bold ${item.payment_status === 'Paid' ? 'text-green-600' : 'text-amber-600'}`}>
                  {item.payment_status === 'Paid' ? <HiOutlineCheckCircle /> : <HiOutlineCreditCard />}
                  {item.payment_status}
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-2">
                {item.payment_status === 'Paid' ? (
                  <button 
                    disabled 
                    className="flex items-center gap-2 bg-gray-100 text-gray-400 px-4 py-2 rounded-lg cursor-not-allowed text-sm"
                    title="Course is locked because fee is paid"
                  >
                    <HiOutlineLockClosed /> Locked
                  </button>
                ) : (
                  <>
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700">
                      Pay Fee (₹{item.fee_amount})
                    </button>
                    <button className="border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-50">
                      Change Subject
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCourses;