import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  BookOpen,
  ClipboardList,
  CalendarClock,
  UserCheck,
  LogOut,
  X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { canAccess, ROLES } from "../../Components/Utils/rbac";
import ConfirmationModal from "../../Components/Modal/confirmationModal";
import { HiOutlineHome, HiOutlineLibrary } from "react-icons/hi";
import { FaUserGraduate } from "react-icons/fa";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

// Tooltip wrapper for icon-only sidebar
const NavItem: React.FC<{
  to: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}> = ({ to, icon, label, onClick }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `group relative flex items-center justify-center h-11 w-11 rounded-xl transition-all duration-150 ${
          isActive
            ? "bg-white/20 text-white shadow-inner"
            : "text-teal-100/70 hover:bg-white/15 hover:text-white"
        }`
      }
      title={label}
    >
      {icon}
      {/* Tooltip */}
      <span
        className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg transition-all duration-150 group-hover:opacity-100 group-hover:translate-x-0 translate-x-[-4px] z-50"
        style={{ backgroundColor: "#00695c" }}
      >
        {label}
        <span
          className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent"
          style={{ borderRightColor: "#00695c" }}
        />
      </span>
    </NavLink>
  );
};

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

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[90] bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-[100] flex flex-col items-center py-4 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          width: "72px",
          background: "linear-gradient(160deg, #00796b 0%, #004d40 100%)",
          boxShadow: "2px 0 16px rgba(0,60,50,0.18)",
        }}
      >
        {/* Logo mark */}
        <div className="mb-6 flex flex-col items-center gap-1">
          <NavLink
            to="/"
            className="flex items-center justify-center h-10 w-10 rounded-xl bg-white/15 hover:bg-white/25 transition-colors"
            title="ERP System"
          >
            <LayoutDashboard size={20} className="text-white" />
          </NavLink>
          {/* Mobile close */}
          <button
            className="mt-1 lg:hidden flex items-center justify-center h-7 w-7 rounded-lg text-teal-200 hover:bg-white/15 transition-colors"
            onClick={toggleSidebar}
          >
            <X size={16} />
          </button>
        </div>

        {/* Divider */}
        <div className="w-8 h-px mb-4 rounded-full bg-white/20" />

        {/* Nav items */}
        <nav className="flex flex-1 flex-col items-center gap-1 w-full px-3">
          <NavItem
            to="/dashboard"
            icon={<HiOutlineHome size={20} />}
            label="Dashboard"
            onClick={toggleSidebar}
          />
          {/* ADMIN ONLY */}
          {canAccess(userRole, [ROLES.ADMIN]) && (
            <>
              <NavItem
                to="/dashboard/users"
                icon={<Users size={20} />}
                label="Users"
                onClick={toggleSidebar}
              />
              <NavItem
                to="/dashboard/admin/students"
                icon={<FaUserGraduate size={18} />}
                label="Students"
                onClick={toggleSidebar}
              />
              <NavItem
                to="/dashboard/admin/fees"
                icon={<BookOpen size={20} />}
                label="Fees"
                onClick={toggleSidebar}
              />
              <NavItem
                to="/dashboard/admin/schedule"
                icon={<CalendarClock size={20} />}
                label="Schedule"
                onClick={toggleSidebar}
              />
              <NavItem
                to="/dashboard/reports"
                icon={<BarChart3 size={20} />}
                label="Reports"
                onClick={toggleSidebar}
              />
            </>
          )}
          {/* TEACHER & STUDENT */}
          {canAccess(userRole, [ROLES.TEACHER, ROLES.STUDENT]) && (
            <>
              <NavItem
                to="/dashboard/mycourses"
                icon={<HiOutlineLibrary size={20} />}
                label="My Courses"
                onClick={toggleSidebar}
              />
              <NavItem
                to="/dashboard/schedule"
                icon={<CalendarClock size={20} />}
                label="Schedule"
                onClick={toggleSidebar}
              />
              <NavItem
                to="/dashboard/results"
                icon={<BarChart3 size={20} />}
                label="Results"
                onClick={toggleSidebar}
              />
            </>
          )}
          
          <NavItem
            to={
              userRole === "Admin" ? "/dashboard/admin/quiz" : "/dashboard/quiz"
            }
            icon={<ClipboardList size={20} />}
            label="Quiz"
            onClick={toggleSidebar}
          />
          <NavItem
            to="/dashboard/attendance"
            icon={<UserCheck size={20} />}
            label="Attendance"
            onClick={toggleSidebar}
          />
          {canAccess(userRole, [ROLES.STUDENT]) && (
            <NavItem
              to="/dashboard/fees"
              icon={<BookOpen size={20} />}
              label="Fees"
              onClick={toggleSidebar}
            />
          )}
          {/* Divider before settings */}
          <div className="w-8 h-px my-2 rounded-full bg-white/20" />
          <NavItem
            to="/dashboard/settings"
            icon={<Settings size={20} />}
            label="Settings"
            onClick={toggleSidebar}
          />
        </nav>

        {/* Logout at bottom */}
        {isAuthenticated && (
          <div className="mt-4 px-3">
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              title="Logout"
              className="flex items-center justify-center h-11 w-11 rounded-xl text-teal-100/70 hover:bg-red-500/30 hover:text-red-200 transition-all group relative"
            >
              <LogOut size={20} />
              <span
                className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg transition-all duration-150 group-hover:opacity-100 z-50"
                style={{ backgroundColor: "#b91c1c" }}
              >
                Logout
                <span
                  className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent"
                  style={{ borderRightColor: "#b91c1c" }}
                />
              </span>
            </button>
          </div>
        )}
      </aside>

      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        title="Confirm Logout"
        message="Are you sure you want to end your session?"
        onConfirm={handleLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
        confirmText="Yes, Logout"
        type="danger"
      />
    </>
  );
};

export default Sidebar;
