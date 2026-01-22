import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { createUserSchema } from "../../../../../validations/adminSchema";
import api from "../../../../../api/axiosInstance"; 
const AddUser: React.FC = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Student");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    email: "",
    role: "Student",
  });

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setFormData({ email, role });

//     // 1. Zod Client-side Validation (using your reference pattern)
//     const validation = createUserSchema.safeParse(formData);

//     if (!validation.success) {
//       const newErrors: Record<string, string> = {};
//       validation.error.issues.forEach((issue) => {
//         const path = issue.path[0];
//         if (path) {
//           newErrors[path.toString()] = issue.message;
//         }
//       });
//       setErrors(newErrors);
//       return;
//     }

//     // 2. API Request
//     try {
//       console.log("Form Data being sent:", formData , loading);
//       setLoading(true);
//       // const response = await axios.post(`${API_URL}/api/admin/adduser`, formData);
//       // const response = await api.post('/api/admin/adduser', formData);
//       // const response = await api.post("/api/admin/adduser", formData);
//       // Your interceptor does this automatically behind the scenes:
// const response = await api.post("/api/admin/adduser", formData, {
//   headers: {
//     Authorization: `Bearer ${localStorage.getItem('token')}`
//   }
// });
//       if (response.status === 201) {
//         toast.success(response.data.message || "User added successfully!");

//         // Reset form (Reference pattern)
//         setFormData({ email: "", role: "Student" });
//         setErrors({});

//         // Optional: redirect to a dashboard or list
//         // navigate("/admin/users");
//       }
//     } catch (error) {
//       // 3. Error Handling (using your reference pattern)
//       setLoading(false);
//       setErrors({});
//       if (axios.isAxiosError(error) && error.response) {
//         console.log(errors);
//         const serverMessage = error.response.data.message;
//         toast.error(serverMessage || "Creation failed. Please try again.");
//       } else if (axios.isAxiosError(error) && error.request) {
//         toast.error("No response from server. Check your connection.");
//       } else {
//         toast.error("An unexpected error occurred.");
//       }
//       console.error("User Creation Error:", error);
//     } finally {
//       // Any cleanup actions if necessary
//       setFormData({ email: "", role: "Student" });
//       // setErrors({});
//       setLoading(false);
//     }
//   };

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
    console.log("Form Data being sent:", formData , loading);
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Add New User
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter email address"
            />
          </div>
          {errors.email && <span className="error-text">{errors.email}</span>}
          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="Student">Student</option>
              <option value="Teacher">Teacher</option>
            </select>
          </div>
          {errors.role && <span className="error-text">{errors.role}</span>}

          {/* Submit */}
          <button 
  type="submit"
  disabled={loading} // Prevent double clicks
  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition duration-200 disabled:bg-blue-400"
>
  {loading ? "Adding User..." : "Add User"}
</button>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
