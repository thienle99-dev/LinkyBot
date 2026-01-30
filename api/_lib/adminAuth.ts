import type { VercelRequest, VercelResponse } from "@vercel/node";
import { ADMIN_SECRET_TOKEN } from "./config.js";

/**
 * Middleware-like function to verify admin token.
 * Returns true if authorized, false if not (and handles response).
 */
export function verifyAdmin(req: VercelRequest, res: VercelResponse): boolean {
    if (!ADMIN_SECRET_TOKEN) {
        console.error("ADMIN_SECRET_TOKEN is not configured");
        res.status(500).json({ error: "Server misconfiguration" });
        return false;
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ error: "Missing or invalid Authorization header" });
        return false;
    }

    const token = authHeader.split(" ")[1];
    if (token !== ADMIN_SECRET_TOKEN) {
        res.status(401).json({ error: "Invalid token" });
        return false;
    }

    return true;
}
