import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import api from "../../../api/axiosInstance";
import {
  HiOutlineSearch,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineUserGroup,
  HiOutlineViewGrid,
  HiOutlineAcademicCap,
  HiOutlineShieldCheck,
  HiChevronLeft,
  HiChevronRight
} from "react-icons/hi";
import type { DirectoryUser } from "../../../models/userDirectory";
import axios from "axios";

const Users: React.FC = () => {
  const [users, setUsers] = useState<DirectoryUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"All" | "Student" | "Teacher" | "Admin">("All");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // 1. Reset page to 1 whenever the active tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  // 2. Fetch data based on current page AND active tab
  const fetchDir = useCallback(async () => {
    try {
      setLoading(true);
      // Ensure we pass the activeTab as the role parameter
      const res = await api.get<{ 
        users: DirectoryUser[], 
        pagination: { totalPages: number, totalItems: number } 
      }>(`/api/admin/users/directory?page=${currentPage}&limit=8&role=${activeTab}`);

      setUsers(res.data.users || []);
      setTotalPages(res.data.pagination.totalPages || 1);
      setTotalItems(res.data.pagination.totalItems || 0);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Fetch failed");
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, activeTab]);

  useEffect(() => {
    fetchDir();
  }, [fetchDir]);

  // Real-time search filter for the users currently visible on the page
  const filtered = users.filter((u) => {
    return `${u.first_name ?? ""} ${u.last_name ?? ""} ${u.email}`
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  if (loading) return <div className="p-20 text-center animate-pulse text-slate-500 font-medium">Loading Directory...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-2">
              <HiOutlineUserGroup className="text-slate-400 shrink-0" /> 
              Member Directory
            </h1>
            <p className="text-slate-500 text-sm md:text-base">Public view of all enrolled members</p>
          </div>

          <div className="relative w-full md:w-80">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 ring-slate-800/5 outline-none transition-all"
              placeholder="Search on this page..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Tabs Section */}
        <div className="grid grid-cols-1 min-[500px]:grid-cols-2 lg:flex lg:items-center border-b border-slate-200 w-full bg-white rounded-t-2xl overflow-hidden">
          {[
            { name: "All", label: "Overview", icon: <HiOutlineViewGrid size={20} /> },
            { name: "Student", label: "Students", icon: <HiOutlineUserGroup size={20} /> },
            { name: "Teacher", label: "Teachers", icon: <HiOutlineAcademicCap size={20} /> },
            { name: "Admin", label: "Administrators", icon: <HiOutlineShieldCheck size={20} /> },
          ].map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name as "All" | "Student" | "Teacher" | "Admin")}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all relative lg:flex-1 justify-center lg:justify-start ${
                activeTab === tab.name ? "text-indigo-600 bg-indigo-50/30" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <span className={activeTab === tab.name ? "text-indigo-600" : "text-slate-400"}>{tab.icon}</span>
              {tab.label}
              {activeTab === tab.name && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 hidden lg:block" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Display */}
      {filtered.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((user) => (
              <div key={user.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-lg group-hover:bg-slate-800 group-hover:text-white transition-colors">
                    {user.first_name?.[0] || user.email[0].toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{user.first_name ? `${user.first_name} ${user.last_name}` : "User"}</h3>
                    <span className={`text-[10px] uppercase tracking-widest font-extrabold px-2 py-0.5 rounded ${
                      user.role === "Admin" ? "bg-purple-50 text-purple-600" : user.role === "Teacher" ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
                    }`}>
                      {user.role}
                    </span>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2"><HiOutlineMail className="text-slate-400" /> {user.email}</div>
                  {user.phone_number && <div className="flex items-center gap-2"><HiOutlinePhone className="text-slate-400" /> {user.phone_number}</div>}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination UI */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-slate-200 gap-4">
            <p className="text-sm text-slate-500">
              Showing page <span className="font-bold text-slate-900">{currentPage}</span> of <span className="font-bold text-slate-900">{totalPages}</span> ({totalItems} total)
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 transition-all"
              >
                <HiChevronLeft size={20} />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 transition-all"
              >
                <HiChevronRight size={20} />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-medium">No {activeTab.toLowerCase()}s found.</p>
        </div>
      )}
    </div>
  );
};

export default Users;