import React, { useEffect, useState } from "react";
import api from "../../../../../api/axiosInstance";
import { FaEdit, FaTrash } from "react-icons/fa";
import { HiOutlineSearch
  , HiOutlineChevronLeft, HiOutlineChevronRight
 } from "react-icons/hi";
import { toast } from "react-hot-toast";
import axios from "axios";
import ConfirmationModal from "../../../Modal/confirmationModal";

interface User {
  id: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const ViewUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  // Add these states at the top of your component
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = Number.parseInt(import.meta.env.PAGINATION_LIMIT) || 8; // Default to 8 if not set

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Pass page and limit as query parameters
      const response = await api.get(
        `/api/admin/users?page=${currentPage}&limit=${limit}`,
      );

      // Adjusted to match the new controller response
      if (response.data.success) {
        setUsers(response.data.users);
        setTotalPages(response.data.pagination.totalPages);
      }

      toast.success("Users fetched successfully");
    } catch (error) {
      console.error("Fetch Users Error:", error);
      toast.error("Fetch failed");
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch users whenever the currentPage changes
  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    try {
      await api.delete(`/api/admin/users/${userToDelete}`, {
        data: { id: userToDelete },
      });
      toast.success("User deleted successfully");
      setUsers(users.filter((u) => u.id !== userToDelete));
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Delete failed");
        return;
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      await api.put(`/api/admin/users/${editingUser.id}`, {
        id: editingUser.id, //for checkCourseAssignments middleware
        email: editingUser.email.toLowerCase().trim(),
        role: editingUser.role,
      });
      toast.success("User updated successfully");
      setUsers(users.map((u) => (u.id === editingUser.id ? editingUser : u)));
      setIsEditModalOpen(false);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Update failed");
        return;
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
        <p className="text-gray-500 font-medium">Syncing user database...</p>
      </div>
    );

  return (
   <div className="animate-in fade-in duration-500 space-y-8 p-4 md:p-0">
  {/* Header Section */}
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
    <div className="space-y-1">
      <h2 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-3">
        User Directory
      </h2>
      <p className="text-sm text-slate-400 font-medium">
        Manage system access and member authorization roles.
      </p>
    </div>

    <div className="flex items-center gap-3">
      <div className="relative group">
        <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
        <input
          type="text"
          placeholder="Search by email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-72 pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-4 ring-emerald-500/5 focus:border-emerald-500/50 outline-none transition-all text-sm shadow-sm"
        />
      </div>
      <button className="hidden md:flex items-center gap-2 bg-[#00796b] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#00695c] transition-all shadow-lg shadow-emerald-900/10 active:scale-95">
        Export List
      </button>
    </div>
  </div>

  {/* Table Container - Inspired by the reference image */}
  <div className="bg-white border border-gray-100 rounded-[2rem] shadow-xl shadow-slate-200/40 overflow-hidden">
    
    {/* MOBILE VIEW (Cards) */}
    <div className="md:hidden divide-y divide-gray-50">
      {filteredUsers.map((user) => (
        <div key={user.id} className="p-5 space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-700 break-all">{user.email}</span>
              <span className="text-[10px] text-gray-400 font-mono tracking-tighter uppercase">UID: {user.id.slice(0, 8)}</span>
            </div>
            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${
                user.role === "Admin" ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-blue-600"
            }`}>
              {user.role}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
              user.is_active ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
            }`}>
              {user.is_active ? "Active" : "Inactive"}
            </span>
            <div className="flex gap-2">
               {user.role !== "Admin" && (
                 <>
                  <button onClick={() => { setEditingUser({ ...user }); setIsEditModalOpen(true); }} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><FaEdit size={14} /></button>
                  <button onClick={() => { setUserToDelete(user.id); setIsDeleteModalOpen(true); }} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"><FaTrash size={14} /></button>
                 </>
               )}
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* DESKTOP VIEW (Table) */}
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50/40 border-b border-gray-100">
            {["Identity & Email", "Type / Role", "Account Status", "Authorization Date", "Control"].map((h) => (
              <th key={h} className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {filteredUsers.map((user) => (
            <tr key={user.id} className="group hover:bg-emerald-50/30 transition-all">
              <td className="px-8 py-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs uppercase group-hover:bg-white group-hover:shadow-sm transition-all">
                    {user.email[0]}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-700 group-hover:text-[#00796b] transition-colors">{user.email}</span>
                    <span className="text-[10px] text-gray-400 font-mono tracking-tighter uppercase">ID: {user.id.slice(0, 12)}...</span>
                  </div>
                </div>
              </td>
              <td className="px-8 py-5">
                <span className="text-xs font-semibold text-gray-500 bg-gray-100/60 px-3 py-1 rounded-lg">
                  {user.role}
                </span>
              </td>
              <td className="px-8 py-5">
                <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[11px] font-bold tracking-tight ${
                  user.is_active 
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                    : "bg-blue-50 text-blue-500 border border-blue-100"
                }`}>
                  {user.is_active ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-8 py-5 text-xs text-gray-400 font-bold whitespace-nowrap">
                {new Date(user.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.')}
              </td>
              <td className="px-8 py-5">
                <div className="flex items-center gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                  {user.role !== "Admin" && (
                    <>
                      <button onClick={() => { setEditingUser({ ...user }); setIsEditModalOpen(true); }} className="p-2 border border-emerald-500 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-all"><FaEdit size={14} /></button>
                      <button onClick={() => { setUserToDelete(user.id); setIsDeleteModalOpen(true); }} className="p-2 border border-red-500 text-red-400 bg-red-50 hover:bg-red-100 rounded-xl transition-all"><FaTrash size={14} /></button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Pagination Footer */}
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-6 bg-gray-50/30 border-t border-gray-50">
      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
        Total Records: <span className="text-slate-800">{filteredUsers.length}</span>
      </div>
      
      <div className="flex items-center gap-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="p-2 text-gray-400 hover:text-[#00796b] disabled:opacity-30 transition-all"
        >
          <HiOutlineChevronLeft size={20} />
        </button>

        <div className="flex gap-1">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                currentPage === i + 1 ? "bg-[#00796b] text-white shadow-md shadow-emerald-900/20" : "text-gray-400 hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="p-2 text-gray-400 hover:text-[#00796b] disabled:opacity-30 transition-all"
        >
          <HiOutlineChevronRight size={20} />
        </button>
      </div>
    </div>
  </div>

  {/* Refined Edit Modal */}
  {isEditModalOpen && editingUser && (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)} />
      <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10 animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
            <FaEdit size={24} />
        </div>
        <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2">Modify Member</h3>
        <p className="text-sm text-gray-400 mb-8 font-medium">Update the account identity and system role.</p>
        
        <form onSubmit={handleUpdateUser} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
            <input
              type="email"
              className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 ring-emerald-500/5 focus:border-emerald-500/50 outline-none font-bold text-slate-700"
              value={editingUser.email}
              onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">System Role</label>
            <select
              className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold text-slate-700"
              value={editingUser.role}
              onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
            >
              <option value="Student">Student</option>
              <option value="Teacher">Teacher</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="flex-1 py-4 text-xs font-black text-gray-400 uppercase tracking-widest hover:bg-gray-50 rounded-2xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-4 text-xs font-black text-white bg-slate-900 hover:bg-emerald-700 rounded-2xl shadow-xl shadow-slate-200 transition-all active:scale-95"
            >
              Update Member
            </button>
          </div>
        </form>
      </div>
    </div>
  )} 
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Confirm Deletion"
        message="Are you sure you want to remove this member? This action cannot be reversed."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteModalOpen(false)}
        confirmText="Remove User"
        type="danger"
      />
    </div>
  );
};

export default ViewUsers;
