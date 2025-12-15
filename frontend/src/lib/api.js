/**
 * @file api.js
 * @description Configured Axios instance with automatic token refresh and request queuing.
 * Handles 401 errors by refreshing access tokens transparently and retrying failed requests
 * without requiring user re-authentication.
 * @module lib/api
 */

import axios from "axios";

/**
 * Base API URL for all requests.
 * @constant {string}
 */
const API_URL = "/api";

/**
 * Configured Axios instance with credentials and interceptors.
 * @type {axios.AxiosInstance}
 *
 * @description Pre-configured Axios client with:
 * - Base URL set to /api
 * - Credentials enabled (includes cookies in requests)
 * - Response interceptor for automatic token refresh on 401 errors
 */
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

/**
 * Flag indicating if token refresh is in progress.
 * @type {boolean}
 */
let isRefreshing = false;

/**
 * Queue of failed requests waiting for token refresh to complete.
 * @type {Array<{resolve: Function, reject: Function}>}
 */
let failedQueue = [];

/**
 * Processes queued requests after token refresh completes.
 *
 * @param {Error|null} error - Error if refresh failed, null if successful.
 * @param {string|null} [token=null] - New token (unused in current implementation).
 * @returns {void}
 *
 * @description Resolves or rejects all queued promises based on refresh result,
 * then clears the queue.
 */
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

/**
 * Response interceptor that handles automatic token refresh on 401 errors.
 *
 * @description Intercepts all responses and handles 401 Unauthorized errors:
 *
 * **Request queuing mechanism**:
 * 1. First 401 error triggers token refresh via GET /users endpoint
 * 2. Subsequent 401 errors during refresh are queued
 * 3. After refresh completes, all queued requests retry automatically
 * 4. Uses _retry flag to prevent infinite retry loops
 *
 * **Special cases**:
 * - Login endpoint (/users/login) bypasses retry logic
 * - Only retries each request once (prevents loops on persistent 401s)
 *
 * @example
 * // Automatic retry on 401
 * const response = await api.get('/protected-endpoint');
 * // If 401, automatically refreshes token and retries
 *
 * @example
 * // Multiple simultaneous requests
 * Promise.all([
 *   api.get('/endpoint1'),
 *   api.get('/endpoint2'),
 *   api.get('/endpoint3')
 * ]);
 * // If all get 401, only one refresh is triggered, others wait in queue
 */
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
    return Promise.reject(error);
  }
);

export default api;
