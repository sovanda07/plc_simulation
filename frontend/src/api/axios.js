import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:5000" });

// Interceptor - runs before every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("Item");

    // Attach token to header
    return config;
})

export default api;