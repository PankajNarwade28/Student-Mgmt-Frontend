import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { createUserSchema } from "../../../../../validations/adminSchema";
import api from "../../../../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
const AddUser: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Student");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    email: "",
    role: "Student",
  });
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create the data object directly to ensure validation uses current values
    const currentData = { email, role };
    setFormData(currentData);

    // 1. Validate using the fresh object, not the state variable
    const validation = createUserSchema.safeParse(currentData);

    if (!validation.success) {
      const newErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        const path = issue.path[0];
        if (path) newErrors[path.toString()] = issue.message;
      });
      setErrors(newErrors);
      return; // Stop here if validation fails
    }

    // Clear previous errors before starting the API call
    setErrors({});

    setLoading(true);

    // 2. API Request
    try {
      console.log("Form Data being sent:", formData, loading);
      const response = await api.post("/api/admin/adduser", currentData);

      if (response.status === 201) {
        toast.success(response.data.message || "User added successfully!");
        // Reset local inputs
        setEmail("");
        setRole("Student");
        setFormData({ email: "", role: "Student" });
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const serverMessage = error.response.data.message;
        toast.error(serverMessage || "Creation failed.");
      } else {
        toast.error("An unexpected error occurred.");
      }
      console.error("User Creation Error:", error);
    } finally {
      // Only turn off loading when the request is actually finished
      setFormData({ email: "", role: "Student" });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      {/* Header Section: Now properly aligned above the card */}
      <div className="w-full max-w-md flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            User Management
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Add a new student or teacher account
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard/admin")}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back
        </button>
      </div>

      {/* Main Form Card */}
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8 border border-gray-100">
        <div className="mb-8 text-center">
          <div className="mx-auto w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-200">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800">Account Details</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Email Input Group */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`w-full pl-4 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                  errors.email
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 shadow-sm"
                }`}
                placeholder="example@college.edu"
              />
            </div>
            {errors.email && (
              <p className="mt-2 text-xs font-medium text-red-500 flex items-center">
                <span className="mr-1">⚠️</span> {errors.email}
              </p>
            )}
          </div>

          {/* Role Select Group */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Assign Role
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole("Student")}
                className={`py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                  role === "Student"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-100 text-gray-500 hover:border-gray-200"
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole("Teacher")}
                className={`py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                  role === "Teacher"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-100 text-gray-500 hover:border-gray-200"
                }`}
              >
                Teacher
              </button>
            </div>
            {errors.role && (
              <p className="mt-2 text-xs font-medium text-red-500">
                {errors.role}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-100 active:scale-[0.98] transition-all disabled:bg-blue-300 disabled:shadow-none"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Register User"
              )}
            </button>
            <p className="text-center text-xs text-gray-400 mt-4 uppercase tracking-widest font-semibold">
              Secure Admin Portal
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
