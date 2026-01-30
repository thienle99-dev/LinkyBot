import axios from "axios";

const ADMIN_TOKEN_KEY = "admin_token";

const api = axios.create({
    baseURL: "/api/admin",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export function getAdminToken() {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function logout() {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    window.location.href = "/admin/login";
}

export async function login(token: string) {
    const res = await api.post("/auth", { token });
    if (res.data.ok) {
        localStorage.setItem(ADMIN_TOKEN_KEY, res.data.token);
        return true;
    }
    return false;
}

export async function getStats() {
    const res = await api.get("/stats");
    return res.data;
}

export async function getLinks(params: { page: number; limit: number; search?: string; source?: string }) {
    const res = await api.get("/links", { params });
    return res.data;
}

export async function deleteLink(code: string) {
    const res = await api.delete(`/links?code=${code}`);
    return res.data;
}
