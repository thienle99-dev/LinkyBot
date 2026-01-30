import type { VercelRequest, VercelResponse } from "@vercel/node";
import { verifyAdmin } from "../_lib/adminAuth.js";
import { supabase } from "../_lib/db.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (!verifyAdmin(req, res)) return;

    if (req.method !== "GET") {
        res.setHeader("Allow", "GET");
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        // Fetch users along with their link counts
        // Note: For this to work efficiently with Supabase JS, 
        // it's often easier to use a view or RPC if the schema is complex.
        // But let's try a simple join-like query if possible.
        const { data, error } = await supabase
            .from("telegram_users")
            .select(`
                *,
                links:links(count)
            `)
            .order("updated_at", { ascending: false });

        if (error) throw error;

        const users = (data ?? []).map(user => ({
            ...user,
            link_count: user.links?.[0]?.count ?? 0
        }));

        return res.status(200).json({ data: users });

    } catch (err: any) {
        console.error(err);
        return res.status(500).json({ error: "Failed to fetch users" });
    }
}
