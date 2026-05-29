import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

const instance = axios.create({
  baseURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(),
  );
  failedQueue = [];
};

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error?.response?.status === 401 && !originalRequest._retry) {
      const isAuthEndpoint = 
        originalRequest.url.includes("/users/refresh-token") ||
        originalRequest.url.includes("/users/login") ||
        originalRequest.url.includes("/users/register") ||
        originalRequest.url.includes("/users/current-user");

      if (!isAuthEndpoint) {
        // For non-auth endpoints, try to refresh token
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => instance(originalRequest))
            .catch((err) => Promise.reject(err));
        }
        originalRequest._retry = true;
        isRefreshing = true;
        try {
          await instance.post("/users/refresh-token");
          processQueue(null);
          return instance(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError);
          window.dispatchEvent(new CustomEvent("auth:logout"));
          return Promise.reject(
            new Error("Session expired. Please log in again."),
          );
        } finally {
          isRefreshing = false;
        }
      } else {
        // For auth endpoints, dispatch logout immediately
        if (originalRequest.url.includes("/users/current-user")) {
          // Current user check failed - user is not authenticated
          // Don't dispatch logout here, just fail silently
          const message = error?.response?.data?.message || "Unauthorized";
          return Promise.reject(new Error(message));
        }
      }
    }
    
    const message =
      error?.response?.data?.message || error?.message || "Request failed";
    return Promise.reject(new Error(message));
  },
);

export const productApi = {
  list: () => instance.get("/products"),
  getById: (id) => instance.get(`/products/${id}`),
  create: (data) => instance.post("/products", data),
  update: (id, data) => instance.patch(`/products/${id}`, data),
  delete: (id) => instance.delete(`/products/${id}`),
};


export const cartApi = {
  get: () => instance.get("/cart"),
  add: (data) => instance.post("/cart", data),
  update: (data) => instance.patch("/cart", data),
  remove: (productId) => instance.delete(`/cart/${productId}`),
  clear: () => instance.delete("/cart"),
};

export const wishlistApi = {
  get: () => instance.get("/wishlist"),
  add: (data) => instance.post("/wishlist", data),
  remove: (productId) => instance.delete(`/wishlist/${productId}`),
};

export const userApi = {
  getCurrentUser: () => instance.get("/users/current-user"),
  login: (data) => instance.post("/users/login", data),
  logout: () => instance.post("/users/logout"),
  register: (data) => instance.post("/users/register", data),
  refreshToken: () => instance.post("/users/refresh-token"),
  changePassword: (data) => instance.post("/users/change-password", data),
  updateAccount: (data) => instance.patch("/users/update-account", data),
};

export const authApi = {
  currentUser: () => instance.get("/users/current-user"),
  login: (data) => instance.post("/users/login", data),
  logout: () => instance.post("/users/logout"),
  register: (data) => instance.post("/users/register", data),
  refreshToken: () => instance.post("/users/refresh-token"),
  changePassword: (data) => instance.post("/users/change-password", data),
  updateAccount: (data) => instance.patch("/users/update-account", data),
};

export default instance;
