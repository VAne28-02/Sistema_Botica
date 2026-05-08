import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

// Este código adjunta el token automáticamente si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = token; 
  }
  return config;
});

export default api;