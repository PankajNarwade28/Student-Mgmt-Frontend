import React, { useEffect, useState } from "react";
import api from "../../../../../../api/axiosInstance";
import {
  HiOutlineMail,
  HiOutlineUserCircle,
  HiOutlineCalendar,
} from "react-icons/hi";
import { toast } from "react-hot-toast"; 

interface Student {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  created_at: string;
}

const StudentList: React.FC = () => {
  // Pass the interface to the Hook: <Student[]>
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = Number.parseInt(import.meta.env.STUDENT_PAGINATION_LIMIT) || 6; // Default to 5 if not set

  const fetchStudents = async () => {
    setLoading(true);
    try {
      // Pass current page to the API
      const response = await api.get(
        `/api/admin/students?page=${currentPage}&limit=${limit}`,
      );

      if (response.data.success) {
        setStudents(response.data.students);
        setTotalPages(response.data.pagination.totalPages);
        toast.success(`Page ${currentPage} loaded`);
      }
    } catch (error) {
      console.error("Fetch Students Error:", error);
      toast.error("Unable to fetch students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [currentPage]); // Re-fetch when page changes

  // const fetchStudents = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await api.get("/api/admin/students");

  //     toast.success(`${response.data.length} students loaded`);
  //     setStudents(response.data);
  //   } catch (error) {
  //     if (axios.isAxiosError(error) && error.response) {
  //       toast.error(
  //         `Error: ${error.response.data.message || "Unable to fetch students"}`,
  //       );
  //     } else {
  //       toast.error("An unexpected error occurred");
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchStudents();
  // }, []);

  if (loading)
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-gray-100 rounded-xl" />
        ))}
      </div>
    );

  return (
    <div>
      {/* Your existing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {students.map((student) => (
          <div
            key={student.id}
            className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4"
          >
            <div className="h-12 w-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
              <HiOutlineUserCircle size={24} />
            </div>
            <div className="flex-grow">
              <h4 className="font-bold text-gray-900">
                {student?.full_name?.trim()
                  ? student.full_name
                  : "Unnamed Student"}
              </h4>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <HiOutlineMail /> {student.email}
                </span>
                <span className="flex items-center gap-1">
                  <HiOutlineCalendar />{" "}
                  {new Date(student.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
            <span
              className={`px-2 py-1 rounded-md text-[10px] font-bold ${student.is_active ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
            >
              {student.is_active ? "ACTIVE" : "INACTIVE"}
            </span>
          </div>
        ))}
      </div>

      {/* NEW: Pagination Controls */}
      <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
        <p className="text-sm text-gray-500">
          Showing page{" "}
          <span className="font-medium text-gray-900">{currentPage}</span> of{" "}
          <span className="font-medium text-gray-900">{totalPages}</span>
        </p>

        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1 || loading}
            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Previous
          </button>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || loading}
            className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-100 transition-all"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentList;
