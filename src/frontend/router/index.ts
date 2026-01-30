import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import AdminLogin from "../pages/AdminLogin.vue";
import AdminDashboard from "../pages/AdminDashboard.vue";
import { getAdminToken } from "../services/adminApi";

const routes = [
    { path: "/", component: Home },
    { path: "/admin/login", component: AdminLogin },
    {
        path: "/admin",
        component: AdminDashboard,
        meta: { requiresAuth: true },
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth) {
        const token = getAdminToken();
        if (!token) {
            next("/admin/login");
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;
