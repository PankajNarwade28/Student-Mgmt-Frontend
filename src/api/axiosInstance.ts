import axios from 'axios'; 

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

// 1. REQUEST INTERCEPTOR (Sends the token)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 2. RESPONSE INTERCEPTOR (Removes token on error)
api.interceptors.response.use(
  (response) => {
    // Return response if request was successful
    return response;
  },
 (error) => {
    // Check for 401 (Unauthorized) or 403 (Forbidden)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) { 
      console.warn('Token expired or unauthorized. Logging out user.');
      // Nuclear option (Clears everything in LocalStorage)
     // 2. Set the 5-second timeout (5000 milliseconds)
      setTimeout(() => {
        // Nuclear option (Clears everything in LocalStorage)
        localStorage.clear();

        // Redirect to login
        globalThis.location.href = '/auth/login';
      }, 5000); 
    
    }
    return Promise.reject(error);
  }
);

export default api;