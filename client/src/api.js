import axios from 'axios';

// Removed localhost fallback. The app will now strictly use the Vercel environment variable.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
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