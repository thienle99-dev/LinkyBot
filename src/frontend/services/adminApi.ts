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

export async function getAnalytics() {
    const res = await api.get("/analytics");
    return res.data;
}

export async function getUsers() {
    const res = await api.get("/users");
    return res.data;
}

export async function updateUserStatus(id: number | string, isBanned: boolean) {
    const res = await api.patch(`/users?id=${id}`, { is_banned: isBanned });
    return res.data;
}

export async function deleteLink(code: string) {
    const res = await api.delete(`/links?code=${code}`);
    return res.data;
}

export async function bulkDeleteLinks(codes: string[]) {
    const res = await api.delete("/links", { data: { codes } });
    return res.data;
}

export async function updateLink(code: string, original_url: string) {
    const res = await api.patch(`/links?code=${code}`, { original_url });
    return res.data;
}

export async function verifyLink(url: string) {
    const res = await api.post("/check-live", { url });
    return res.data;
}

export async function createLink(data: { code: string; original_url: string; source?: string }) {
    const res = await api.post("/links", data);
    return res.data;
}

export async function exportLinks() {
    const res = await api.get("/export", { responseType: "blob" });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `links-export-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
}
