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
    toast.success("Please Login First.", { duration: 2000 })
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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-4"
        noValidate
      >
        <h2 className="text-2xl font-bold text-slate-800">Login</h2>

        {/* Email Input */}
        <div className="space-y-1">
          <input
            type="email"
            className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 ring-indigo-500/10"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
          {errors.email && (
            <p className="text-xs text-red-500 ml-1">{errors.email}</p>
          )}
        </div>

        {/* Password Input with Toggle */}
        <div className="space-y-1">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 ring-indigo-500/10"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
            >
              {showPassword ? (
                <HiOutlineEyeOff size={18} />
              ) : (
                <HiOutlineEye size={18} />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500 ml-1">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Forgot Password Trigger */}
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={() => handleForgotPassword()}
            className="text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:underline transition-all"
          >
            Forgot your password?
          </button>
        </div>
      </form>
      {showEmailDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-sm m-4 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              Email Required
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              We couldn't find an email in your profile. Please enter it to
              receive a reset link.
            </p>

            <input
              type="email"
              placeholder="Enter your registered email"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 ring-indigo-500/20 mb-4"
              value={manualEmail}
              onChange={(e) => setManualEmail(e.target.value)}
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowEmailDialog(false)}
                className="flex-1 px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleForgotPassword(manualEmail)}
                disabled={loading || !manualEmail}
                className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                {loading ? "Sending..." : "Send Link"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
