import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { 
  HiOutlineBookOpen, 
  HiOutlineAcademicCap, 
  HiOutlineClock, 
  HiOutlineUserGroup,
  HiOutlineClipboardList
} from "react-icons/hi";

interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  studentsCount?: number;
  progress?: number;
  instructor?: string;
}

const MyCourses: React.FC = () => {
  // Simulating role-based view for static demonstration
  const [viewAs, setViewAs] = useState<"Student" | "Teacher">("Student");

   useEffect(() => {
  toast.success("This is for demo purposes only. Course data is static. (Demo)");
}, []);
  const studentCourses: Course[] = [
    { 
      id: "1", 
      name: "Web Development (MERN Stack)", 
      code: "CS-401", 
      description: "Comprehensive study of MongoDB, Express, React, and Node.js.", 
      instructor: "Dr. A. K. Sharma",
      progress: 65 
    },
    { 
      id: "2", 
      name: "Angular JS & JQuery", 
      code: "CS-402", 
      description: "Unit IV syllabus covering Directives, Data Binding, and DOM manipulation.", 
      instructor: "Prof. S. Patil",
      progress: 40 
    }
  ];

  const teacherCourses: Course[] = [
    { 
      id: "101", 
      name: "Software Quality Assurance", 
      code: "SQA-202", 
      description: "Focusing on testing methodologies and quality metrics.", 
      studentsCount: 120 
    },
    { 
      id: "102", 
      name: "Data Mining & Business Intelligence", 
      code: "DMBI-303", 
      description: "Power BI dashboards and data warehouse modeling.", 
      studentsCount: 85 
    }
  ];

  const currentCourses = viewAs === "Student" ? studentCourses : teacherCourses;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header & Role Simulation Toggle */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <HiOutlineBookOpen className="text-indigo-600" /> My Academic Courses
          </h1>
          <p className="text-slate-500">Manage your active learning modules and curriculum</p>
        </div>
        
        {/* Toggle used only for static demo to show both views */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button 
            onClick={() => setViewAs("Student")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${viewAs === "Student" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500"}`}
          >
            Student View
          </button>
          <button 
            onClick={() => setViewAs("Teacher")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${viewAs === "Teacher" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500"}`}
          >
            Teacher View
          </button>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentCourses.map((course) => (
          <div key={course.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden">
            <div className="h-3 bg-indigo-600" />
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                  {course.code}
                </span>
                <HiOutlineClipboardList className="text-slate-300 group-hover:text-indigo-600 transition-colors" size={24} />
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {course.name}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-2 mt-1">
                  {course.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-50 space-y-3">
                {viewAs === "Student" ? (
                  <>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <HiOutlineAcademicCap className="text-slate-400" />
                      <span>Instructor: <span className="font-semibold">{course.instructor}</span></span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-slate-400">
                        <span>COURSE COMPLETION</span>
                        <span>{course.progress}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${course.progress}%` }} />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <HiOutlineUserGroup className="text-slate-400" />
                      <span>Enrolled Students: <span className="font-bold text-slate-900">{course.studentsCount}</span></span>
                    </div>
                    <button className="text-[10px] font-bold text-indigo-600 hover:underline">
                      VIEW ROSTER
                    </button>
                  </div>
                )}
              </div>

              <button className="w-full py-3 bg-slate-50 hover:bg-indigo-600 hover:text-white text-slate-600 text-sm font-bold rounded-2xl transition-all flex items-center justify-center gap-2 mt-2">
                <HiOutlineClock size={18} />
                {viewAs === "Student" ? "Continue Learning" : "Manage Curriculum"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCourses;