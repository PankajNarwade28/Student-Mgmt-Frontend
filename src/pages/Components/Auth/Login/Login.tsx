import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Auth.css";
const API_URL = import.meta.env.VITE_API_URL;
import { loginSchema } from "../../../../validations/authSchema";
import axios from "axios";
import toast from "react-hot-toast";

const Login: React.FC = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  useEffect(() => {
    if (loading) {
      toast.loading("Logging in...", { id: "loginToast" });
    }
  }, [loading]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = loginSchema.safeParse(formData);

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
      setLoading(true);
      const response = await axios.post(`${API_URL}/api/auth/login`, formData);

      if (response.status === 200) {
        const data = response.data;
        toast.success("Login successful!");
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("userRole", data.user.role);
        navigate("/dashboard");
      }
    } catch (error: unknown) {
      // 1. Check if the error is from the server (Axios response)
      if (axios.isAxiosError(error) && error.response) {
        // This matches the 'data' object seen in your console image
        const serverMessage = error.response.data.message;
        toast.error(serverMessage || "Invalid credentials");
      }
      // 2. Handle network errors (no response from server)
      else if (axios.isAxiosError(error) && error.request) {
        toast.error("No response from server. Check your connection.");
      }
      // 3. Handle other setup errors
      else {
        toast.error("An unexpected error occurred.");
      }

      console.error("Login Error:", error);
    } finally {
      setLoading(false);
      setErrors({});
      toast.dismiss("loginToast");
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        <h2>Login</h2>
        <input
          type="email"
          className="input-field"
          placeholder="Email"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        {errors.email && <span className="error-text">{errors.email}</span>}
        <input
          type="password"
          placeholder="Password"
          className="input-field"
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
        />
        {errors.password && (
          <span className="error-text">{errors.password}</span>
        )}
        <button type="submit" className="submit-btn">
          Login
        </button>
        <p>
          Don't have an account? <Link to="/auth/signup">Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
