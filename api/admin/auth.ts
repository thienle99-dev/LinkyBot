import type { VercelRequest, VercelResponse } from "@vercel/node";
import { ADMIN_SECRET_TOKEN } from "../_lib/config.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ error: "Token is required" });
    }

    if (token !== ADMIN_SECRET_TOKEN) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    // authentic success
    return res.status(200).json({ ok: true, token });
}
