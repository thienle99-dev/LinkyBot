import type { VercelRequest, VercelResponse } from "@vercel/node";
import { generateShortCode } from "../lib/shortCode";
import { isValidHttpUrl } from "../lib/urlValidator";
import { buildShortUrl, getShortLink, saveShortLink } from "../lib/db";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { url } = (req.body ?? {}) as { url?: string };

  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "Missing url" });
  }

  if (!isValidHttpUrl(url)) {
    return res.status(400).json({ error: "Invalid URL" });
  }

  let code = generateShortCode();
  for (let i = 0; i < 3; i++) {
    const existing = await getShortLink(code);
    if (!existing) break;
    code = generateShortCode();
  }

  await saveShortLink(code, url, "web");

  const shortUrl = buildShortUrl(code);

  return res.status(200).json({ code, shortUrl });
}

