import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  HiOutlineBookOpen,
  HiOutlineCode,
  HiOutlineAcademicCap,
  HiOutlineUserCircle,
  HiOutlineCollection, 
  HiOutlineDocumentText,
} from "react-icons/hi";
import api from "../../../../../api/axiosInstance";
import axios from "axios";
import { createCourseSchema } from "../../../../../validations/courseSchema";

interface Teacher {
  id: string;
  teacher_name: string;
  email: string;
}

const AddCourse: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    teacher_id: "",
  });

  // Fetch teachers list to populate the dropdown for teacher_id (UUID)
useEffect(() => {
    const fetchTeachers = async () => {
      try {
        // Change from "/api/admin/users" to your new specific route
        const response = await api.get("/api/admin/teachers"); 
        
        // Ensure you are setting the array correctly based on your API response
        setTeachers(response.data.users || response.data);
      } catch (error) {
        console.error("Failed to fetch teachers", error);
      }
    };
    fetchTeachers();
  }, []);
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. DO NOT set loading to true here yet.
    
    // 2. Run the validation
    const validation = createCourseSchema.safeParse(formData);
    
    if (!validation.success) {
      const newErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        const path = issue.path[0];
        if (path) newErrors[path.toString()] = issue.message;
      });
      setErrors(newErrors);
      
      // Stop here. Because setLoading was never called, 
      // the button stays "Create Account".
      return; 
    }
    
    // 3. Validation passed: Now clear errors and start the loading state
    setErrors({});
    setLoading(true);

    try {
      const response = await api.post("/api/admin/addcourse", formData);
      if (response.status === 201 || response.status === 200) {
        toast.success("Course created successfully!");
        setFormData({ name: "", code: "", description: "", teacher_id: "" });
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
    // Access the 'message' property sent from your backend middleware or controller
    const apiMessage = error.response.data.message;
    const apiStatus = error.response.status;

    if (apiStatus === 400 && apiMessage?.includes("code already exists")) {
      toast.error("Course code already exists. Please use a different code.");
    } else {
      // Fallback to the API message, or a default string if it's missing
      toast.error(apiMessage || "Creation failed.");
    }
  } else {
    console.error("Course creation failed", error);
    toast.error("An unexpected error occurred.");
  }
    } finally {
      // 4. Always turn off loading when the API call finishes
      setLoading(false);
    }
  };
  return (
    <div className="w-full min-h-[calc(100vh-250px)] flex flex-col md:flex-row bg-gray-50/50 -m-8 p-2 md:p-4 animate-in fade-in duration-500 overflow-hidden">
      
      {/* LEFT SIDE: The Course Creation Form */}
      <div className="flex-1 flex flex-col items-start justify-center p-2 md:p-6 z-10">
        
        {/* Header Section */}
        <div className="flex items-center gap-2 mb-8 pb-2 border-b border-gray-100 w-full max-w-2xl">
          <div className="p-3 bg-white text-[#00796b] rounded-2xl shadow-inner border border-teal-100">
            <HiOutlineBookOpen className="text-2xl" />
          </div>
          <div>
            <nav className="flex items-center gap-2 text-xs font-semibold text-gray-400 mb-1 tracking-wider uppercase">
              <span>Management</span> / <span>Curriculum</span>
            </nav>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Academic Launchpad</h1>
          </div>
        </div>

        {/* Form Container - Sized to ~60% of vertical space via padding/margins */}
        <div className="w-full max-w-2xl bg-white border border-gray-100 rounded-[2rem] p-2 md:p-4 shadow-2xl shadow-teal-100/20">
          
          <div className="mb-2">
            <h2 className="text-2xl font-bold text-slate-800">Create New Course</h2>
            <p className="text-gray-400 text-sm mt-1">Define educational objectives and assign academic leads</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Course Name */}
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ">Course Identity</label>
                <div className="relative group">
                  <HiOutlineAcademicCap className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00796b] transition-colors" />
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Quantum Computing"
                    className={`w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 transition-all outline-none ${
                      errors.name ? "border-red-200 bg-red-50" : "border-gray-50 bg-gray-50 focus:border-[#00796b] focus:bg-white"
                    }`}
                  />
                </div>
                {errors.name && <p className="text-[11px] text-red-500 font-bold mt-1 ml-1">{errors.name}</p>}
              </div>

              {/* Course Code */}
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Index Code</label>
                <div className="relative group">
                  <HiOutlineCode className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00796b] transition-colors" />
                  <input
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="CS-2024"
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:border-[#00796b] focus:bg-white outline-none transition-all"
                  />
                </div>
                {errors.code && <p className="text-[11px] text-red-500 font-bold mt-1 ml-1">{errors.code}</p>}
              </div>
            </div>

            {/* Teacher Selection */}
            <div className="space-y-1">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Academic Lead</label>
              <div className="relative group">
                <HiOutlineUserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00796b] transition-colors z-10" />
                <select
                  name="teacher_id"
                  value={formData.teacher_id}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:border-[#00796b] focus:bg-white outline-none transition-all appearance-none cursor-pointer font-medium text-slate-700"
                >
                  <option value="">Select a Teacher</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>{t.teacher_name || "Faculty Member"}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Syllabus Overview</label>
              <div className="relative group">
                <HiOutlineDocumentText className="absolute left-4 top-4 text-gray-400 group-focus-within:text-[#00796b] transition-colors" />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Outline the core learning outcomes..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:border-[#00796b] focus:bg-white outline-none transition-all resize-none font-medium"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#00796b] hover:bg-[#004d40] text-white py-4 rounded-2xl font-bold text-lg transition-all active:scale-[0.98] shadow-xl shadow-teal-100"
              >
                {loading ? "Processing..." : "Deploy Course"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE: Visualizing Element */}
      <div className="flex-1 min-h-[350px] relative flex items-center justify-center p-4 bg-white/20 backdrop-blur-md rounded-[3rem] border border-white shadow-inner md:-ml-12">
        <div className="relative w-full max-w-md animate-float">
            
          {/* Abstract SVG Curriculum Map */}
          <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-2xl">
            <rect x="130" y="130" width="140" height="140" rx="30" fill="white" className="stroke-[#00796b] stroke-[4]" />
            <HiOutlineCollection x="175" y="175" className="text-5xl text-teal-600 opacity-30" />
            
            {/* Flow lines */}
            <circle cx="200" cy="50" r="15" fill="#80cbc4" className="animate-pulse" />
            <path d="M200 65 V130" stroke="#b2dfdb" strokeWidth="4" strokeDasharray="8" />
            
            <circle cx="50" cy="200" r="15" fill="#4db6ac" className="animate-pulse delay-75" />
            <path d="M65 200 H130" stroke="#b2dfdb" strokeWidth="4" strokeDasharray="8" />
            
            <circle cx="350" cy="200" r="15" fill="#26a69a" className="animate-pulse delay-150" />
            <path d="M270 200 H335" stroke="#b2dfdb" strokeWidth="4" strokeDasharray="8" />
            
            {/* Rotating orbits */}
            <circle cx="200" cy="200" r="160" fill="none" stroke="#e0f2f1" strokeWidth="2" strokeDasharray="10 20" className="animate-spin-slow" />
            <circle cx="200" cy="200" r="120" fill="none" stroke="#b2dfdb" strokeWidth="1" strokeDasharray="5 15" className="animate-spin-reverse-slow" />
          </svg>

          {/* Floaty label */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl border border-teal-50">
            <span className="text-[#00796b] font-black text-xs uppercase tracking-[0.3em]">Module Sync</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
