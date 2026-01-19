import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../Auth.css"
const API_URL = import.meta.env.VITE_API_URL; 

const Login: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/');
    }
  }, [navigate]);

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
     const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Store the items in LocalStorage
        localStorage.setItem('token', data.token); 
        localStorage.setItem('userId', data.user.id);   // Storing the UUID
        localStorage.setItem('userRole', data.user.role); // Storing the Role (Admin/Teacher/Student)
        
        navigate('/');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Login</h2>
        <input 
          type="email" 
          placeholder="Email" 
          onChange={(e) => setFormData({...formData, email: e.target.value})} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          onChange={(e) => setFormData({...formData, password: e.target.value})} 
          required 
        />
        <button type="submit">Login</button>
        <p>Don't have an account? <Link to="/auth/signup">Sign Up</Link></p>
      </form>
    </div>
  );
};

export default Login;