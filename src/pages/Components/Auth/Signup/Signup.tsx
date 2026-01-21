import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Auth.css";
import { signupSchema } from "../../../../validations/authSchema";
import { Eye, EyeOff } from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL;
import axios from "axios";

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // alert("Signup clicked");
    const validation = signupSchema.safeParse(formData);

    if (!validation.success) {
      const newErrors: Record<string, string> = {};

      // Use .issues instead of .errors
      validation.error.issues.forEach((issue) => {
        const path = issue.path[0];
        if (path) {
          newErrors[path.toString()] = issue.message;
        }
      });

      setErrors(newErrors);
      return;
    }
    try {
      // const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
      // const API_URL = import.meta.env.VITE_API_URL;
      // const response = await fetch(`${API_URL}/api/auth/signup`, { // axios
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(formData),
      // });
      const response= await axios.post(`${API_URL}/api/auth/signup`, formData)

      if (response.status === 200) {
        alert("Account created successfully!");
        navigate("/auth/login");
      }
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        <h2>Create Account</h2>
        <input
          type="text"
          className="input-field"
          placeholder="Username"
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          required
        />
        {errors.username && (
          <span className="error-text">{errors.username}</span>
        )}
        <input
          type="email"
          className="input-field"
          placeholder="Email"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        {errors.email && <span className="error-text">{errors.email}</span>}
        {/* <input 
          type="password" 
          placeholder="Password" 
          onChange={(e) => setFormData({...formData, password: e.target.value})} 
          required 
        /> */}
        {/* Password with Floating Label */}
        <div
          className={`relative flex items-center rounded-lg border ${errors.password ? "border-red-500" : "border-gray-300"} focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500`}
        >
          <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-blue-500">
            Password
          </label>
          <input
            type={showPass ? "text" : "password"}
            placeholder="Enter Password"
            className="w-full rounded-lg bg-transparent p-3 outline-none"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <button
            type="button"
            className="pr-3 text-gray-400 hover:text-gray-600"
            onClick={() => setShowPass(!showPass)}
          >
            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && (
          <span className="error-text">{errors.password}</span>
        )}

        {/* Confirm Password with Floating Label */}
        <div
          className={`relative flex items-center rounded-lg border ${errors.confirmPassword ? "border-red-500" : "border-gray-300"} focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500`}
        >
          <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-blue-500">
            Confirm Password
          </label>
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm Password"
            className="w-full rounded-lg bg-transparent p-3 outline-none"
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
          />
          <button
            type="button"
            className="pr-3 text-gray-400 hover:text-gray-600"
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <span className="error-text">{errors.confirmPassword}</span>
        )}
        {/* {errors.password && <span className="error-text">{errors.password}</span>} */}
        <button type="submit" className="signup-btn">
          Sign Up
        </button>
        <p>
          Already have an account? <Link to="/api/auth/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
