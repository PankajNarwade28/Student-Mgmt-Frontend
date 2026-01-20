import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import "../Auth.css" 

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

    useEffect(() => {
      if (localStorage.getItem('token')) {
        navigate('/');
      }
    }, [navigate]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // alert("Signup clicked"); 
    try {
      // const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
      const API_URL = import.meta.env.VITE_API_URL; 
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Account created successfully!');
        navigate('/auth/login');
      }
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Create Account</h2>
        <input 
          type="text" 
          placeholder="Username" 
          onChange={(e) => setFormData({...formData, username: e.target.value})} 
          required 
        />
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
        <button type="submit">Sign Up</button>
        <p>Already have an account? <Link to="/api/auth/login">Login</Link></p>
      </form>
    </div>
  );
};

export default Signup;