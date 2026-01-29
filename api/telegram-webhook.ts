import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Telegraf } from "telegraf";
import type { Context } from "telegraf";
import type { Message } from "telegraf/types";
import {
  TELEGRAM_BOT_TOKEN,
  TELEGRAM_WEBHOOK_SECRET_TOKEN
} from "./_lib/config.js";
import { TELEGRAM_BOT_LINK, TELEGRAM_BOT_USERNAME } from "./_lib/telegram.js";
import { isValidHttpUrl } from "./_lib/urlValidator.js";
import { buildShortUrl, getShortLink, saveShortLink } from "./_lib/db.js";
import { generateShortCode } from "./_lib/shortCode.js";

const URL_REGEX =
  /(https?:\/\/[^\s/$.?#].[^\s]*)/i;

const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

bot.start(async (ctx: Context) => {
  await ctx.reply(
    [
      `👋 Welcome to @${TELEGRAM_BOT_USERNAME}!`,
      "",
      "Send me any URL and I will reply with a short link.",
      "",
      `Bot link: ${TELEGRAM_BOT_LINK}`,
      "",
      "Example:",
      "https://example.com/my/very/long/url"
    ].join("\n"),
    { link_preview_options: { is_disabled: true } } as any
  );
});

bot.help(async (ctx: Context) => {
  await ctx.reply(
    [
      "ℹ️ How to use this bot:",
      "",
      "1. Send a message that contains a valid http(s) URL.",
      "2. I will validate it, create a short link, and reply back.",
      "",
      `Bot: @${TELEGRAM_BOT_USERNAME}`,
      `Link: ${TELEGRAM_BOT_LINK}`
    ].join("\n"),
    { link_preview_options: { is_disabled: true } } as any
  );
});

bot.on("text", async (ctx: Context) => {
  const message = ctx.message;
  if (!message || !("text" in message)) return;
  const text = (message as Message.TextMessage).text;
  if (!text) return;

  // Let /start and /help be handled by command handlers above
  if (text.startsWith("/start") || text.startsWith("/help")) return;

  const match = text.match(URL_REGEX);
  const candidateUrl = match?.[1];

  if (!candidateUrl || !isValidHttpUrl(candidateUrl)) {
    await ctx.reply("❌ Please send a valid http(s) URL so I can create a short link.");
    return;
  }

  let code = generateShortCode();
  for (let i = 0; i < 3; i++) {
    const existing = await getShortLink(code);
    if (!existing) break;
    code = generateShortCode();
  }

  await saveShortLink(code, candidateUrl, "telegram");
  const shortUrl = buildShortUrl(code);

  console.log("[shorten] link generated", {
    source: "telegram",
    code,
    shortUrl,
    longUrl: candidateUrl,
    telegramUserId: ctx.from?.id,
    at: new Date().toISOString()
  });

  await ctx.reply(`✅ Short link created:\n${shortUrl}`, {
    link_preview_options: { is_disabled: true }
  } as any);
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  if (!TELEGRAM_BOT_TOKEN) {
    return res
      .status(500)
      .json({ error: "TELEGRAM_BOT_TOKEN is not configured on the server" });
  }

  // Optional: verify Telegram secret token header if configured
  if (TELEGRAM_WEBHOOK_SECRET_TOKEN) {
    const headerToken =
      (req.headers["x-telegram-bot-api-secret-token"] as string | undefined) ?? "";
    if (headerToken !== TELEGRAM_WEBHOOK_SECRET_TOKEN) {
      return res.status(401).json({ error: "Invalid webhook secret token" });
    }
  }

  // Telegraf expects a Telegram Update object.
  await bot.handleUpdate(req.body as any);
  return res.status(200).json({ ok: true });
}

