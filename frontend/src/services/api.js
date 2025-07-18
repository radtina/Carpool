// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://carpoolbackend-hj1i.onrender.com', // Adjust if your backend runs on a different URL or port
});



// Add an interceptor to attach the token to each request.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;



