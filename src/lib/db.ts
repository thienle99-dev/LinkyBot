import { APP_BASE_URL, UPSTASH_REDIS_REST_TOKEN, UPSTASH_REDIS_REST_URL } from "../config/env";

export interface ShortLinkRecord {
  longUrl: string;
  createdAt: string;
  source: "web" | "telegram";
  clicks?: number;
}

const HEADER_AUTH =
  UPSTASH_REDIS_REST_TOKEN && UPSTASH_REDIS_REST_TOKEN.length > 0
    ? { Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}` }
    : {};

async function upstashGet(key: string): Promise<string | null> {
  if (!UPSTASH_REDIS_REST_URL) return null;
  const url = `${UPSTASH_REDIS_REST_URL}/get/${encodeURIComponent(key)}`;
  const res = await fetch(url, {
    headers: {
      ...HEADER_AUTH
    }
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { result: string | null };
  return data.result ?? null;
}

async function upstashSet(key: string, value: string): Promise<void> {
  if (!UPSTASH_REDIS_REST_URL) {
    throw new Error("UPSTASH_REDIS_REST_URL is not configured");
  }
  const url = `${UPSTASH_REDIS_REST_URL}/set/${encodeURIComponent(
    key
  )}/${encodeURIComponent(value)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      ...HEADER_AUTH
    }
  });
  if (!res.ok) {
    throw new Error("Failed to persist short link");
  }
}

export async function saveShortLink(
  code: string,
  longUrl: string,
  source: ShortLinkRecord["source"]
): Promise<ShortLinkRecord> {
  const record: ShortLinkRecord = {
    longUrl,
    createdAt: new Date().toISOString(),
    source
  };

  await upstashSet(`short:${code}`, JSON.stringify(record));
  return record;
}

export async function getShortLink(
  code: string
): Promise<(ShortLinkRecord & { code: string }) | null> {
  const raw = await upstashGet(`short:${code}`);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as ShortLinkRecord;
    return { ...parsed, code };
  } catch {
    return null;
  }
}

export function buildShortUrl(code: string): string {
  return `${APP_BASE_URL.replace(/\/$/, "")}/r/${code}`;
}

