import React, { useState } from "react";
import { Menu, Bell, Search, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ConfirmationModal from "../../Components/Modal/confirmationModal";

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const isAuthenticated = !!localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole") || "User";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth/login");
  };

  return (
    <nav className="sticky top-0 z-50 flex h-16 w-full items-center justify-between bg-white px-4 shadow-sm md:px-6">
      {/* LEFT SECTION */}
      <div className="flex items-center gap-2 md:gap-4">
        <button 
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden" 
          onClick={toggleSidebar}
        >
          <Menu size={24} />
        </button>
        
        {/* Search Bar - Hidden on small mobile, expands on md */}
        <div className="relative hidden items-center sm:flex">
          <Search className="absolute left-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="w-48 rounded-full border border-gray-200 py-1.5 pl-10 pr-4 text-sm outline-none transition-all focus:w-64 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 md:w-64"
          />
        </div>
        
        {/* Mobile Search Icon Only */}
        <button className="rounded-full p-2 text-gray-600 hover:bg-gray-100 sm:hidden">
          <Search size={20} />
        </button>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-3">
        {!isAuthenticated ? (
          <div className="flex items-center gap-2">
            <Link 
              to="/auth/login" 
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600"
            >
              Login
            </Link>
            <Link 
              to="/auth/signup" 
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
            >
              Sign Up
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-2 md:gap-4">
            <button className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100">
              <Bell size={20} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
            </button>

            {/* Profile Button */}
            <button
              onClick={() => navigate("/dashboard/profile")}
              className="group flex items-center gap-2 rounded-full border border-gray-200 bg-white p-1 pr-3 transition-all hover:border-blue-300 hover:bg-blue-50/50 sm:pr-4"
            >
              <div className="relative">
                <img
                  src={`https://ui-avatars.com/api/?name=${userRole}&background=0D8ABC&color=fff&bold=true`}
                  alt="user"
                  className="h-8 w-8 rounded-full border border-white shadow-sm sm:h-9 sm:w-9"
                />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500"></span>
              </div>

              {/* Text - Hidden on very small screens */}
              <div className="hidden flex-col items-start leading-tight sm:flex">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  Account
                </span>
                <span className="text-sm font-bold text-blue-600 group-hover:text-blue-700">
                  {userRole}
                </span>
              </div>
            </button>

            {/* Logout Button */}
            <button
              className="flex items-center justify-center rounded-full bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100"
              onClick={() => setIsLogoutModalOpen(true)}
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        title="Confirm Logout"
        message="Are you sure you want to end your session?"
        onConfirm={handleLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
        confirmText="Yes, Logout"
        type="danger"
      />
    </nav>
  );
};

export default Navbar;