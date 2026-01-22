import React, { useEffect, useState } from "react";
import api from "../../../../../api/axiosInstance";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-hot-toast";
import axios from "axios";
import ConfirmationModal from "../../../Modal/confirmationModal";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const ViewUsers: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/admin/users");

      if (response.data && Array.isArray(response.data.users)) {
        setUsers(response.data.users);
      } else if (Array.isArray(response.data)) {
        setUsers(response.data);
      }
      toast.success("Users fetched successfully");
    } catch (error) {
      toast.error("Failed to fetch users");
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setUserToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      const response = await api.delete(`/api/admin/users/${userToDelete}`);
      if (response.status === 200) {
        toast.success("User deleted successfully");
        setUsers(users.filter((user) => user.id !== userToDelete));
      }
    } catch (error: unknown) {
      let msg = "Delete failed";
      if (axios.isAxiosError(error)) {
        msg = error.response?.data?.message || msg;
      } else if (error instanceof Error) {
        msg = error.message;
      }
      toast.error(msg);
    } finally {
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  const handleEditClick = (user: User) => {
    setEditingUser({ ...user }); // Create a copy to avoid direct state mutation
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const response = await api.put(`/api/admin/users/${editingUser.id}`, {
        email: editingUser.email.toLowerCase().trim(),
        role: editingUser.role,
      });

      if (response.status === 200) {
        toast.success("User updated successfully");
        setUsers(users.map((u) => (u.id === editingUser.id ? editingUser : u)));
        setIsEditModalOpen(false);
      }
    } catch (error: unknown) {
      let msg = "Update failed";
      if (axios.isAxiosError(error)) {
        msg = error.response?.data?.message || msg;
      } else if (error instanceof Error) {
        msg = error.message;
      }
      toast.error(msg);
    }
  };

  if (loading)
    return (
      <div className="p-6 text-center font-semibold">Loading users...</div>
    );

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Total Users ({users.length})
        </h2>

        <button
          onClick={() => navigate("/dashboard/admin")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Back to Admin
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-100 shadow-sm">
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50">
      <tr>
        {["Email", "Role", "Status", "Created At", "Updated At", "Actions"].map((header) => (
          <th key={header} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {header}
          </th>
        ))}
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-100">
      {users.map((user) => (
        <tr key={user.id} className="hover:bg-blue-50/30 transition-colors duration-150">
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.email}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
            <span className="bg-gray-100 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase">
              {user.role}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
              user.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${user.is_active ? "bg-green-500" : "bg-red-500"}`}></span>
              {user.is_active ? "Active" : "Inactive"}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {new Date(user.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 italic">
            {user.updated_at ? new Date(user.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <div className="flex items-center space-x-3">
              <button onClick={() => handleEditClick(user)} className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
                <FaEdit size={16} />
              </button>
              <button onClick={() => handleDeleteClick(user.id)} className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-600 hover:text-white transition-all">
                <FaTrash size={16} />
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
{isEditModalOpen && editingUser && (
  <div className="fixed inset-0 z-100 flex items-center justify-center overflow-y-auto outline-none focus:outline-none">
    {/* Overlay */}
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsEditModalOpen(false)}></div>
    
    {/* Modal Card */}
    <div className="relative w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8 transform transition-all">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Edit User Details</h3>
        <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
      </div>
      
      <form onSubmit={handleUpdateUser} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Primary Email</label>
          <input
            type="email"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
            value={editingUser.email}
            onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Institutional Role</label>
          <div className="relative">
            <select
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none appearance-none"
              value={editingUser.role}
              onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
            >
              <option value="Student">Student</option>
              <option value="Teacher">Teacher</option>
              <option value="Admin">Admin</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
              ▼
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4 pt-4">
          <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 px-6 py-3 font-bold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition">
            Dismiss
          </button>
          <button type="submit" className="flex-1 px-6 py-3 font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition active:scale-95">
            Save Profile
          </button>
        </div>
      </form>
    </div>
  </div>
)}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Confirm Deletion"
        message="Are you sure you want to delete this user? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteModalOpen(false)}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default ViewUsers;
