import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  HiOutlineUserAdd,
  HiOutlineUsers,
  HiOutlineChartBar,
  HiOutlineDocumentText,
} from "react-icons/hi";

const Admin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Updated logic: Highlights 'overview' if the path is exactly /admin or contains 'overview'
  const isActive = (path: string) => {
    if (path === "overview") {
      return (
        location.pathname.endsWith("/admin") ||
        location.pathname.endsWith("/admin/") ||
        location.pathname.includes("overview")
      );
    }
    return location.pathname.includes(path);
  };

  const getTabStyle = (path: string) => `
    flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all border-b-2 -mb-[1px]
    ${
      isActive(path)
        ? "border-slate-800 text-indigo-600 bg-indigo-50/50 font-semibold"
        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
    }
  `;

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* 1. Top Navigation Tabs */}
      <div className="flex items-center border-b border-gray-200 px-4 bg-white">
        {/* Default Overview Tab */}
        <button
          onClick={() => navigate("")}
          className={`${getTabStyle("overview")} hover:cursor-pointer`}
        >
          <HiOutlineChartBar className="text-xl" />
          Overview
        </button>

        <button
          onClick={() => navigate("adduser")}
          className={`${getTabStyle("adduser")} hover:cursor-pointer`}
        >
          <HiOutlineUserAdd className="text-xl" />
          Add New User
        </button>
        <button
          onClick={() => navigate("viewuser")}
          className={`${getTabStyle("viewuser")} hover:cursor-pointer`}
        >
          <HiOutlineUsers className="text-xl" />
          View All Users
        </button>
        <button
          onClick={() => navigate("addcourse")}
          className={`${getTabStyle("addcourse")} hover:cursor-pointer`}
        >
          <HiOutlineDocumentText className="text-xl" />
          Add New Course
        </button>
        <button
          onClick={() => navigate("courses")}
          className={`${getTabStyle("courses")} hover:cursor-pointer`}
        >
          <HiOutlineDocumentText className="text-xl" />
          View All Courses
        </button>
      </div>

      {/* 2. Bottom Content Area */}
      <div className="p-6 bg-gray-50/30">
        <Outlet />
      </div>
    </div>
  );
};

export default Admin;
