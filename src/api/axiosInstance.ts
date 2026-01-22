import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token && config.headers) {
      // Use standard Bearer token format
      config.headers.Authorization = `Bearer ${token}`;
      
      // Optional: Helpful for debugging (remove in production)
      console.log("Interceptor attaching token:", token);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;