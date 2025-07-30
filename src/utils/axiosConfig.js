import axios from "axios";
import { store } from "../redux/configStore";

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use(
  (config) => {
    // Solo agregar token si no se proporciona uno personalizado
    if (!config.headers.Authorization) {
      // Obtener token del Redux store
      const state = store.getState();
      const token = state.auth.token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Si el error es de autenticación (401 o 403), disparar logout
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log(
        "🔐 Token expirado o inválido, cerrando sesión automáticamente"
      );

      // Dispatch logout action
      store.dispatch({ type: "auth/logout" });

      // Redirigir al login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
