import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  HiOutlineBookOpen,
  HiOutlineCode,
  HiOutlineUserCircle,
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

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   const validation = createCourseSchema.safeParse(formData);
  //       if (!validation.success) {
  //         const newErrors: Record<string, string> = {};
  //         validation.error.issues.forEach((issue) => {
  //           const path = issue.path[0];
  //           if (path) newErrors[path.toString()] = issue.message;
  //         });
  //         setErrors(newErrors);
  //         return;
  //       }
    
  //       setErrors({});
  //       setLoading(true);
  //   try {
  //     const response = await api.post("/api/admin/addcourse", formData);
  //     if (response.status === 201 || response.status === 200) {
  //       toast.success("Course created successfully!");
  //       setFormData({ name: "", code: "", description: "", teacher_id: "" });
  //     }
  //   } catch (error) {
  //     if (axios.isAxiosError(error) && error.response?.status === 400) {
  //       toast.error("Course code already exists. Please use a different code.");
  //     } else {
  //       console.error("Course creation failed", error);
  //       toast.error("Failed to create course");
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-250px)] animate-in fade-in duration-500">
      <div className="w-full max-w-2xl bg-white border border-gray-100 rounded-3xl p-8 shadow-2xl shadow-slate-200/50">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-slate-800 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-slate-200 mb-4">
            <HiOutlineBookOpen className="text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">
            Create New Course
          </h2>
          <p className="text-gray-400 text-sm">
            Define course details and assign a teacher
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Course Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                Course Name
              </label>
              <div className="relative group">
                <HiOutlineBookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-slate-800 transition-colors" />
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Web Development"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:border-slate-800 focus:bg-white outline-none transition-all"
                  required
                />
              </div>
                 {errors.name && <p className="text-[11px] text-red-500 font-bold mt-1 ml-1">{errors.name}</p>}
         
            </div>

            {/* Course Code */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                Course Code
              </label>
              <div className="relative group">
                <HiOutlineCode className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-slate-800 transition-colors" />
                <input
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="e.g. CS101"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:border-slate-800 focus:bg-white outline-none transition-all"
                  required
                />
              </div>
         
            </div>
                 {errors.code && <p className="text-[11px] text-red-500 font-bold mt-1 ml-1">{errors.code}</p>}
          </div>

          {/* Assigned Teacher (UUID selection) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
              Assign Teacher
            </label>
            <div className="relative group">
              <HiOutlineUserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-slate-800 transition-colors z-10" />
              <select
                name="teacher_id"
                value={formData.teacher_id}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:border-slate-800 focus:bg-white outline-none transition-all appearance-none cursor-pointer"
                required
              >
                <option value="">Select a Teacher</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.teacher_name || t.id}
                  </option>
                ))}
              </select>
            </div>
                 {errors.teacher_id && <p className="text-[11px] text-red-500 font-bold mt-1 ml-1">{errors.teacher_id}</p>}
          </div>

          {/* Description (Text Area) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
              Description
            </label>
            <div className="relative group">
              <HiOutlineDocumentText className="absolute left-4 top-4 text-gray-400 group-focus-within:text-slate-800 transition-colors" />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Briefly describe the course objectives..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:border-slate-800 focus:bg-white outline-none transition-all resize-none"
              />
            </div>
                  {errors.description && <p className="text-[11px] text-red-500 font-bold mt-1 ml-1">{errors.description}</p>}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-800 hover:bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-slate-200"
            >
              {loading ? "Creating..." : "Launch Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourse;
