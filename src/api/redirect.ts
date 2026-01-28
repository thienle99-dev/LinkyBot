import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getShortLink } from "../lib/db";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const code = (req.query.code as string | undefined) ?? undefined;

  if (!code) {
    return res.status(400).send("Missing code");
  }

  const record = await getShortLink(code);

  if (!record) {
    return res.status(404).send("Not found");
  }

  res.setHeader("Location", record.longUrl);
  return res.status(302).end();
}

