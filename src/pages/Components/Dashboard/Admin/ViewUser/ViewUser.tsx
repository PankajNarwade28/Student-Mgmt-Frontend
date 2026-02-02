import React, { useEffect, useState } from "react";
import api from "../../../../../api/axiosInstance";
import { FaEdit, FaTrash } from "react-icons/fa";
import { HiOutlineUsers, HiOutlineSearch } from "react-icons/hi";
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
  const limit = Number.parseInt(import.meta.env.PAGINATION_LIMIT) || 5; // Default to 5 if not set

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
    <div className="animate-in fade-in duration-500 space-y-6">
      <div className="space-y-6">
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center justify-between w-full md:w-auto">
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-2">
              <HiOutlineUsers className="text-slate-400" />
              User Directory
            </h2>
            <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-md md:static">
              {users.length} Total
            </span>
          </div>

          <div className="relative w-full md:w-72">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 ring-slate-800/5 outline-none transition-all text-sm"
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          {/* MOBILE VIEW (Cards) - Visible only on small screens */}
          <div className="md:hidden divide-y divide-gray-100">
            {filteredUsers.map((user) => (
              <div key={user.id} className="p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-800 break-all">
                      {user.email}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono uppercase">
                      ID: {user.id.slice(0, 8)}...
                    </span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase shrink-0 ${
                      user.role === "Admin"
                        ? "bg-purple-50 text-purple-600"
                        : "bg-blue-50 text-blue-600"
                    }`}
                  >
                    {user.role}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${user.is_active ? "bg-emerald-500" : "bg-red-500"}`}
                      />
                      <span className="text-xs font-medium text-gray-600">
                        {user.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-400">
                      Joined: {new Date(user.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* The condition below now wraps BOTH buttons */}
                    {user.role !== "Admin" && (
                      <>
                        <button
                          onClick={() => {
                            setEditingUser({ ...user });
                            setIsEditModalOpen(true);
                          }}
                          className="p-2 text-blue-400 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <FaEdit size={16} />
                        </button>

                        <button
                          onClick={() => {
                            setUserToDelete(user.id);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-2 text-red-300 bg-red-50 rounded-lg hover:text-red-600 hover:bg-red-100 transition-colors"
                        >
                          <FaTrash size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP VIEW (Table) - Hidden on small screens */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  {["Member", "Role", "Status", "Joined", "Actions"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-800">
                        {user.email}
                      </p>
                      <p className="text-[10px] text-gray-400 font-mono">
                        {user.id.slice(0, 8)}...
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase ${
                          user.role === "Admin"
                            ? "bg-purple-50 text-purple-600"
                            : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${user.is_active ? "bg-emerald-500" : "bg-red-500"}`}
                        />
                        <span className="text-xs font-medium text-gray-600">
                          {user.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 font-medium whitespace-nowrap">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {/* The condition below now wraps BOTH buttons */}
                        {user.role !== "Admin" && (
                          <>
                            <button
                              onClick={() => {
                                setEditingUser({ ...user });
                                setIsEditModalOpen(true);
                              }}
                              className="p-2 text-blue-400 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                            >
                              <FaEdit size={16} />
                            </button>

                            <button
                              onClick={() => {
                                setUserToDelete(user.id);
                                setIsDeleteModalOpen(true);
                              }}
                              className="p-2 text-red-300 bg-red-50 rounded-lg hover:text-red-600 hover:bg-red-100 transition-colors"
                            >
                              <FaTrash size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="p-12 text-center text-gray-400 text-sm">
              No users found matching your search.
            </div>
          )}
        </div>
        <div className="flex justify-between items-center p-4 bg-white border-t border-gray-100">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && editingUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsEditModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-800 mb-6">
              Modify Member
            </h3>
            <form onSubmit={handleUpdateUser} className="space-y-5">
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="text-xs font-bold text-gray-400 uppercase tracking-wider"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 ring-slate-800/5 outline-none"
                  value={editingUser.email}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="role"
                  className="text-xs font-bold text-gray-400 uppercase tracking-wider"
                >
                  System Role
                </label>
                <select
                  id="role"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none"
                  value={editingUser.role}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, role: e.target.value })
                  }
                >
                  <option value="Student">Student</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-3 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 text-sm font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-xl shadow-lg shadow-slate-200 transition-all"
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
