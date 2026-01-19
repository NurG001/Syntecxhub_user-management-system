import axios from 'axios';

// Use the environment variable if available (for production), 
// otherwise fallback to localhost (for local development)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/users',
});

// Interceptor: Automatically adds the Token to every request
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  
  return config;
});

export default api;