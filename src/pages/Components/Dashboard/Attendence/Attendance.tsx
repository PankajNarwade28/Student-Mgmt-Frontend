import React, { useState } from "react"; 
import TeacherAttendance from "./Teacher/TeacherAttendance";
import StudentAttendance from "./Student/StudentAttendance";
import AdminAttendance from "../Admin/Attendance/Attendance";
const Attendance: React.FC = () => {
  const [role] = useState<string>(() => localStorage.getItem("userRole") || "");

  const renderHeader = () => {
    const titles = {
      Admin: { main: "System Registry", sub: "Global attendance oversight." },
      Teacher: { main: "Class Manager", sub: "Mark and review student presence." },
      Student: { main: "Academic Presence", sub: "Track your lecture participation." },
    };
    const current = titles[role as keyof typeof titles] || titles.Student;

    return (
      <header className="mb-8">
        <nav className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-2">
          Academic Management
        </nav>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">{current.main}</h1>
        <p className="text-sm text-slate-400 font-medium">{current.sub}</p>
      </header>
    );
  };

  return (
    <div className="p-8 bg-[#fdfdfd] min-h-screen max-w-7xl mx-auto">
      {renderHeader()}
      {role === "Admin" && <AdminAttendance />}
      {role === "Teacher" && <TeacherAttendance />}
      {role === "Student" && <StudentAttendance />}
    </div>
  );
};

export default Attendance;