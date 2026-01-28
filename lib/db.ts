import { createClient } from "@supabase/supabase-js";
import { APP_BASE_URL, SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface ShortLinkRecord {
  code: string;
  original_url: string;
  created_at: string;
  source: "web" | "telegram";
  clicks: number;
}

export interface LegacyShortLinkRecord {
  longUrl: string;
  createdAt: string;
  source: "web" | "telegram";
  clicks?: number;
  code: string;
}

export async function saveShortLink(
  code: string,
  longUrl: string,
  source: "web" | "telegram"
): Promise<LegacyShortLinkRecord> {
  const { data, error } = await supabase
    .from("links")
    .insert({
      code,
      original_url: longUrl,
      source,
    })
    .select()
    .single();

  if (error) {
    console.error("Error saving short link:", error);
    throw new Error("Failed to persist short link");
  }

  return {
    longUrl: data.original_url,
    createdAt: data.created_at,
    source: data.source,
    clicks: data.clicks,
    code: data.code,
  };
}

export async function getShortLink(
  code: string
): Promise<LegacyShortLinkRecord | null> {
  const { data, error } = await supabase
    .from("links")
    .select("*")
    .eq("code", code)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    longUrl: data.original_url,
    createdAt: data.created_at,
    source: data.source,
    clicks: data.clicks,
    code: data.code,
  };
}

export function buildShortUrl(code: string): string {
  return `${APP_BASE_URL.replace(/\/$/, "")}/r/${code}`;
}
