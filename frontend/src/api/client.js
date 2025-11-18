import axios from 'axios';

// Crear instancia de Axios con configuración base
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 10000, // 10 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores de forma global
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log del error para debugging
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    // Puedes agregar lógica custom aquí, por ejemplo:
    // - Redirigir a login si es 401
    // - Mostrar notificación toast
    // - Retry automático en ciertos casos

    return Promise.reject(error);
  }
);

export default apiClient;
