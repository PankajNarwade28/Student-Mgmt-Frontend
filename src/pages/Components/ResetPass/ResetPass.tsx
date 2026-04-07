import React, { useEffect, useState } from "react";
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
  const [validating ,setIsValidating] =useState(false);

  useEffect(() => {
        const checkToken = async () => {
            try {
                // Call a verification endpoint (you need to create this)
                await api.get(`/api/email/verify-token/${token}`);
                setIsValidating(false); // Token is good, show the form
            } catch (error) {
                // If 401 (invalid/expired/used), redirect to login
                if(axios.isAxiosError(error) && error.response?.status === 401) {
                    toast.error("This link is invalid or has expired. Please request a new one.");
                }
                toast.error("This link is invalid or has already been used.");
                navigate("/login"); 
            }
        };

        if (token) checkToken();
    }, [token, navigate]);

    if (validating) return <div className="text-center mt-20">Verifying link...</div>;

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
        const data = response.data;
        toast.success(data.message);
        navigate("/auth/login");

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
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] relative overflow-hidden animate-in fade-in duration-500">
  {/* Decorative Background Watermark */}
  <div className="absolute top-0 right-0 opacity-[0.03] pointer-events-none translate-x-1/4 -translate-y-1/4">
    <svg width="600" height="600" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="40" stroke="#00796b" fill="none" strokeWidth="0.5" strokeDasharray="2 2" />
    </svg>
  </div>

  <div className="w-full max-w-md px-4 relative z-10">
    {/* Form Container */}
    <form
      onSubmit={handleSubmit}
      className="bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,121,107,0.1)] border border-slate-50 space-y-6 relative overflow-hidden"
    >
      {/* Top Accent Bar */}
      <div className="absolute top-0 left-0 w-full h-2 bg-[#00796b]" />

      <div className="space-y-1 mb-8 text-center sm:text-left">
        <nav className="text-[10px] font-black text-[#00796b] uppercase tracking-[0.3em] mb-2">
          Security Protocol
        </nav>
        <h2 className="text-3xl font-black text-slate-800 tracking-tighter">
          Set New Password
        </h2>
        <p className="text-xs text-slate-400 font-medium">
          Establish authorized access credentials for your registry node.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
            New Secure Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-[#00796b] focus:bg-white transition-all font-bold text-slate-700"
            onChange={(e) =>
              setPasswords({ ...passwords, newPassword: e.target.value })
            }
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Confirm Entry
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-[#00796b] focus:bg-white transition-all font-bold text-slate-700"
            onChange={(e) =>
              setPasswords({ ...passwords, confirmPassword: e.target.value })
            }
            required
          />
        </div>
      </div>

      <button
        disabled={loading}
        className={`w-full py-4.5 mt-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-2 ${
          loading 
            ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
            : "bg-[#00796b] text-white hover:bg-[#004d40] shadow-teal-100"
        }`}
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin" />
            Updating Registry...
          </>
        ) : (
          "Authorize Update"
        )}
      </button>

      <div className="pt-4 text-center">
        <p className="text-[9px] text-slate-300 font-black uppercase tracking-[0.2em]">
          Modern ERP System Security Audit v4.2.0
        </p>
      </div>
    </form>
  </div>
</div>
  );
};

export default ResetPass;
