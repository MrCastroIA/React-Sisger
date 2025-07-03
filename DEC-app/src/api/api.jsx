// src/api/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Altere para a URL do seu backend quando ele estiver no ar
  timeout: 5000, // Tempo limite da requisição em ms
  headers: {
    'Content-Type': 'application/json',
  },
});

// Opcional: Interceptor para adicionar o token automaticamente em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;