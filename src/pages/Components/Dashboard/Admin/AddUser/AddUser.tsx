import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { createUserSchema } from "../../../../../validations/adminSchema";
import api from "../../../../../api/axiosInstance";
import { HiOutlineMail,  HiOutlineUserAdd ,
  HiOutlineSparkles, HiOutlineShieldCheck 
 } from "react-icons/hi";

const AddUser: React.FC = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Student");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentData = { email, role };

    const validation = createUserSchema.safeParse(currentData);
    if (!validation.success) {
      const newErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        const path = issue.path[0];
        if (path) newErrors[path.toString()] = issue.message;
      });
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await api.post("/api/admin/adduser", currentData);
      if (response.status === 201) {
        toast.success(response.data.message || "User added successfully!");
        setEmail("");
        setRole("Student");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Creation failed.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    /* h-[calc(100vh-200px)] handles the "remaining height" 
       by subtracting the approximate height of the Header and Tabs 
    */
  <div className="w-full min-h-60 flex flex-col md:flex-row bg-gray-50/50 -m-8 p-2 md:p-4 animate-in fade-in duration-500 overflow-hidden">
      
      {/* LEFT SIDE: The Onboarding Form */}
      <div className="flex-1 flex flex-col items-start justify-center p-2 md:p-6 z-10">
        
        {/* Breadcrumb / Status Header */}
        <div className="flex items-center gap-3 mb-2 pb-2 border-b border-gray-100 w-full max-w-xl">
          <div className="p-3 bg-white text-[#00796b] rounded-2xl shadow-inner border border-teal-100">
            <HiOutlineUserAdd className="text-2xl" />
          </div>
          <div>
            <nav className="flex items-center gap-2 text-xs font-semibold text-gray-400 mb-1 tracking-wider uppercase">
              <span>Authorization</span> / <span>Membership</span>
            </nav>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">System Onboarding Portal</h1>
          </div>
        </div>

        {/* The Actual Form Container */}
        <div className="w-full max-w-xl bg-white border border-gray-100 rounded-[2rem] p-8 md:p-10 shadow-2xl shadow-teal-100/30">
          
          <div className="flex flex-col items-start mb-4 space-y-1">
            <h2 className="text-2xl font-bold text-slate-800">Initialize New Account</h2>
            <p className="text-gray-400 text-sm mt-1">Configure security credentials and access level for the new user</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2" noValidate>
            
            {/* Email Input */}
            <div className="space-y-0">
              <label htmlFor="email" className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                University Email Address
              </label>
              <div className="relative group">
                <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00796b] transition-colors" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@college.edu"
                  className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 transition-all outline-none text-base font-medium ${
                    errors.email 
                      ? "border-red-200 bg-red-50 focus:border-red-400 focus:ring-4 focus:ring-red-100" 
                      : "border-gray-50 bg-gray-50 focus:border-[#00796b] focus:bg-white focus:ring-4 focus:ring-teal-100/50"
                  }`}
                />
              </div>
              {errors.email && <p className="text-[11px] text-red-500 font-bold mt-1 ml-1">{errors.email}</p>}
            </div>

            {/* Role Segmented Control (Toggle) */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                Access Authorization Level
              </label>
              <div className="flex p-2 bg-gray-50 rounded-[1.25rem] border border-gray-100">
                {["Student", "Teacher"].map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-bold transition-all ${
                      role === r
                        ? "bg-white text-[#00796b] shadow-lg shadow-teal-100/40 text-base"
                        : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {r === "Teacher" ? <HiOutlineShieldCheck className="text-lg"/> : <HiOutlineSparkles className="text-lg"/>}
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#00796b] hover:bg-[#004d40] text-white py-4.5 rounded-[1.25rem] font-bold text-lg transition-all active:scale-[0.98] disabled:opacity-50 shadow-xl shadow-teal-200"
              >
                {loading ? "Authorizing Identity..." : "Grant Secure Access"}
              </button>
               
            </div>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE: Animated SVG Visualization Element */}
      <div className="flex-1 min-h-[400px] relative flex items-center justify-center p-12 overflow-hidden bg-white/30 backdrop-blur-sm rounded-[3rem] border border-gray-100 shadow-inner md:-ml-12 md:mt-0 mt-10">
        
        {/* Placeholder for the Animated SVG Illustration */}
        <div className="w-full h-full max-w-lg max-h-[500px] animate-float relative z-10 flex items-center justify-center">
          <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#00796b]">
            <defs>
              <linearGradient id="tealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#00796b", stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: "#e0f2f1", stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            
            {/* Main Central Hub (Moving) */}
            <rect x="180" y="180" width="140" height="140" rx="30" className="fill-white stroke-tealGrad stroke-[6]" />
            <HiOutlineUserAdd x="225" y="225" className="text-5xl opacity-40" />

            {/* Connections and Dots (Animated) */}
            <circle cx="250" cy="80" r="10" className="fill-teal-300 animate-pulse delay-75" />
            <line x1="250" y1="90" x2="250" y2="180" className="stroke-teal-200 stroke-[4] stroke-dasharray-[8]" />

            <circle cx="80" cy="250" r="10" className="fill-teal-300 animate-pulse delay-200" />
            <line x1="90" y1="250" x2="180" y2="250" className="stroke-teal-200 stroke-[4] stroke-dasharray-[8]" />

            <circle cx="420" cy="250" r="10" className="fill-teal-300 animate-pulse delay-150" />
            <line x1="320" y1="250" x2="410" y2="250" className="stroke-teal-200 stroke-[4] stroke-dasharray-[8]" />
            
            <circle cx="250" cy="420" r="10" className="fill-teal-300 animate-pulse delay-300" />
            <line x1="250" y1="320" x2="250" y2="410" className="stroke-teal-200 stroke-[4] stroke-dasharray-[8]" />

            {/* Rotating Outer Rings */}
            <circle cx="250" cy="250" r="190" className="fill-none stroke-teal-100 stroke-[3] opacity-50 stroke-dasharray-[10,20] animate-spin-slow" />
            <circle cx="250" cy="250" r="230" className="fill-none stroke-teal-50 stroke-[2] opacity-30 stroke-dasharray-[5,10] animate-spin-reverse-slow" />
          </svg>
        </div>

        {/* Decorative Background Blur */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-teal-100 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-20 -left-20 w-60 h-60 bg-teal-100/50 rounded-full blur-3xl opacity-40"></div>
      </div>
    </div> 
  );
};

export default AddUser;