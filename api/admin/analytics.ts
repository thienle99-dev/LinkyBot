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
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        thirtyDaysAgo.setHours(0, 0, 0, 0);

        const [creationRes, topRes] = await Promise.all([
            supabase
                .from("links")
                .select("created_at")
                .gte("created_at", thirtyDaysAgo.toISOString()),
            supabase
                .from("links")
                .select("code, original_url, clicks")
                .order("clicks", { ascending: false })
                .limit(5)
        ]);

        if (creationRes.error) throw creationRes.error;
        if (topRes.error) throw topRes.error;

        // Group daily creation in JS
        const dailyCreationMap: Record<string, number> = {};
        
        // Initialize last 30 days with 0
        for (let i = 0; i <= 30; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            dailyCreationMap[dateStr] = 0;
        }

        creationRes.data.forEach(link => {
            const dateStr = new Date(link.created_at).toISOString().split('T')[0];
            if (dailyCreationMap[dateStr] !== undefined) {
                dailyCreationMap[dateStr]++;
            }
        });

        const dailyCreation = Object.entries(dailyCreationMap)
            .map(([day, count]) => ({ day, count }))
            .sort((a, b) => a.day.localeCompare(b.day));

        return res.status(200).json({
            dailyCreation,
            topLinks: topRes.data ?? []
        });

    } catch (err: any) {
        console.error(err);
        return res.status(500).json({ error: "Failed to fetch analytics" });
    }
}
