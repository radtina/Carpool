// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080', // Adjust if your backend runs on a different URL or port
});

export default api;
