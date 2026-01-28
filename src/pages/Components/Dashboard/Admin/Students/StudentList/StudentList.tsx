import React, { useEffect, useState } from "react";
import api from "../../../../../../api/axiosInstance";
import {
  HiOutlineMail,
  HiOutlineUserCircle,
  HiOutlineCalendar,
} from "react-icons/hi";
import { toast } from "react-hot-toast";
import axios from "axios";

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

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/admin/students"); 

      toast.success(`${response.data.length} students loaded`);
      setStudents(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(
          `Error: ${error.response.data.message || "Unable to fetch students"}`,
        );
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  if (loading)
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-gray-100 rounded-xl" />
        ))}
      </div>
    );

  return (
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
  );
};

export default StudentList;
