import React, { useState, useEffect, useCallback } from "react";
import { Bell, Search, X, Clock, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../api/axiosInstance";
import ConfirmationModal from "../../Components/Modal/confirmationModal";
import { toast } from "react-hot-toast";
import axios from "axios";
import Profile from "../../Components/Dashboard/Profile/Profile";

interface NavbarProps {
  toggleSidebar: () => void;
}

interface AuditLog {
  id: number;
  table_name: string;
  operation: "INSERT" | "UPDATE" | "DELETE";
  changed_by: string;
  changed_at: string;
  old_data: Record<string, unknown> | null;
  new_data: Record<string, unknown> | null;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profile, setProfile] = useState<{
    first_name: string;
    last_name: string;
    role: string;
    date_of_birth: string;
    phone_number: string;
  } | null>(null);

  const isAuthenticated = !!localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole") || "User";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/login");
  };



  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [hasUnread, setHasUnread] = useState(false);

  const fetchTopLogs = useCallback(async () => {
    if (userRole !== "Admin") return;
    try {
      setLoading(true);
      const { data } = await api.get("/api/audit/system/logs?page=1&limit=3");
      if (data && Array.isArray(data.items)) {
        setLogs(data.items);
        setHasUnread(data.items.length > 0);
      } else {
        setLogs([]);
      }
    } catch (err) {
      console.error("Failed to fetch notification logs:", err);
    } finally {
      setLoading(false);
    }
  }, [userRole]);

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const res = await api.get("/api/user/profile");
      if (res.data.profile) {
        setProfile(res.data.profile);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status !== 404) {
        toast.error("Failed to fetch profile");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopLogs();
  }, [fetchTopLogs]);

 

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest(".notification-trigger") &&
        !target.closest(".profile-trigger")
      ) {
        setIsNotificationOpen(false);
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const operationStyles: Record<string, string> = {
    INSERT: "bg-teal-50 text-teal-700 border border-teal-200",
    UPDATE: "bg-sky-50 text-sky-700 border border-sky-200",
    DELETE: "bg-red-50 text-red-600 border border-red-200",
  };

useEffect(() => {
  // Only run the check if both values are present to avoid false triggers during initial loading
  if (profile?.role && userRole) {
    
    if (profile.role !== userRole) {
      console.warn(`Security Alert: Role mismatch. DB: ${profile.role}, Local: ${userRole}`);
      
      // 1. Show a message to the user
      toast.error("Security mismatch detected. Logging out...");

      // 2. Perform Logout Logic
      // Wrap in a small timeout if you want the user to see the toast message first
      setTimeout(() => {
        handleLogout(); 
        
        // 3. Clear storage and redirect
        localStorage.clear();
        globalThis.location.href = '/login';
      }, 1000);
    }
  }
}, [profile, userRole, handleLogout]);
  return (
    <nav
      className="sticky top-0 z-50 flex h-16 w-full items-center justify-between bg-white px-5 md:px-8"
      style={{
        borderBottom: "1px solid #e8f0ef",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      {/* LEFT — Search */}
      <div className="flex items-center gap-3">
        {/* Mobile menu toggle (slim teal bar) */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden flex flex-col gap-1 p-2 rounded-lg hover:bg-teal-50 transition-colors"
        >
          <span className="block h-0.5 w-5 rounded bg-teal-700" />
          <span className="block h-0.5 w-4 rounded bg-teal-500" />
          <span className="block h-0.5 w-5 rounded bg-teal-700" />
        </button>

        {/* Search bar — Upstream style: type selector + input */}
        <div className="hidden sm:flex items-center gap-0 rounded-lg border border-slate-200 bg-slate-50 overflow-hidden hover:border-teal-300 transition-colors focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-100">
          <select
            className="bg-transparent border-r border-slate-200 text-xs font-semibold text-slate-500 px-3 py-2 outline-none cursor-pointer"
            style={{ appearance: "none" }}
          >
            <option>All</option>
            <option>Users</option>
            <option>Logs</option>
          </select>
          <div className="relative flex items-center">
            <Search className="absolute left-3 text-slate-400" size={15} />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent py-2 pl-9 pr-4 text-sm outline-none w-44 md:w-56 text-slate-700 placeholder-slate-400"
            />
          </div>
          <button className="px-3 text-slate-400 hover:text-teal-600 transition-colors">
            <Search size={15} />
          </button>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2 md:gap-3">
        {isAuthenticated && (
          <>
            {/* Notification Bell */}
            <div className="notification-trigger relative">
              <button
                onClick={() => {
                  setIsNotificationOpen(!isNotificationOpen);
                  if (!isNotificationOpen) setHasUnread(false);
                }}
                className="relative flex items-center justify-center h-9 w-9 rounded-full text-slate-500 hover:bg-teal-50 hover:text-teal-700 transition-all border border-transparent hover:border-teal-200"
              >
                <Bell size={18} />
                {hasUnread && (
                  <span
                    className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full border-2 border-white animate-pulse"
                    style={{ backgroundColor: "#00a896" }}
                  />
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotificationOpen && (
                <div
                  className="absolute right-0 mt-3 w-80 rounded-2xl bg-white overflow-hidden"
                  style={{
                    border: "1px solid #e2eeec",
                    boxShadow:
                      "0 8px 32px rgba(0,100,80,0.1), 0 2px 8px rgba(0,0,0,0.06)",
                  }}
                >
                  <div
                    className="flex items-center justify-between px-4 py-3"
                    style={{ borderBottom: "1px solid #f0f7f5" }}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full animate-pulse"
                        style={{ backgroundColor: "#00a896" }}
                      />
                      <h3 className="text-sm font-bold text-slate-800">
                        Recent Activity
                      </h3>
                    </div>
                    <button
                      onClick={() => setIsNotificationOpen(false)}
                      className="p-1 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  <div className="p-2 space-y-1">
                    {loading ? (
                      <div className="p-6 text-center">
                        <div
                          className="mx-auto h-5 w-5 rounded-full border-2 border-t-transparent animate-spin"
                          style={{
                            borderColor: "#00a896",
                            borderTopColor: "transparent",
                          }}
                        />
                      </div>
                    ) : logs.length > 0 ? (
                      logs.map((log) => (
                        <div
                          key={log.id}
                          className="p-3 rounded-xl transition-colors cursor-pointer"
                          style={{}}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#f5faf9")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "")
                          }
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span
                              className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                                operationStyles[log.operation] ||
                                "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {log.operation}
                            </span>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                              <Clock size={9} />
                              {new Date(log.changed_at).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-slate-700">
                            {log.table_name} Updated
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">
                            By{" "}
                            {log.changed_by === "postgres"
                              ? "System"
                              : log.changed_by}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-slate-400 text-xs italic">
                        No recent activity
                      </div>
                    )}
                  </div>

                  <Link
                    to="/dashboard/admin/logs"
                    onClick={() => setIsNotificationOpen(false)}
                    className="block px-4 py-3 text-center text-xs font-bold transition-colors"
                    style={{
                      color: "#007a6e",
                      borderTop: "1px solid #f0f7f5",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#f0faf8")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "")
                    }
                  >
                    View All System Logs →
                  </Link>
                </div>
              )}
            </div>

            {/* Profile Pill — Upstream style */}
            <div className="profile-trigger relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`group flex items-center gap-2.5 rounded-full px-2 py-1 transition-all border ${
                  isProfileOpen
                    ? "border-teal-400 bg-teal-50"
                    : "border-slate-200 bg-white hover:border-teal-300 hover:bg-teal-50"
                }`}
              >
                <img
                  src={`https://ui-avatars.com/api/?name=${profile?.role}&background=00897b&color=fff&bold=true`}
                  alt="user"
                  className="h-8 w-8 rounded-full shadow-sm"
                />
                <div className="hidden sm:flex flex-col items-start leading-tight">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                    {profile?.role === "Admin" ? "Organization admin" : profile?.role || "User"}
                  </span>
                  <span
                    className="text-xs font-bold"
                    style={{ color: "#007a6e" }}
                  >
                    {profile
                      ? `${profile.first_name} ${profile.last_name}`
                      : "Unknown User"}
                  </span>
                </div>
                <ChevronDown
                  size={14}
                  className={`text-slate-400 transition-transform ${isProfileOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isProfileOpen && (
                <Profile onClose={() => setIsProfileOpen(false)} />
              )}
            </div>
          </>
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
