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
} from "react-icons/hi";
import type { DirectoryUser } from "../../../models/userDirectory";
import axios from "axios";
const Users: React.FC = () => {
  const [users, setUsers] = useState<DirectoryUser[]>([]); // Clean type here
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<
    "All" | "Student" | "Teacher" | "Admin"
  >("All");

  const fetchDir = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get<{ users: DirectoryUser[] }>(
        "/api/admin/users/directory",
      );

      // Explicitly handle the data or fallback to empty array
      const data = res.data.users || [];
      console.log("Fetched users:", data.length); // Debugging line
      toast.success(`Fetched ${data.length} users from directory.`);
      setUsers(data);
   } catch (error) {
   if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Fetch failed");
        return;
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Combined Filter: Search Term + Active Tab
  const filtered = users.filter((u) => {
    const matchesSearch =
      `${u.first_name ?? ""} ${u.last_name ?? ""} ${u.email}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesTab = activeTab === "All" || u.role === activeTab;

    return matchesSearch && matchesTab;
  });
  // 2. Call the function on mount
  useEffect(() => {
    fetchDir();
  }, [fetchDir]);

  if (loading)
    return <div className="p-10 text-center">Loading Directory...</div>;

  // 3. Handle Empty State
  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed rounded-3xl m-6">
        <p className="text-gray-400 font-medium">
          No users found in the directory.
        </p>
        <button
          onClick={fetchDir} // Now this works!
          className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-all"
        >
          Refresh Data
        </button>
      </div>
    );
  }
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
        placeholder="Search name, email, or role..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  </div>

  {/* Tabs Section 
      - grid-cols-1: Below 500px (Mobile standard)
      - min-[500px]:grid-cols-2: Between 500px and 1024px (Tablet/iPad)
      - lg:flex: Desktop (1024px+)
  */}
  <div className="grid grid-cols-1 min-[500px]:grid-cols-2 lg:flex lg:items-center border-b border-slate-200 w-full bg-white">
    {[
      {
        name: "All",
        label: "Overview",
        icon: <HiOutlineViewGrid size={20} />,
      },
      {
        name: "Student",
        label: "Students",
        icon: <HiOutlineUserGroup size={20} />,
      },
      {
        name: "Teacher",
        label: "Teachers",
        icon: <HiOutlineAcademicCap size={20} />,
      },
      {
        name: "Admin",
        label: "Administrators",
        icon: <HiOutlineShieldCheck size={20} />,
      },
    ].map((tab) => (
      <button
        key={tab.name}
        onClick={() =>
          setActiveTab(tab.name as "All" | "Student" | "Teacher" | "Admin")
        }
        className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all relative whitespace-nowrap lg:flex-1 justify-center lg:justify-start border-b lg:border-b-0 border-slate-100 lg:border-transparent ${
          activeTab === tab.name
            ? "text-indigo-600 bg-indigo-50/30"
            : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
        }`}
      >
        <span
          className={`${activeTab === tab.name ? "text-indigo-600" : "text-slate-400"}`}
        >
          {tab.icon}
        </span>
        {tab.label}

        {/* Desktop Indicator (Horizontal) */}
        {activeTab === tab.name && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 animate-in fade-in duration-300 hidden lg:block" />
        )}
        
        {/* Mobile/Grid Indicator (Left Border) */}
        {activeTab === tab.name && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 lg:hidden" />
        )}

        {activeTab === tab.name && filtered.length > 0 && (
          <span className="ml-1 bg-indigo-100 text-indigo-700 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
            {filtered.length}
          </span>
        )}
      </button>
    ))}
  </div>
</div>
      {/* Grid Display */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {filtered.map((user) => (
            <div
              key={user.id}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-lg group-hover:bg-slate-800 group-hover:text-white transition-colors">
                  {user.first_name?.[0] || user.email[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">
                    {user.first_name
                      ? `${user.first_name} ${user.last_name}`
                      : "User"}
                  </h3>
                  <span
                    className={`text-[10px] uppercase tracking-widest font-extrabold px-2 py-0.5 rounded ${
                      user.role === "Admin"
                        ? "bg-purple-50 text-purple-600"
                        : user.role === "Teacher"
                          ? "bg-amber-50 text-amber-600"
                          : "bg-blue-50 text-blue-600"
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <HiOutlineMail className="text-slate-400" /> {user.email}
                </div>
                {user.phone_number && (
                  <div className="flex items-center gap-2">
                    <HiOutlinePhone className="text-slate-400" />{" "}
                    {user.phone_number}
                  </div>
                )}
              </div>

              {/* Only show the course section if the user is NOT an Admin */}
              {user.role !== "Admin" && (
                <div className="mt-4 pt-4 border-t border-slate-50">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">
                    {user.role === "Teacher" ? "Instructing" : "Enrollments"}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {user.related_courses?.length > 0 ? (
                      user.related_courses.map((courseName: string) => (
                        <span
                          key={courseName}
                          className="bg-slate-50 text-slate-600 px-2 py-1 rounded text-[11px] border border-slate-100"
                        >
                          {courseName}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-xs italic">
                        No courses linked
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-medium">
            No {activeTab.toLowerCase()}s found matching your search.
          </p>
        </div>
      )}
    </div>
  );
};

export default Users;
