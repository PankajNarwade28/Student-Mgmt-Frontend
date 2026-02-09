import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { canAccess, ROLES } from "../../Components/Utils/rbac";
import ConfirmationModal from "../../Components/Modal/confirmationModal";
import {
  HiOutlineClipboardList,
  HiOutlineHome,
  HiOutlineLibrary,
} from "react-icons/hi";
import { FaUserGraduate } from "react-icons/fa";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");
  const isAuthenticated = !!token;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth/login");
  };

  // Helper for shared NavLink styles
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mb-1 no-underline ${
      isActive 
        ? "bg-slate-100 text-indigo-600 font-medium" 
        : "text-slate-500 hover:bg-slate-100 hover:text-indigo-600"
    }`;

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-[100] flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 text-indigo-600">
        <NavLink to="/" className="flex items-center gap-2.5 text-lg font-bold">
          <LayoutDashboard size={24} />
          <span>ERP System</span>
        </NavLink>

        <button 
          className="cursor-pointer bg-none border-none lg:hidden" 
          onClick={toggleSidebar}
        >
          <X size={24} />
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3">
        <NavLink to="/dashboard" className={navLinkClass} onClick={toggleSidebar}>
          <HiOutlineHome size={20} /> Dashboard
        </NavLink>

        {/* ADMIN ONLY */}
        {canAccess(userRole, [ROLES.ADMIN]) && (
          <>
            <NavLink to="/dashboard/users" className={navLinkClass} onClick={toggleSidebar}>
              <Users size={20} /> Users
            </NavLink>
            <NavLink to="/dashboard/admin/students" className={navLinkClass} onClick={toggleSidebar}>
              <FaUserGraduate size={20} /> Students
            </NavLink>
          </>
        )}

        {/* ADMIN & TEACHER */}
        {canAccess(userRole, [ROLES.ADMIN]) && (
          <NavLink to="/dashboard/reports" className={navLinkClass} onClick={toggleSidebar}>
            <BarChart3 size={20} /> Reports
          </NavLink>
        )}

        {/* TEACHER & STUDENT */}
        {canAccess(userRole, [ROLES.TEACHER, ROLES.STUDENT]) && (
          <>
            <NavLink to="/dashboard/mycourses" className={navLinkClass} onClick={toggleSidebar}>
              <HiOutlineLibrary size={20} /> My Courses
            </NavLink>
            <NavLink to="/dashboard/schedule" className={navLinkClass} onClick={toggleSidebar}>
              <HiOutlineClipboardList size={20} /> Schedule
            </NavLink>
          </>
        )}

        <NavLink to="/dashboard/settings" className={navLinkClass} onClick={toggleSidebar}>
          <Settings size={20} /> Settings
        </NavLink>
      </nav>

      {/* Footer / Logout */}
      {isAuthenticated && (
        <div className="p-4">
          <button
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 p-3 text-white transition-colors hover:bg-red-700 cursor-pointer"
            onClick={() => setIsLogoutModalOpen(true)}
          >
            Logout
          </button>
          
          <ConfirmationModal
            isOpen={isLogoutModalOpen}
            title="Confirm Logout"
            message="Are you sure you want to end your session?"
            onConfirm={handleLogout}
            onCancel={() => setIsLogoutModalOpen(false)}
            confirmText="Yes, Logout"
            type="danger"
          />
        </div>
      )}
    </aside>
  );
};

export default Sidebar;