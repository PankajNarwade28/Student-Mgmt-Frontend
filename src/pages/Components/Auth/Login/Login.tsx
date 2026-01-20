import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../Auth.css"
const API_URL = import.meta.env.VITE_API_URL; 
import { loginSchema } from '../../../../utils/validationSchema';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/');
    }
  }, [navigate]);

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
      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        <h2>Login</h2>
        <input 
          type="email" 
          className='input-field'
          placeholder="Email" 
          onChange={(e) => setFormData({...formData, email: e.target.value})} 
          required 
        />
        {errors.email && (
          <span className="error-text">{errors.email}</span>
        )}
        <input 
          type="password" 
          placeholder="Password" 
          className='input-field'
          onChange={(e) => setFormData({...formData, password: e.target.value})} 
          required 
        />
        {errors.password && (
          <span className="error-text">{errors.password}</span>
        )}
        <button type="submit" className="submit-btn">Login</button>
        <p>Don't have an account? <Link to="/auth/signup">Sign Up</Link></p>
      </form>
    </div>
  );
};

export default Login;