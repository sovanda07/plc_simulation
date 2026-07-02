import axios from "axios";

const api = axios.create({ 
    baseURL: "https://tender-prosperity-production-9e40.up.railway.app" 
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;