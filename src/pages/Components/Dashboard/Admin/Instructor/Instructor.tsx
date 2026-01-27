import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { 
  HiOutlineAcademicCap, 
  HiOutlineMail, 
  HiOutlineBookOpen,
  HiOutlineUserCircle,
  HiOutlineIdentification
} from "react-icons/hi";
import api from "../../../../../api/axiosInstance";

interface InstructorCourse {
  id: number;
  name: string;
  code: string;
}

interface Instructor {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  bio?: string;
  course_count: number;
  courses: InstructorCourse[] | null;
}

const Instructor: React.FC = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        setLoading(true);
        // Ensure you have a route /api/instructors pointing to the new repo function
        const response = await api.get("/api/courses/instructors");
        setInstructors(response.data);
      } catch (error) {
        toast.error("Failed to load instructor profiles.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  if (loading) {
    return (
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-64 bg-slate-50 animate-pulse rounded-3xl border border-slate-100" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-3">
          <HiOutlineAcademicCap className="text-indigo-600" />
          Academic Faculty
        </h1>
        <p className="text-slate-500">Browse our experienced instructors and their curriculum</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {instructors.map((teacher) => (
          <div key={teacher.user_id} className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col">
            <div className="p-6 space-y-4 flex-grow">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
                  <HiOutlineUserCircle size={40} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{teacher.full_name}</h2>
                  <p className="text-sm text-indigo-600 font-medium flex items-center gap-1">
                    <HiOutlineIdentification /> Faculty Member
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-500">
                <HiOutlineMail className="shrink-0" />
                <span className="truncate">{teacher.email}</span>
              </div>

              <div className="pt-4 border-t border-slate-50">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <HiOutlineBookOpen /> Assigned Courses ({teacher.course_count})
                </h3>
                
                <div className="flex flex-wrap gap-2">
                  {teacher.courses && teacher.courses.length > 0 ? (
                    teacher.courses.map((course) => (
                      <span 
                        key={course.id} 
                        className="bg-slate-50 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-lg border border-slate-100"
                        title={course.name}
                      >
                        {course.code}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">No courses currently assigned.</span>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              <button className="w-full py-3 bg-slate-900 text-white text-sm font-bold rounded-2xl hover:bg-indigo-600 transition-colors">
                View Faculty Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Instructor;