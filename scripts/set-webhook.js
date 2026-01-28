require('dotenv').config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBHOOK_URL = process.argv[2]; // Pass the full URL as argument
const SECRET_TOKEN = process.env.TELEGRAM_WEBHOOK_SECRET_TOKEN;

if (!BOT_TOKEN) {
    console.error('❌ TELEGRAM_BOT_TOKEN is missing in .env');
    process.exit(1);
}

if (!WEBHOOK_URL) {
    console.error('❌ Please provide the webhook URL as an argument.');
    console.log('Usage: node scripts/set-webhook.js <YOUR_VERCEL_DOMAIN_OR_NGROK_URL>/api/telegram-webhook');
    process.exit(1);
}

async function setWebhook() {
    const apiUrl = `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`;

    const params = new URLSearchParams();
    params.append('url', WEBHOOK_URL);
    if (SECRET_TOKEN) {
        params.append('secret_token', SECRET_TOKEN);
    }

    console.log(`🔌 Setting webhook to: ${WEBHOOK_URL}...`);

    try {
        const res = await fetch(apiUrl, {
            method: 'POST',
            body: params,
        });

        const data = await res.json();

        if (data.ok) {
            console.log('✅ Webhook set successfully!');
            console.log(data);
        } else {
            console.error('❌ Failed to set webhook:');
            console.error(data);
        }
    } catch (error) {
        console.error('❌ Error sending request:', error.message);
    }
}

setWebhook();
