import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api/axiosInstance";
import { toast } from "react-hot-toast";
import axios from "axios";

const ResetPass = () => {
  const { token } = useParams(); // Gets token from /reset-password/:token
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);
      const response = await api.post("/api/email/reset-password", {
        token,
        newPassword: passwords.newPassword,
      });

      if (response.status === 200) {
        toast.success("Password reset successful! Please login.");
        localStorage.removeItem("token"); 
        localStorage.clear();
        navigate("/login");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to reset password",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-slate-800">Set New Password</h2>
        <input
          type="password"
          placeholder="New Password"
          className="w-full px-4 py-2 border rounded-xl"
          onChange={(e) =>
            setPasswords({ ...passwords, newPassword: e.target.value })
          }
          required
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          className="w-full px-4 py-2 border rounded-xl"
          onChange={(e) =>
            setPasswords({ ...passwords, confirmPassword: e.target.value })
          }
          required
        />
        <button
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPass;
