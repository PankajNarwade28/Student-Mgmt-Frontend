import React, { useEffect, useState } from "react";
import api from "../../../../../api/axiosInstance";
import { toast } from "react-hot-toast";

interface User {
  id: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

const ViewUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

 const fetchUsers = async () => {
  try {
    setLoading(true);
    const response = await api.get("/api/admin/users");
    console.log("Backend Response:", response.data); // DEBUG THIS

    // Ensure you are accessing the correct property
    if (response.data && Array.isArray(response.data.users)) {
      setUsers(response.data.users);
    } else if (Array.isArray(response.data)) {
      // If your backend returns a direct array
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

  if (loading) return <div className="p-6 text-center">Loading users...</div>;

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Total Users ({users.length})</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Role</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Created At</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="p-3 border">{user.email}</td>
                <td className="p-3 border">{user.role}</td>
                <td className="p-3 border">
                  <span className={`px-2 py-1 rounded text-xs ${user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {user.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="p-3 border">{new Date(user.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewUsers;