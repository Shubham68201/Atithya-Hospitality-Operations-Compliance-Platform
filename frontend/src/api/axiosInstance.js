import axios from "axios";

const axiosInstance = axios.create({
  baseURL:         import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers:         { "Content-Type": "application/json" },
  timeout:         30000,   // 30s — handles Render cold starts
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || "";
      // /auth/me is a probe — never redirect on its 401
      const isProbe     = url.includes("/auth/me");
      // Also don't redirect if already on an auth page
      const onAuthPage  = ["/login","/register","/verify-otp","/forgot-password","/reset-password"]
        .some((p) => window.location.pathname.startsWith(p));

      if (!isProbe && !onAuthPage) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
