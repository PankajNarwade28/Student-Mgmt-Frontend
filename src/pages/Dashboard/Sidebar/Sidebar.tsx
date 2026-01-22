import React from "react";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  X,
  Database,
} from "lucide-react";
import "./Sidebar.css";
import { NavLink, useNavigate } from "react-router-dom";
import { canAccess, ROLES } from "../../Components/Utils/rbac"; // Import utility
import ConfirmationModal from "../../Components/Modal/confirmationModal";
import { useState } from "react";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  // Auth & Role Data
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");
  const isAuthenticated = !!token;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth/login");
  };

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <NavLink to="/" className="logo">
          <LayoutDashboard size={24} /> <span>ERP System</span>
        </NavLink>

        <button className="close-btn" onClick={toggleSidebar}>
          <X size={24} />
        </button>
      </div>

      <nav className="menu">
        {/* Always visible to logged in users */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
          onClick={toggleSidebar}
        >
          <LayoutDashboard size={20} /> Dashboard
        </NavLink>
 
        {/* ADMIN ONLY: Users Management */}
        {canAccess(userRole, [ROLES.ADMIN]) && (
          <NavLink
            to="/dashboard/users"
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
            onClick={toggleSidebar}
          >
            <Users size={20} /> Users
          </NavLink>
        )}

        {/* ADMIN & TEACHER: Reports */}
        {canAccess(userRole, [ROLES.ADMIN, ROLES.TEACHER]) && (
          <NavLink
            to="/dashboard/reports"
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
            onClick={toggleSidebar}
          >
            <BarChart3 size={20} /> Reports
          </NavLink>
        )}

        {/* SAMPLE: Only Teacher can see Test section */}
        {canAccess(userRole, [ROLES.TEACHER]) && (
          <NavLink
            to="/dashboard/test"
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
            onClick={toggleSidebar}
          >
            <Database size={20} /> Teacher Logs
          </NavLink>
        )}

        {/* Settings: Visible to everyone authenticated */}
        <NavLink
          to="/dashboard/settings"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
          onClick={toggleSidebar}
        >
          <Settings size={20} /> Settings
        </NavLink>
      </nav>

      {/* ONLY show footer/logout if authenticated */}
      {isAuthenticated && (
        <div className="sidebar-footer">
          <button
            className="logout-btn-sidebar"
            onClick={() => {
              setIsLogoutModalOpen(true);
            }}
          >
            Logout{" "}
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
