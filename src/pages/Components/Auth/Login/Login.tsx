import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { loginSchema } from "../../../../validations/authSchema";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import api from "../../../../api/axiosInstance";
import toast from "react-hot-toast";
import axios from "axios"; 

const Login: React.FC = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  useEffect(() => { 
        if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
    // DO NOT add an 'else' that navigates to /login here
  }, [navigate]);

  useEffect(() => {
    if (loading) {
      toast.loading("Logging in...", { id: "loginToast" });
    } else {
      // This removes the loading toast as soon as loading is false
      toast.dismiss("loginToast");
    }
  }, [loading]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = loginSchema.safeParse(formData);
    if (!validation.success) {
      const newErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        const path = issue.path[0];
        if (path) newErrors[path.toString()] = issue.message;
      });
      setErrors(newErrors);
      return;
    }

    const toastId = "login-action"; // Unique ID for updating the same toast

    try {
      setLoading(true);
      toast.loading("Authenticating...", { id: toastId });

      // Switched to api.post for consistency
      const response = await api.post("/api/auth/login", formData);

      if (response.status === 200) {
        const data = response.data;
        toast.success(`Welcome back, ${data.user.email}!`, { id: toastId });

        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("userRole", data.user.role);

        navigate("/dashboard");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const msg = error.response?.data?.message || "Login failed";
        toast.error(msg, { id: toastId });
      } else {
        toast.error("An unexpected error occurred", { id: toastId });
      }
    } finally {
      setLoading(false);
    }
  };

  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [manualEmail, setManualEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleForgotPassword = async (e?: React.MouseEvent | string) => {
    const emailToVerify = typeof e === "string" ? e : formData.email;

    // 1. Check if email exists
    if (!emailToVerify) {
      setShowEmailDialog(true);
      return;
    }

    // 2. Email Validation (Regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailToVerify)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    const toastId = "forgot-pass-action";

    try {
      setLoading(true);
      toast.loading("Sending reset link...", { id: toastId });

      const response = await api.post("/api/email/forgot-password", {
        email: emailToVerify,
      });

      if (response.status === 200) {
        toast.success("Reset link sent successfully!", { id: toastId });
        setShowEmailDialog(false);
        setManualEmail(""); // Clear input on success
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const msg = error.response?.data?.message || "Email not found.";
        toast.error(msg, { id: toastId });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4 relative overflow-hidden perspective-1000">
  
  {/* --- 3D BACKGROUND ELEMENTS --- */}
  {/* Floating Glassmorphic Ring */}
  <div className="absolute top-[-10%] left-[-5%] w-96 h-96 border-[40px] border-teal-500/5 rounded-full animate-pulse pointer-events-none" style={{ transform: 'rotateX(45deg) rotateY(-20deg) translateZ(-100px)' }} />
  
  {/* Floating 3D Cube SVG */}
  <div className="absolute bottom-[15%] right-[10%] opacity-20 animate-bounce duration-[6000ms] pointer-events-none">
    <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#00796b" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotateX(15deg) rotateY(30deg)' }}>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
      <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
  </div>

  {/* --- LOGIN FORM WITH 3D TILT EFFECT --- */}
  <form
    onSubmit={handleLogin}
    className="relative bg-white p-10 rounded-[2.5rem] shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff] w-full max-w-md space-y-6 animate-in fade-in zoom-in duration-500 border border-white/50"
    noValidate
    style={{ transform: 'rotateX(2deg) rotateY(-1deg)' }}
  >
    {/* Decorative Top Bar */}
    <div className="absolute top-0 left-0 w-full h-2 bg-[#00796b] rounded-t-[2.5rem]" />

    <div className="space-y-1 mb-8">
      <nav className="text-[10px] font-black text-[#00796b] uppercase tracking-[0.3em] mb-2">System Authentication</nav>
      <h2 className="text-4xl font-black text-slate-800 tracking-tighter">Login</h2>
      <p className="text-xs text-slate-400 font-medium">Authorized Personnel Registry Access</p>
    </div>

    {/* Email Input */}
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Registry Email</label>
      <div className="relative group">
        <input
          type="email"
          className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-[#00796b] focus:bg-white transition-all font-bold text-slate-700 shadow-inner"
          placeholder="name@modern.edu"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      {errors.email && <p className="text-[10px] text-red-500 font-bold ml-1 uppercase">{errors.email}</p>}
    </div>

    {/* Password Input */}
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Key</label>
      <div className="relative group">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-[#00796b] focus:bg-white transition-all font-bold text-slate-700 shadow-inner"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-[#00796b] transition-colors"
        >
          {showPassword ? <HiOutlineEyeOff size={20} /> : <HiOutlineEye size={20} />}
        </button>
      </div>
      {errors.password && <p className="text-[10px] text-red-500 font-bold ml-1 uppercase">{errors.password}</p>}
    </div>

    <button
      type="submit"
      disabled={loading}
      className="w-full bg-[#00796b] hover:bg-[#004d40] text-white py-4.5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all shadow-xl shadow-teal-100 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Verifying...
        </>
      ) : "Authorize Access"}
    </button>

    <div className="flex justify-center pt-4 border-t border-slate-50">
      <button
        type="button"
        onClick={() => handleForgotPassword()}
        className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#00796b] transition-all"
      >
        Request Credential Recovery?
      </button>
    </div>
  </form>

  {/* --- EMAIl DIALOG MODAL --- */}
  {showEmailDialog && (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#004d40]/30 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md m-4 animate-in zoom-in-95 duration-200 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-amber-400" />
        <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2">Identification Required</h3>
        <p className="text-sm text-slate-400 font-medium mb-6">
          System registry requires a verified email node to transmit recovery protocols.
        </p>

        <input
          type="email"
          placeholder="Enter Registry Email"
          className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-amber-400 transition-all font-bold text-slate-700 mb-6"
          value={manualEmail}
          onChange={(e) => setManualEmail(e.target.value)}
        />

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setShowEmailDialog(false)}
            className="flex-1 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all"
          >
            Abort
          </button>
          <button
            onClick={() => handleForgotPassword(manualEmail)}
            disabled={loading || !manualEmail}
            className="flex-1 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white bg-[#00796b] rounded-2xl hover:bg-[#004d40] shadow-lg shadow-teal-100 transition-all disabled:opacity-50"
          >
            Dispatch Link
          </button>
        </div>
      </div>
    </div>
  )}

  {/* System Version Footer */}
  <div className="absolute bottom-6 text-[9px] font-black text-slate-300 uppercase tracking-[0.4em] pointer-events-none">
    Unified Security Gateway v4.2.0 • Modern ERP
  </div>
</div>
  );
};

export default Login;
