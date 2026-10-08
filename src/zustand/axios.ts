import axios, { AxiosInstance } from "axios";
import { API_URL } from "../ConfigResolver";

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 150000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;