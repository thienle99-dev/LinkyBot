#!/usr/bin/env tsx
import { config } from "dotenv";
import { spawn } from "child_process";
config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_WEBHOOK_SECRET_TOKEN = process.env.TELEGRAM_WEBHOOK_SECRET_TOKEN;
const LOCAL_API_PORT = process.env.LOCAL_API_PORT || "3001";

console.log("🚀 Starting dev server with Telegram webhook tunnel...\n");

// Check if ngrok is available
const ngrokCheck = spawn("which", ["ngrok"], { stdio: "pipe" });
ngrokCheck.on("close", (code) => {
  if (code !== 0) {
    console.error(
      "❌ ngrok is not installed!\n" +
        "💡 Install it with:\n" +
        "   brew install ngrok/ngrok/ngrok  (macOS)\n" +
        "   or download from https://ngrok.com/download\n\n" +
        "📝 Alternatively, you can:\n" +
        "   1. Use Cloudflare Tunnel (cloudflared)\n" +
        "   2. Deploy to Vercel and set webhook there\n" +
        "   3. Use localtunnel: npx localtunnel --port 3001"
    );
    process.exit(1);
  }

  // Start ngrok tunnel
  console.log("🌐 Starting ngrok tunnel on port", LOCAL_API_PORT);
  const ngrok = spawn("ngrok", ["http", LOCAL_API_PORT, "--log=stdout"], {
    stdio: ["ignore", "pipe", "pipe"]
  });

  let ngrokUrl = "";
  let webhookUrl = "";

  ngrok.stdout.on("data", (data: Buffer) => {
    const output = data.toString();
    const match = output.match(/https:\/\/[a-z0-9-]+\.ngrok-free\.app/g);
    if (match && match[0] && !ngrokUrl) {
      ngrokUrl = match[0];
      webhookUrl = `${ngrokUrl}/api/telegram-webhook`;
      console.log(`\n✅ Tunnel established: ${ngrokUrl}`);
      console.log(`📡 Webhook URL: ${webhookUrl}\n`);

      if (TELEGRAM_BOT_TOKEN) {
        setTelegramWebhook(webhookUrl);
      } else {
        console.log(
          "⚠️  TELEGRAM_BOT_TOKEN not found in .env\n" +
            "   Webhook URL ready, but not set in Telegram.\n" +
            `   Run manually: node scripts/set-webhook.js ${webhookUrl}`
        );
      }
    }
  });

  ngrok.stderr.on("data", (data: Buffer) => {
    const output = data.toString();
    if (output.includes("started tunnel")) {
      console.log("🔄 Waiting for tunnel URL...");
    }
  });

  ngrok.on("close", (code) => {
    console.log(`\n❌ ngrok tunnel closed (code: ${code})`);
    process.exit(code || 0);
  });

  // Handle cleanup
  process.on("SIGINT", () => {
    console.log("\n\n🛑 Shutting down...");
    ngrok.kill();
    process.exit(0);
  });
});

async function setTelegramWebhook(webhookUrl: string) {
  if (!TELEGRAM_BOT_TOKEN) return;

  const apiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook`;

  const params = new URLSearchParams();
  params.append("url", webhookUrl);
  if (TELEGRAM_WEBHOOK_SECRET_TOKEN) {
    params.append("secret_token", TELEGRAM_WEBHOOK_SECRET_TOKEN);
  }

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      body: params
    });

    const data = await res.json();

    if (data.ok) {
      console.log("✅ Telegram webhook set successfully!");
      console.log(`   Bot will receive updates at: ${webhookUrl}\n`);
    } else {
      console.error("❌ Failed to set Telegram webhook:");
      console.error(JSON.stringify(data, null, 2));
      console.log(`\n💡 Set manually: node scripts/set-webhook.js ${webhookUrl}`);
    }
  } catch (error: any) {
    console.error("❌ Error setting webhook:", error.message);
    console.log(`\n💡 Set manually: node scripts/set-webhook.js ${webhookUrl}`);
  }
}
