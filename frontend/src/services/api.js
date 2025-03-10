// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://carpool-85ok.onrender.com/', // Adjust if your backend runs on a different URL or port
});

export default api;
