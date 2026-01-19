import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const [user] = useState<{ id: string; role: string } | null>(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');
    
    if (token && userId && userRole) {
      return { id: userId, role: userRole };
    }
    return null;
  });
  const [loading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');

    if (!token || !userId || !userRole) {
      // Optional: auto-redirect if called outside the ProtectedRoute wrapper
      navigate('/auth/login');
    }
  }, [navigate]);

  return { user, loading, isAuthenticated: !!user };
};