import type { VercelRequest, VercelResponse } from "@vercel/node";
import { verifyAdmin } from "../_lib/adminAuth.js";
import { supabase } from "../_lib/db.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (!verifyAdmin(req, res)) return;

    if (req.method === "PATCH") {
        const id = req.query.id as string;
        const { is_banned } = req.body;

        if (!id) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const { error } = await supabase
            .from("telegram_users")
            .update({ is_banned: !!is_banned })
            .eq("id", id);

        if (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        }

        return res.status(200).json({ ok: true });
    }

    if (req.method !== "GET") {
        res.setHeader("Allow", "GET, PATCH");
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const { data, error } = await supabase
            .from("telegram_users")
            .select(`
                *,
                link_count:links(count)
            `)
            .order("updated_at", { ascending: false });

        if (error) {
            console.error("Supabase Error:", error);
            return res.status(500).json({ 
                error: "Database Query Failed", 
                details: error.message,
                hint: "Ensure 'is_banned' column exists in 'telegram_users' and 'links' table has 'telegram_user_id' foreign key."
            });
        }

        const users = (data ?? []).map(user => ({
            ...user,
            link_count: Array.isArray(user.link_count) ? user.link_count[0]?.count : (user.link_count?.count ?? 0)
        }));

        return res.status(200).json({ data: users });

    } catch (err: any) {
        console.error("Internal Server Error:", err);
        return res.status(500).json({ error: err.message || "Failed to fetch users" });
    }
}
