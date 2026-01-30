import type { VercelRequest, VercelResponse } from "@vercel/node";
import { verifyAdmin } from "../_lib/adminAuth.js";
import axios from "axios";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (!verifyAdmin(req, res)) return;

    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: "URL is required" });
    }

    try {
        // We use a timeout to avoid hanging
        const response = await axios.get(url, { 
            timeout: 5000,
            validateStatus: () => true, // Accept any status code
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        return res.status(200).json({
            status: response.status,
            ok: response.status >= 200 && response.status < 400
        });

    } catch (err: any) {
        return res.status(200).json({
            status: null,
            ok: false,
            error: err.message
        });
    }
}
