// In development, send API calls through Vite so the browser sees same-origin
// requests and the backend's production-only CORS origin does not block localhost.
export const API_BASE_URL = import.meta.env.DEV
  ? "/api"
  : import.meta.env.VITE_RENDER_URL || "http://localhost:5000/api";
