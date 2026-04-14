import axios, { AxiosInstance } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Auth endpoints
export const authAPI = {
    register: (data: { fullname: string; email: string; password: string }) =>
        api.post("/auth/register", data),
    login: (data: { email: string; password: string }) =>
        api.post("/auth/login", data),
    logout: () => api.post("/auth/logout"),
    checkAuth: () => api.get("/auth/check"),
    updateProfile: (data: { profilePic: string }) => api.put("/auth/update-profile", data),
};

// Messages endpoints
export const messagesAPI = {
    getUsers: () => api.get("/messages/users"),
    getMessages: (userId: string) => api.get(`/messages/${userId}`),
    sendMessage: (userId: string, data: { text?: string; image?: string }) =>
        api.post(`/messages/send/${userId}`, data),
};

export default api;
