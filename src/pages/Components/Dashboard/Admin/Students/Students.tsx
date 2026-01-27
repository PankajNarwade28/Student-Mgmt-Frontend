import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  HiOutlineUsers,
  HiOutlineAcademicCap,
  HiOutlineClipboardCheck,
} from "react-icons/hi";

const Students: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Updated logic: Highlights 'overview' if path is exactly /students or /students/overview
  const isActive = (path: string) => {
    // If we are checking for the "list" tab
    if (path === "list") {
      return (
        location.pathname.endsWith("/students") ||
        location.pathname.endsWith("/students/") ||
        location.pathname.includes("/list")
      );
    }
    // For other tabs (enroll, grades)
    return location.pathname.includes(path);
  };

  const getTabStyle = (path: string) => `
    flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all border-b-2 -mb-[1px]
    ${
      isActive(path)
        ? "border-indigo-600 text-indigo-600 bg-indigo-50/50 font-semibold"
        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
    }
  `;

  const tabs = [ 
    { id: "list", label: "Students", icon: <HiOutlineUsers /> },
    { id: "enroll", label: "Enroll", icon: <HiOutlineClipboardCheck /> },
    { id: "grades", label: "Grades", icon: <HiOutlineAcademicCap /> },
  ];

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* 1. Top Navigation Tabs */}
      <div className="border-b border-gray-200 bg-white">
        <div className="flex flex-col min-[786px]:flex-row min-[786px]:items-center px-2 min-[786px]:px-4">
          <div className="grid grid-cols-2 gap-2 w-full py-3 min-[786px]:flex min-[786px]:flex-row min-[786px]:overflow-x-auto min-[786px]:gap-1 min-[786px]:py-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => navigate(tab.id === "list" ? "" : tab.id)}
                className={`${getTabStyle(tab.id)} 
      flex items-center justify-center min-[786px]:justify-start transition-all whitespace-nowrap
      rounded-lg min-[786px]:rounded-none
      gap-2 px-3 py-3 text-xs min-[1181px]:text-sm shrink-0 hover:cursor-pointer`}
              >
                <span className="text-lg shrink-0">{tab.icon}</span>
                <span className="truncate">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Bottom Content Area */}
      <div className="p-6 bg-gray-50/30">
        <Outlet />
      </div>
    </div>
  );
};

export default Students;
