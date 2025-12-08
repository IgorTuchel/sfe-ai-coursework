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
      return prom.reject(error);
    } else {
      return prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
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
        await axios.get("/users");
        processQueue(null);
        isRefreshing = false;
        return api(originalRequest);
      } catch (refresherror) {
        processQueue(refresherror);
        isRefreshing = false;
        return Promise.reject(refresherror);
      }
    }
    console.log("Response error not handled by interceptor:", error);
    return Promise.reject(error);
  }
);

export default api;
