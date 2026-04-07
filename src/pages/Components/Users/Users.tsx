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
  const [, setTotalItems] = useState(0);

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
   <div className="p-4 md:p-6   mx-auto space-y-6 ">
  {/* 1. COMPACT HEADER */}
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
    <div className="space-y-1">
      <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
        <HiOutlineUserGroup className="text-[#00796b]" /> 
        Member Directory
      </h1>
      <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">System Registry Overview</p>
    </div>

    <div className="relative w-full md:w-72 group">
      <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00796b] transition-colors" />
      <input
        className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-4 ring-teal-500/5 focus:border-[#00796b] outline-none transition-all text-sm shadow-sm"
        placeholder="Filter by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  </div>

  {/* 2. COMPACT TABS SECTION */}
  <div className="flex flex-wrap items-center gap-1 p-1 bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
    {[
      { name: "All", label: "All Members", icon: <HiOutlineViewGrid size={16} /> },
      { name: "Student", label: "Students", icon: <HiOutlineUserGroup size={16} /> },
      { name: "Teacher", label: "Teachers", icon: <HiOutlineAcademicCap size={16} /> },
      { name: "Admin", label: "Administrators", icon: <HiOutlineShieldCheck size={16} /> },
    ].map((tab) => (
      <button
        key={tab.name}
        onClick={() => setActiveTab(tab.name as "All" | "Student" | "Teacher" | "Admin")}
        className={`flex items-center gap-2 px-4 py-2 text-xs font-bold transition-all rounded-xl ${
          activeTab === tab.name 
            ? "text-[#00796b] bg-teal-50 shadow-inner" 
            : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
        }`}
      >
        {tab.icon}
        {tab.label}
      </button>
    ))}
  </div>

  {/* 3. ROW-BASED LIST DISPLAY */}
  <div className="bg-white border border-slate-100 rounded-[2rem] shadow-xl shadow-teal-900/5 overflow-hidden">
    {filtered.length > 0 ? (
      <>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-slate-100">
                {["Member Identity", "System Role", "Contact Info", "Authorization Status"].map((h) => (
                  <th key={h} className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((user) => (
                <tr key={user.id} className="group hover:bg-teal-50/30 transition-all">
                  {/* Identity Column */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-black text-sm uppercase group-hover:bg-[#00796b] group-hover:text-white transition-all shadow-sm">
                        {user.first_name?.[0] || user.email[0].toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-sm leading-none mb-1">
                          {user.first_name ? `${user.first_name} ${user.last_name}` : "System User"}
                        </h3>
                        <p className="text-[10px] text-slate-400 font-mono tracking-tighter uppercase">ID: {user.id.slice(0, 12)}</p>
                      </div>
                    </div>
                  </td>

                  {/* Role Column */}
                  <td className="px-6 py-4">
                    <span className={`text-[10px] uppercase tracking-widest font-black px-3 py-1 rounded-lg ${
                      user.role === 'Admin' ? 'bg-purple-50 text-purple-600 border border-purple-100' :
                      user.role === 'Teacher' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                      'bg-blue-50 text-blue-600 border border-blue-100'
                    }`}>
                      {user.role}
                    </span>
                  </td>

                  {/* Contact Info Column */}
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                        <HiOutlineMail className="text-teal-500" /> {user.email}
                      </div>
                      {user.phone_number && (
                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                          <HiOutlinePhone className="text-teal-400" /> {user.phone_number}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Status Column */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full w-fit border border-emerald-100">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active Member
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* COMPACT PAGINATION */}
        <div className="flex items-center justify-between p-4 bg-gray-50/50 border-t border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">
            Page <span className="text-slate-800">{currentPage}</span> / {totalPages}
          </p>
          
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="p-1.5 border border-slate-200 rounded-lg hover:bg-white text-slate-500 disabled:opacity-30 transition-all shadow-sm"
            >
              <HiChevronLeft size={16} />
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="p-1.5 border border-slate-200 rounded-lg hover:bg-white text-slate-500 disabled:opacity-30 transition-all shadow-sm"
            >
              <HiChevronRight size={16} />
            </button>
          </div>
        </div>
      </>
    ) : (
      <div className="py-20 text-center bg-slate-50/50">
        <HiOutlineUserGroup className="mx-auto text-4xl text-slate-200 mb-2" />
        <p className="text-slate-400 font-black text-xs uppercase tracking-widest">
          No records matching "{activeTab}"
        </p>
      </div>
    )}
  </div>
</div>
  );
};

export default Users;