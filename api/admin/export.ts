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
        // Fetch ALL links for export
        const { data, error } = await supabase
            .from("links")
            .select("code, original_url, source, clicks, created_at")
            .order("created_at", { ascending: false });

        if (error) throw error;

        if (!data || data.length === 0) {
            return res.status(200).send("No links found");
        }

        // Generate CSV content
        const headers = ["Short Code", "Original URL", "Source", "Clicks", "Created At"];
        const rows = data.map(link => [
            link.code,
            `"${link.original_url.replace(/"/g, '""')}"`,
            link.source,
            link.clicks,
            new Date(link.created_at).toISOString()
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.join(","))
        ].join("\n");

        // Set headers for file download
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", `attachment; filename=links-export-${new Date().toISOString().split('T')[0]}.csv`);

        return res.status(200).send(csvContent);

    } catch (err: any) {
        console.error(err);
        return res.status(500).json({ error: "Failed to export links" });
    }
}
