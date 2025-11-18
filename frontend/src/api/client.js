import axios from 'axios';

//Axios API Client Configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores de forma global
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    });
    // Puedes personalizar el manejo de errores aquí según tus necesidades
    // Por ejemplo, 401 Unathorized de error.response.?status =  401
     return Promise.reject(error);
  }
);

export default apiClient;
