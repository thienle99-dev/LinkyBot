import type { VercelRequest, VercelResponse } from "@vercel/node";
import { verifyAdmin } from "../_lib/adminAuth.js";
import { supabase } from "../_lib/db.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (!verifyAdmin(req, res)) return;

    if (req.method === "GET") {
        const page = parseInt((req.query.page as string) || "1", 10);
        const limit = parseInt((req.query.limit as string) || "20", 10);
        const search = (req.query.search as string) || "";
        const source = (req.query.source as string) || "";

        // Calculate range for Supabase (0-based start, inclusive end)
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        let query = supabase
            .from("links")
            .select("*", { count: "exact" })
            .order("created_at", { ascending: false })
            .range(from, to);

        if (search) {
            if (search.startsWith("http")) {
                query = query.ilike("original_url", `%${search}%`);
            } else {
                query = query.or(`code.ilike.%${search}%,original_url.ilike.%${search}%`);
            }
        }

        if (source && (source === "web" || source === "telegram")) {
            query = query.eq("source", source);
        }

        const { data, count, error } = await query;

        if (error) {
            console.error(error);
            return res.status(500).json({ error: "Database error" });
        }

        return res.status(200).json({
            data: data ?? [],
            total: count ?? 0,
            page,
            limit
        });
    }

    if (req.method === "PATCH") {
        const code = req.query.code as string;
        const { original_url } = req.body;

        if (!code) {
            return res.status(400).json({ error: "Code is required" });
        }
        if (!original_url) {
            return res.status(400).json({ error: "Original URL is required" });
        }

        const { error } = await supabase
            .from("links")
            .update({ original_url })
            .eq("code", code);

        if (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        }

        return res.status(200).json({ ok: true });
    }

    if (req.method === "DELETE") {
        const code = req.query.code as string;
        const codes = req.body?.codes as string[];

        if (!code && (!codes || codes.length === 0)) {
            return res.status(400).json({ error: "Code or codes array is required" });
        }

        let deleteQuery = supabase.from("links").delete();
        
        if (code) {
            deleteQuery = deleteQuery.eq("code", code);
        } else {
            deleteQuery = deleteQuery.in("code", codes);
        }

        const { error } = await deleteQuery;

        if (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        }

        return res.status(200).json({ ok: true });
    }

    if (req.method === "POST") {
        const { original_url, code: customCode, source = "web" } = req.body;

        if (!original_url) {
            return res.status(400).json({ error: "Original URL is required" });
        }

        let code = customCode;
        if (code) {
            // Check if code exists
            const { data: existing } = await supabase
                .from("links")
                .select("code")
                .eq("code", code)
                .single();

            if (existing) {
                return res.status(409).json({ error: "Custom code already exists" });
            }
        } else {
            // Generate a random code if not provided
            // For simplicity, we can use a helper or simple random string here
            // But since this is a small app, let's assume we want a code
            return res.status(400).json({ error: "Custom code is required for admin creation" });
        }

        const { data, error } = await supabase
            .from("links")
            .insert({
                code,
                original_url,
                source
            })
            .select()
            .single();

        if (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        }

        return res.status(201).json({ ok: true, data });
    }

    res.setHeader("Allow", "GET, DELETE, PATCH, POST");
    return res.status(405).json({ error: "Method Not Allowed" });
}
