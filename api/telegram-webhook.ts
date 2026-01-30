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
import * as db from "./_lib/db.js";
import { generateShortCode } from "./_lib/shortCode.js";

import {
  createMainMenu,
  createBackToMenuButton,
  getMenuContent,
  MENU_ACTIONS
} from "./_lib/telegram-menu.js";

const URL_REGEX =
  /(https?:\/\/[^\s/$.?#].[^\s]*)/i;

const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

// Handle /start command
bot.start(async (ctx: Context) => {
  if (ctx.from) {
    await db.upsertTelegramUser(ctx.from);
  }

  await ctx.reply(
    `👋 Chào mừng @${ctx.from?.username || "bạn"} đến với @${TELEGRAM_BOT_USERNAME}!\n\n` +
    getMenuContent("main"),
    { 
      ...createMainMenu(),
      link_preview_options: { is_disabled: true } 
    } as any
  );
});

// Handle /help command
bot.help(async (ctx: Context) => {
  await ctx.reply(
    getMenuContent(MENU_ACTIONS.HELP),
    { 
      ...createBackToMenuButton(),
      parse_mode: "Markdown",
      link_preview_options: { is_disabled: true } 
    } as any
  );
});

// Handle /menu command
bot.command("menu", async (ctx: Context) => {
  await ctx.reply(
    getMenuContent("main"),
    createMainMenu()
  );
});

async function handleLinksCommand(ctx: Context) {
  const userId = ctx.from?.id;
  if (!userId) return;

  const links = await db.getUserLinks(userId, 10);
  
  if (links.length === 0) {
    await ctx.reply("💬 Bạn chưa tạo link nào. Hãy gửi cho tôi một URL để bắt đầu!", createMainMenu());
    return;
  }

  const list = links.map((link, i) => {
    const short = db.buildShortUrl(link.code);
    return `${i + 1}. \`${short}\`\n   ↳ ${link.longUrl.substring(0, 40)}${link.longUrl.length > 40 ? '...' : ''}\n   📊 Clicks: \`${link.clicks || 0}\``;
  }).join("\n\n");

  await ctx.reply(`📋 **10 link gần đây của bạn:**\n\n${list}`, { 
    parse_mode: "Markdown",
    link_preview_options: { is_disabled: true }
  } as any);
}

// Handle /links command
bot.command("links", handleLinksCommand);

// Handle callback queries
bot.on("callback_query", async (ctx: Context) => {
  const callbackQuery = ctx.callbackQuery;
  if (!callbackQuery || !("data" in callbackQuery)) return;

  const data = callbackQuery.data;
  const chatId = ctx.chat?.id;
  const fromId = ctx.from?.id;
  const messageId = ctx.callbackQuery.message?.message_id;

  if (!chatId || !messageId) return;

  try {
    if (data === MENU_ACTIONS.MAIN) {
      await ctx.telegram.editMessageText(
        chatId,
        messageId,
        undefined,
        getMenuContent("main"),
        { 
          ...createMainMenu(),
          parse_mode: "Markdown"
        } as any
      );
    } else if (data === MENU_ACTIONS.MY_LINKS) {
      if (!fromId) return;
      const links = await db.getUserLinks(fromId, 10);
      
      if (links.length === 0) {
        await ctx.telegram.editMessageText(
          chatId,
          messageId,
          undefined,
          "💬 Bạn chưa tạo link nào. Hãy gửi cho tôi một URL để bắt đầu!",
          createBackToMenuButton()
        );
      } else {
        const list = links.map((link, i) => {
          const short = db.buildShortUrl(link.code);
          return `${i + 1}. \`${short}\`\n   📈 Clicks: \`${link.clicks || 0}\``;
        }).join("\n\n");

        await ctx.telegram.editMessageText(
          chatId,
          messageId,
          undefined,
          `📋 **Top 10 link gần đây:**\n\n${list}`,
          { 
            ...createBackToMenuButton(),
            parse_mode: "Markdown",
            link_preview_options: { is_disabled: true }
          } as any
        );
      }
    } else {
      await ctx.telegram.editMessageText(
        chatId,
        messageId,
        undefined,
        getMenuContent(data),
        { 
          ...createBackToMenuButton(),
          parse_mode: "Markdown"
        } as any
      );
    }

    // Always answer callback queries
    await ctx.answerCbQuery();
  } catch (error) {
    console.error("Error handling callback query:", error);
    await ctx.answerCbQuery("Có lỗi xảy ra, vui lòng thử lại sau.");
  }
});

bot.on("text", async (ctx: Context) => {
  const message = ctx.message;
  if (!message || !("text" in message)) return;
  const text = (message as Message.TextMessage).text;
  if (!text) return;

  // Let core commands be handled by their respective handlers
  if (text.startsWith("/start") || text.startsWith("/help") || text.startsWith("/menu")) return;

  const match = text.match(URL_REGEX);
  const candidateUrl = match?.[1];

  if (!candidateUrl || !isValidHttpUrl(candidateUrl)) {
    await ctx.reply("❌ Vui lòng gửi một URL hợp lệ (bắt đầu với http:// hoặc https://) để tôi rút gọn.");
    return;
  }

  let code = generateShortCode();
  for (let i = 0; i < 3; i++) {
    const existing = await db.getShortLink(code);
    if (!existing) break;
    code = generateShortCode();
  }

  // Save the user info first (or upsert)
  if (ctx.from) {
    await db.upsertTelegramUser(ctx.from);
  }

  await db.saveShortLink(code, candidateUrl, "telegram", ctx.from?.id);
  const shortUrl = db.buildShortUrl(code);

  console.log("[shorten] link generated", {
    source: "telegram",
    code,
    shortUrl,
    longUrl: candidateUrl,
    telegramUserId: ctx.from?.id,
    at: new Date().toISOString()
  });

  await ctx.reply(`✅ Short link created:\n\`${shortUrl}\``, {
    parse_mode: "MarkdownV2",
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

