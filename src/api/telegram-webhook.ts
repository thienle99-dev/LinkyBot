import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  TELEGRAM_BOT_TOKEN,
  TELEGRAM_WEBHOOK_SECRET_TOKEN
} from "../config/env";
import { TELEGRAM_BOT_LINK, TELEGRAM_BOT_USERNAME } from "../config/telegram";
import { isValidHttpUrl } from "../lib/urlValidator";
import {
  buildShortUrl,
  getShortLink,
  saveShortLink,
  getUserRecentLinks,
  upsertTelegramUser
} from "../lib/db";
import { generateShortCode } from "../lib/shortCode";

interface TelegramUser {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  language_code?: string;
}

interface TelegramChat {
  id: number;
}

interface TelegramMessage {
  message_id: number;
  from?: TelegramUser;
  chat: TelegramChat;
  text?: string;
}

interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
}

const URL_REGEX = /(https?:\/\/[^\s/$.?#].[^\s]*)/i;

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

  if (TELEGRAM_WEBHOOK_SECRET_TOKEN) {
    const headerToken =
      (req.headers["x-telegram-bot-api-secret-token"] as string | undefined) ?? "";
    if (headerToken !== TELEGRAM_WEBHOOK_SECRET_TOKEN) {
      return res.status(401).json({ error: "Invalid webhook secret token" });
    }
  }

  const update = req.body as TelegramUpdate;

  if (!update || !update.message) {
    return res.status(200).json({ ok: true });
  }

  const { message } = update;
  const text = message.text ?? "";

  if (text.startsWith("/start")) {
    await sendTelegramMessage(
      message.chat.id,
      [
        `👋 Welcome to @${TELEGRAM_BOT_USERNAME}!`,
        "",
        "Send me any URL and I will reply with a short link.",
        "",
        `Bot link: ${TELEGRAM_BOT_LINK}`,
        "",
        "Example:",
        "https://example.com/my/very/long/url"
      ].join("\n")
    );
    return res.status(200).json({ ok: true });
  }

  if (text.startsWith("/help")) {
    await sendTelegramMessage(
      message.chat.id,
      [
        "ℹ️ How to use this bot:",
        "",
        "1. Send a message that contains a valid http(s) URL.",
        "2. I will validate it, create a short link, and reply back.",
        "",
        "Commands:",
        "/start - Welcome message",
        "/help - Show this help",
        "/links - View your recent links",
        "",
        `Bot: @${TELEGRAM_BOT_USERNAME}`,
        `Link: ${TELEGRAM_BOT_LINK}`
      ].join("\n")
    );
    return res.status(200).json({ ok: true });
  }

  if (text.startsWith("/links")) {
    if (!message.from) {
      await sendTelegramMessage(
        message.chat.id,
        "❌ Unable to identify user. Please try again."
      );
      return res.status(200).json({ ok: true });
    }

    // Lưu thông tin user nếu chưa có
    await upsertTelegramUser({
      id: message.from.id,
      username: message.from.username,
      first_name: message.from.first_name,
      last_name: message.from.last_name,
      language_code: message.from.language_code,
    });

    const links = await getUserRecentLinks(message.from.id, 5);

    if (links.length === 0) {
      await sendTelegramMessage(
        message.chat.id,
        [
          "📋 Your Links",
          "",
          "You haven't created any links yet.",
          "",
          "Send me a URL to create your first short link!"
        ].join("\n")
      );
      return res.status(200).json({ ok: true });
    }

    const linksText = links
      .map((link, index) => {
        const shortUrl = buildShortUrl(link.code);
        const date = new Date(link.createdAt).toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
        return [
          `${index + 1}. ${shortUrl}`,
          `   → ${truncateUrl(link.longUrl, 50)}`,
          `   📅 ${date} | 👆 ${link.clicks || 0} clicks`,
        ].join("\n");
      })
      .join("\n\n");

    await sendTelegramMessage(
      message.chat.id,
      [
        `📋 Your Recent Links (${links.length})`,
        "",
        linksText,
        "",
        `Total: ${links.length} link${links.length > 1 ? "s" : ""}`,
      ].join("\n")
    );
    return res.status(200).json({ ok: true });
  }

  const match = text.match(URL_REGEX);
  const candidateUrl = match?.[1];

  if (!candidateUrl || !isValidHttpUrl(candidateUrl)) {
    await sendTelegramMessage(
      message.chat.id,
      "❌ Please send a valid http(s) URL so I can create a short link."
    );
    return res.status(200).json({ ok: true });
  }

  // Lưu thông tin user nếu chưa có
  if (message.from) {
    await upsertTelegramUser({
      id: message.from.id,
      username: message.from.username,
      first_name: message.from.first_name,
      last_name: message.from.last_name,
      language_code: message.from.language_code,
    });
  }

  let code = generateShortCode();
  for (let i = 0; i < 3; i++) {
    const existing = await getShortLink(code);
    if (!existing) break;
    code = generateShortCode();
  }

  await saveShortLink(
    code,
    candidateUrl,
    "telegram",
    message.from?.id
  );

  const shortUrl = buildShortUrl(code);

  await sendTelegramMessage(
    message.chat.id,
    `✅ Short link created:\n${shortUrl}`
  );

  return res.status(200).json({ ok: true });
}

async function sendTelegramMessage(chatId: number, text: string): Promise<void> {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      link_preview_options: { is_disabled: true }
    })
  });
}

function truncateUrl(url: string, maxLength: number): string {
  if (url.length <= maxLength) return url;
  return url.substring(0, maxLength - 3) + "...";
}
