import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { createUserSchema } from "../../../../../validations/adminSchema";
import api from "../../../../../api/axiosInstance";
import { HiOutlineMail,  HiOutlineUserAdd } from "react-icons/hi";

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
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-250px)] animate-in fade-in duration-500">
      
      <div className="w-full max-w-md bg-white border border-gray-100 rounded-3xl p-8 shadow-2xl shadow-slate-200/50">
        
        {/* Header Icon Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-slate-800 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-slate-200 mb-4">
            <HiOutlineUserAdd className="text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">New Membership</h2>
          <p className="text-gray-400 text-sm">Onboard a new user to the platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
              Email Address
            </label>
            <div className="relative group">
              <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-slate-800 transition-colors" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@college.edu"
                className={`w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 transition-all outline-none ${
                  errors.email 
                    ? "border-red-200 bg-red-50 focus:border-red-400" 
                    : "border-gray-50 bg-gray-50 focus:border-slate-800 focus:bg-white"
                }`}
              />
            </div>
            {errors.email && <p className="text-[11px] text-red-500 font-bold mt-1 ml-1">{errors.email}</p>}
          </div>

          {/* Role Toggle */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
              Assign Role
            </label>
            <div className="flex p-1.5 bg-gray-50 rounded-2xl border border-gray-100">
              <button
                type="button"
                onClick={() => setRole("Student")}
                className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                  role === "Student"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole("Teacher")}
                className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                  role === "Teacher"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Teacher
              </button>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-800 hover:bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-slate-200"
            >
              {loading ? "Registering..." : "Create Account"}
            </button>
            <p className="text-center text-[10px] text-gray-400 mt-6 uppercase tracking-[0.2em] font-bold">
              Secure System Authorization
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;