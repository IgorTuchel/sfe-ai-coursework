import axios from "axios";

const API_URL = "/api";
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.log("Intercepted response error:", error.response);
    if (originalRequest.url === "/users/login") {
      return error.response;
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;
      try {
        await api.get("/users");
        processQueue(null);
        isRefreshing = false;

        return api(originalRequest);
      } catch (refresherror) {
        processQueue(refresherror);
        isRefreshing = false;
        return Promise.reject(refresherror);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
