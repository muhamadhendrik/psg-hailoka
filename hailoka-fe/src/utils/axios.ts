import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    // baseURL: "http://localhost:5000", // your backend URL
    baseURL: API_URL, // your backend URL
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// optional: log error utk debug
api.interceptors.response.use(
    (res) => res,
    (err) => {
        console.error("API Error:", err?.response?.data || err);
        throw err;
    }
);

export default api;