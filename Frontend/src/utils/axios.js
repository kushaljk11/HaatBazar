import axios from "axios";

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const sanitizedBaseUrl = String(rawBaseUrl).replace(/\/+$/, "");
const API_BASE_URL = sanitizedBaseUrl.endsWith("/api")
  ? sanitizedBaseUrl
  : `${sanitizedBaseUrl}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;