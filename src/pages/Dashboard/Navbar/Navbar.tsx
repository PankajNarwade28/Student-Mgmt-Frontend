import React, { useState, useEffect, useCallback } from "react";
import { Menu, Bell, Search, LogOut, X, Clock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../api/axiosInstance";
import ConfirmationModal from "../../Components/Modal/confirmationModal";

interface NavbarProps {
  toggleSidebar: () => void;
}

interface AuditLog {
  id: number;
  table_name: string;
  operation: 'INSERT' | 'UPDATE' | 'DELETE';
  changed_by: string;
  changed_at: string;
  old_data: Record<string, unknown> | null;
  new_data: Record<string, unknown> | null;
}
const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false); 

  const isAuthenticated = !!localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole") || "User";
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/login");
  }
  const [, setLoading] = useState(false);

// Inside Navbar component
const [logs, setLogs] = useState<AuditLog[]>([]);
const [hasUnread, setHasUnread] = useState(false); 

const fetchTopLogs = useCallback(async () => {
  // Only fetch if the user is an Admin
  if (userRole !== "Admin") return;

  try {
    setLoading(true);
    const { data } = await api.get("/api/audit/system/logs");
    
    // Limit to the most recent 3 logs as requested
    setLogs(data.slice(0, 3));
  } catch (err) {
    console.error("Failed to fetch notification logs:", err);
  } finally {
    setLoading(false);
  }
}, [userRole]);

// Fetch logs once when the component mounts or role changes
useEffect(() => {
  fetchTopLogs();
}, [fetchTopLogs]);
  return (
    <nav className="sticky top-0 z-50 flex h-16 w-full items-center justify-between bg-white px-4 shadow-sm md:px-6 border-b border-slate-100">
      {/* LEFT SECTION */}
      <div className="flex items-center gap-2 md:gap-4">
        <button
          className="rounded-lg p-2 text-gray-600 hover:bg-slate-100 lg:hidden"
          onClick={toggleSidebar}
        >
          <Menu size={24} />
        </button>
        <div className="relative hidden items-center sm:flex">
          <Search className="absolute left-3 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Quick Search..."
            className="w-48 rounded-xl border border-slate-200 bg-slate-50 py-1.5 pl-10 pr-4 text-sm outline-none transition-all focus:w-64 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 md:w-64"
          />
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-3">
        {isAuthenticated && (
          <div className="flex items-center gap-2 md:gap-4">
            {/* NOTIFICATION SECTION */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsNotificationOpen(!isNotificationOpen);
                  if (!isNotificationOpen) setHasUnread(false); // Reset dot on open
                }}
                className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100"
              >
                <Bell size={20} />
                {hasUnread && (
                  <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500 animate-pulse"></span>
                )}
              </button>

              {/* DROPDOWN */}
              {isNotificationOpen && (
                <div className="absolute right-0 mt-3 w-80 rounded-3xl border border-slate-100 bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
                  <div className="flex items-center justify-between p-4 border-b border-slate-50">
                    <h3 className="font-bold text-slate-800 text-sm">
                      Recent Activity
                    </h3>
                    <button
                      onClick={() => setIsNotificationOpen(false)}
                      className="p-1 hover:bg-slate-100 rounded-full text-slate-400"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="p-2 space-y-1">
                    {logs.length > 0 ? (
                      logs.map((log) => (
                        <div
                          key={log.id}
                          className="p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
                        >
                          <div className="flex justify-between items-start">
                            <span
                              className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${log.operation === "DELETE" ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}
                            >
                              {log.operation}
                            </span>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                              <Clock size={10} />{" "}
                              {new Date(log.changed_at).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <p className="mt-1 text-xs font-bold text-slate-700">
                            {log.table_name} Updated
                          </p>
                          <p className="text-[10px] text-slate-500 truncate">
                            By {log.changed_by}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-slate-400 text-xs italic">
                        No recent logs found
                      </div>
                    )}
                  </div>
                  <Link
                    to="/dashboard/admin/logs"
                    onClick={() => setIsNotificationOpen(false)}
                    className="block p-4 text-center text-[11px] font-bold text-indigo-600 hover:bg-indigo-50 rounded-b-3xl transition-colors"
                  >
                    View All System Logs
                  </Link>
                </div>
              )}
            </div>

            {/* PROFILE PILL */}
            <button
              onClick={() => navigate("/dashboard/profile")}
              className="group flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1 pr-3 transition-all hover:border-indigo-300 hover:bg-indigo-50 sm:pr-4"
            >
              <img
                src={`https://ui-avatars.com/api/?name=${userRole}&background=4F46E5&color=fff&bold=true`}
                alt="user"
                className="h-8 w-8 rounded-full border border-white shadow-sm"
              />
              <div className="hidden flex-col items-start leading-tight sm:flex">
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                  Role
                </span>
                <span className="text-xs font-bold text-indigo-600">
                  {userRole}
                </span>
              </div>
            </button>

            <button
              className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-50 text-rose-600 transition-all hover:bg-rose-100"
              onClick={() => setIsLogoutModalOpen(true)}
            >
              <LogOut size={18} />
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
