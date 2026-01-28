require("dotenv").config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const PRODUCTION_URL = process.env.APP_BASE_URL || "https://slb0.vercel.app";
const WEBHOOK_URL = `${PRODUCTION_URL}/api/telegram-webhook`;
const SECRET_TOKEN = process.env.TELEGRAM_WEBHOOK_SECRET_TOKEN;

if (!BOT_TOKEN) {
  console.error("❌ TELEGRAM_BOT_TOKEN is missing in .env");
  process.exit(1);
}

async function setWebhook() {
  const apiUrl = `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`;

  const params = new URLSearchParams();
  params.append("url", WEBHOOK_URL);
  if (SECRET_TOKEN) {
    params.append("secret_token", SECRET_TOKEN);
  }

  console.log(`🔌 Setting Telegram webhook to: ${WEBHOOK_URL}...`);

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      body: params
    });

    const data = await res.json();

    if (data.ok) {
      console.log("✅ Webhook set successfully!");
      console.log(`   Bot: @t_shortlink_bot`);
      console.log(`   Webhook URL: ${WEBHOOK_URL}`);
      console.log(`   Secret token: ${SECRET_TOKEN ? "✅ Set" : "❌ Not set"}`);
      console.log("\n📝 Test your bot:");
      console.log(`   https://t.me/t_shortlink_bot`);
    } else {
      console.error("❌ Failed to set webhook:");
      console.error(JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error("❌ Error sending request:", error.message);
  }
}

setWebhook();
