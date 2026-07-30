import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
if (!BASE_URL) {
  console.error("VITE_API_BASE_URL is not set in environment variables");
}

export const api = axios.create({
  baseURL: BASE_URL || "",
  withCredentials: true,
});
