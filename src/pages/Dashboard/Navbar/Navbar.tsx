import React, { useState } from "react";
import { Menu, Bell, Search, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ConfirmationModal from "../../Components/Modal/confirmationModal";
import "./Navbar.css";

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Check if token exists to determine if user is logged in
  const isAuthenticated = !!localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole") || "User";

  const handleLogout = () => {
    localStorage.clear(); // Removes token, userId, and userRole
    navigate("/auth/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <button className="hamburger" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <div className="search-box">
          <Search size={18} />
          <input type="text" placeholder="Search..." />
        </div>
      </div>

      <div className="nav-right">
        {/* Conditional Rendering: Show Login/Signup ONLY if NOT authenticated */}
        {!isAuthenticated ? (
          <div className="auth-buttons">
            <Link to="/auth/login" className="btn-login">
              Login
            </Link>
            <Link to="/auth/signup" className="btn-signup">
              Sign Up
            </Link>
          </div>
        ) : (
          /* Show Profile and Logout ONLY if authenticated */
          <div className="user-section">
            <button className="icon-btn">
              <Bell size={20} />
            </button>

            {/* <div className="profile-pill font-bold text-blue-600">
              <img
                src={`https://ui-avatars.com/api/?name=${userRole}`}
                alt="user"
              />
              <span>{userRole}</span>
            </div> */}

            <div className="flex items-center hover:cursor-pointer">
              <button
                onClick={() => navigate("/dashboard/profile")}
                className="group flex items-center gap-3 p-1 pr-4 bg-white border border-gray-200 rounded-full hover:border-blue-300 hover:bg-blue-50/50 hover:cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md"
              >
                {/* Avatar with Ring */}
                <div className="relative">
                  <img
                    src={`https://ui-avatars.com/api/?name=${userRole}&background=0D8ABC&color=fff&bold=true`}
                    alt="user"
                    className="w-9 h-9 rounded-full border-2 border-white shadow-sm transition-transform group-hover:scale-105"
                  />
                  {/* Small Active Status Indicator */}
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                </div>

                {/* Text Label */}
                <div className="flex flex-col items-start leading-tight">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Account
                  </span>
                  <span className="text-sm font-bold text-blue-600 group-hover:text-blue-700">
                    {userRole}
                  </span>
                </div>

                {/* Small Chevron to indicate interactivity */}
                <svg
                  className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            {/* <button className="logout-btn" onClick={() => setIsLogoutModalOpen(true)} title="Logout">
              <LogOut size={20} />
            </button> */}
            <button
              className="fixed bottom-6 left-6 z-[9999] bg-red-600 text-white p-3 rounded-full shadow-2xl hover:bg-red-700 transition-all active:scale-95"
              onClick={() => setIsLogoutModalOpen(true)}
              title="Logout"
            >
              <LogOut size={20} />
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
      </div>
    </nav>
  );
};

export default Navbar;
