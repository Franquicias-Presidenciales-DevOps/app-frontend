import axios from "axios";
import { useUtilsStore } from "@/store/utils";
import { BroadcastSession } from "@/plugins/broadcastSession";
// Configuración inicial de Axios
let config = {
  baseURL: import.meta.env.VITE_VUE_APP_API_URL || "http://127.0.0.1:8000/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
};
// Crear una instancia de Axios con la configuración inicial
const instance = axios.create(config);

const broadcastSession = BroadcastSession.getInstance();

// Estado del refresco del token
let isRefreshing = false;
let refreshSubscribers = [];

// Función para suscribirse a la resolución del nuevo token
// Esta función añade las peticiones que están esperando a que el token se refresque a una cola
function subscribeTokenRefresh(callback) {
  refreshSubscribers.push(callback);
}

// Función para notificar a los suscriptores cuando el token se ha refrescado
// Esta función se llama una vez que el token ha sido refrescado y notifica a todas las peticiones en la cola
function onRefreshed(token) {
  refreshSubscribers.forEach((callback) => callback(token));
}

// Función para manejar el refresco del token
// Esta función realiza una petición para obtener un nuevo token de acceso usando el refresh token
async function refreshAccessToken() {
  // Realizar la petición para refrescar el token usando la misma instancia de Axios
  const refreshToken = localStorage.getItem("refresh_token");
  const response = await instance.post("/api/v1/refresh", {
    refresh_token: refreshToken,
  });

  // Guardar los nuevos tokens en el almacenamiento local
  localStorage.setItem("token", response.data.token);
  localStorage.setItem("refresh_token", response.data.refresh_token);

  // Actualizar el header de autorización en la instancia de Axios con el nuevo token de acceso
  config.headers["Authorization"] = `Bearer ${response.data.token}`;

  isRefreshing = false;
  // Notificar a todas las peticiones en espera con el nuevo token de acceso
  onRefreshed(response.data.token);

  // Limpiar la cola de suscriptores
  refreshSubscribers = [];

  return response.data.token;
}

//Manejo de redirección por parte del servidor
async function redirectServer(error) {
  const { data } = error.response;

  window.location.href = data?.url || "/login";

  return Promise.reject(error.message);
}

// Interceptor de peticiones
instance.interceptors.request.use(function (config) {
  const store_ref = useUtilsStore();

  if (!config.disableLoader) {
    store_ref.loader_st = true;
  }
  const token = localStorage.getItem("token");

  if (token && config.headers !== null) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Interceptor de respuestas
instance.interceptors.response.use(
  (response) => {
    const store_ref = useUtilsStore();
    store_ref.loader_st = false;

    return response;
  },
  async (error) => {
    const store_ref = useUtilsStore();
    store_ref.loader_st = false;

    let message = "";
    let type = "error";

    // Manejar el error de conexión
    if (error.request.status === 0 || error.code === 'ERR_NETWORK') {
      store_ref.setNotification({
        type: type,
        message: "No se pudo establecer conexión con el servidor",
        timeout: 5000,
      });
      return Promise.reject(error.message);
    }

    //Manejo de redirección
    if (error.response.status === 302) redirectServer(error);

    // Manejar el error de token expirado
    const originalRequest = error.config;
    if (error.response.status === 403 && !originalRequest._retry) {
      if (!isRefreshing) {
        // Si no se está refrescando el token actualmente, iniciar el proceso de refresco
        isRefreshing = true;
        originalRequest._retry = true;

        try {
          // Intentar refrescar el token
          const newAccessToken = await refreshAccessToken();

          // Actualizar el header de autorización en la petición original con el nuevo token
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          // Mostrar una notificación al usuario de que el token ha sido actualizado
          store_ref.setNotification({
            type: "info",
            message: "La sesión ha sido actualizada",
            timeout: 3000,
          });

          // Reintentar la petición original con el nuevo token
          return instance(originalRequest);
        } catch (err) {
          // Si no se pudo refrescar el token, redirigir al usuario al login
          localStorage.removeItem("token");
          localStorage.removeItem("refresh_token");
          broadcastSession.sendReloadWindow();
          window.location.href = "/login";

          return Promise.reject(err);
        }
      } else {
        // Si el token ya se está refrescando, añadir la petición a la cola de suscriptores

        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((token) => {
            originalRequest._retry = true;
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            resolve(instance(originalRequest));
          });
        });
      }
    }

    // Manejar los errores de la API
    if (error.response.status >= 400 && error.response.status < 500) {
      switch (error.response.status) {
        case 401:
          message = "No autorizado";
          break;
        case 404:
          message = "Recurso no encontrado";
          break;
        case 422:
          message = "Datos inválidos";
          break;
        case 429:
          message = "Demasiadas solicitudes";
          break;
        case 500:
          message =
            "Su solicitud no ha podido ser procesada, vuelva a intentar. Si el error persiste, intente más tarde.";
          break;
        default:
          message = error.response.data.message;
          break;
      }
    }

    // verificar si error.response.data.message es un array
    const isArray = Array.isArray(error.response.data.message);

    if (isArray && error.response.data.message.length > 1) {
      // crear una notificación por cada error
      error.response.data.message.forEach((element) => {
        store_ref.setNotification({
          type: type,
          message: element,
          timeout: 3000,
        });
      });
    } else {
      store_ref.setNotification({
        type: type,
        message:
          error?.response?.data?.message ||
          JSON.parse(await error?.response?.data?.text()).message ||
          message,
        timeout: 3000,
      });
    }

    return Promise.resolve(error.message);
  }
);

export default instance;
// developed by: ademir rivera and isaac castillo 2024
