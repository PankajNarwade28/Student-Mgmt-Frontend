import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Auth.css";
import { loginSchema } from "../../../../validations/authSchema";
import toast from "react-hot-toast";
// import api from "../../../../api/axiosInstance";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

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
    }
  }, [loading]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submission prevented.");

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
      // Used axios directly here to avoid interceptor issues during login
      const response = await axios.post(`${API_URL}/api/auth/login`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        const data = response.data;
        toast.success(`Welcome back! ${data.user.email}`);

        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("userRole", data.user.role);

        navigate("/dashboard");
      }
    } catch (error) {
      if(axios.isAxiosError(error)) { 
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message); // backend-provided message
      } else {
        toast.error(error.message || "Something went wrong"); // fallback
      }
      }
      // Log the full error for debugging

      
    } finally {
      setLoading(false);
      toast.dismiss("loginToast");
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleLogin} className="auth-form" noValidate>
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
        {/* <p>
          Don't have an account? <Link to="/auth/signup">Sign Up</Link>
        </p> */}
      </form>
    </div>
  );
};

export default Login;
