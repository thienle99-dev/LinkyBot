import { createClient } from "@supabase/supabase-js";
import { APP_BASE_URL, SUPABASE_ANON_KEY, SUPABASE_URL } from "../config/env";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface ShortLinkRecord {
  code: string;
  original_url: string;
  created_at: string;
  source: "web" | "telegram";
  clicks: number;
}

// Helper to map DB column names to our application model if needed. 
// For now, we'll try to stick to the DB schema in the app or map it.
// The existing app expects: longUrl. Let's provide a backward compatible interface if helpful,
// OR update the consumers. Given the codebase is small, updating consumers is better.
// But wait, the consuming code (shorten.ts, telegram-webhook.ts) uses:
// saveShortLink(code, url, source)
// getShortLink(code) -> returns object with longUrl

// Let's implement the functions matching the existing signature but using Supabase.

export interface LegacyShortLinkRecord {
  longUrl: string;
  createdAt: string;
  source: "web" | "telegram";
  clicks?: number;
  code: string;
}

export interface TelegramUserCtx {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  language_code?: string;
}

export async function upsertTelegramUser(user: TelegramUserCtx): Promise<void> {
  const { error } = await supabase.from("telegram_users").upsert(
    {
      id: user.id,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      language_code: user.language_code,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );

  if (error) {
    console.error("Error upserting telegram user:", error);
    // Don't throw, just log. We don't want to break the link creation flow if user tracking fails.
  }
}

export async function saveShortLink(
  code: string,
  longUrl: string,
  source: "web" | "telegram",
  telegramUserId?: number
): Promise<LegacyShortLinkRecord> {
  const { data, error } = await supabase
    .from("links")
    .insert({
      code,
      original_url: longUrl,
      source,
      telegram_user_id: telegramUserId,
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
