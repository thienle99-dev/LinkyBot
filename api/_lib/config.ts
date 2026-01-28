export const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN ?? "";
export const TELEGRAM_WEBHOOK_SECRET_TOKEN =
  process.env.TELEGRAM_WEBHOOK_SECRET_TOKEN ?? "";

export const APP_BASE_URL =
  process.env.APP_BASE_URL ?? "https://sl0.vercel.app";

export const SUPABASE_URL =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // In a real production app you might want to throw on cold start;
  // here we just rely on runtime checks inside the handlers.
  console.warn("Supabase credentials are not fully configured.");
}

