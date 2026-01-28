#!/usr/bin/env tsx
import { config } from "dotenv";
config();

const API_URL = process.env.API_URL || "http://localhost:3001/api/telegram-webhook";
const TELEGRAM_WEBHOOK_SECRET_TOKEN = process.env.TELEGRAM_WEBHOOK_SECRET_TOKEN;

interface TestCase {
  name: string;
  update: {
    update_id: number;
    message?: {
      message_id: number;
      from?: { id: number; first_name?: string };
      chat: { id: number; type: string };
      text?: string;
    };
  };
}

const testCases: TestCase[] = [
  {
    name: "Test /start command",
    update: {
      update_id: 1,
      message: {
        message_id: 1,
        from: { id: 123456789, first_name: "TestUser" },
        chat: { id: 123456789, type: "private" },
        text: "/start"
      }
    }
  },
  {
    name: "Test /help command",
    update: {
      update_id: 2,
      message: {
        message_id: 2,
        from: { id: 123456789, first_name: "TestUser" },
        chat: { id: 123456789, type: "private" },
        text: "/help"
      }
    }
  },
  {
    name: "Test URL shortening",
    update: {
      update_id: 3,
      message: {
        message_id: 3,
        from: { id: 123456789, first_name: "TestUser" },
        chat: { id: 123456789, type: "private" },
        text: "https://example.com/very/long/url/path"
      }
    }
  },
  {
    name: "Test invalid URL",
    update: {
      update_id: 4,
      message: {
        message_id: 4,
        from: { id: 123456789, first_name: "TestUser" },
        chat: { id: 123456789, type: "private" },
        text: "This is not a URL"
      }
    }
  },
  {
    name: "Test URL in text",
    update: {
      update_id: 5,
      message: {
        message_id: 5,
        from: { id: 123456789, first_name: "TestUser" },
        chat: { id: 123456789, type: "private" },
        text: "Check out this link: https://google.com/search?q=test"
      }
    }
  }
];

async function testWebhook(testCase: TestCase) {
  console.log(`\n🧪 Testing: ${testCase.name}`);
  console.log(`📤 Sending update:`, JSON.stringify(testCase.update, null, 2));

  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  };

  if (TELEGRAM_WEBHOOK_SECRET_TOKEN) {
    headers["x-telegram-bot-api-secret-token"] = TELEGRAM_WEBHOOK_SECRET_TOKEN;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(API_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(testCase.update),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const status = response.status;
    let data: any;
    try {
      data = await response.json();
    } catch {
      data = { text: await response.text() };
    }

    if (status === 200) {
      console.log(`✅ Success (${status}):`, JSON.stringify(data, null, 2));
    } else {
      console.log(`❌ Error (${status}):`, JSON.stringify(data, null, 2));
    }
  } catch (error: any) {
    if (error.name === "AbortError") {
      console.error(`❌ Request timeout after 10 seconds`);
      console.error(`💡 The API server might be slow or not responding.`);
    } else {
      console.error(`❌ Request failed:`, error.message);
      if (error.message.includes("ECONNREFUSED") || error.code === "ECONNREFUSED") {
        console.error(
          `\n💡 Make sure the dev server is running:\n   pnpm dev\n\n   Or set API_URL environment variable:\n   API_URL=http://localhost:3001/api/telegram-webhook pnpm test:bot`
        );
      }
    }
  }
}

async function checkServerHealth() {
  try {
    const baseUrl = API_URL.replace("/api/telegram-webhook", "");
    const response = await fetch(`${baseUrl}/api/shorten`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: "https://example.com" }),
      signal: AbortSignal.timeout(3000)
    });
    return true;
  } catch (error: any) {
    if (error.name === "AbortError" || error.message.includes("ECONNREFUSED")) {
      return false;
    }
    return true; // Other errors might mean server is running but endpoint has issues
  }
}

async function runTests() {
  console.log("🤖 Telegram Bot Webhook Test Suite");
  console.log("=".repeat(50));
  console.log(`📍 API URL: ${API_URL}`);
  console.log(`🔐 Webhook Secret: ${TELEGRAM_WEBHOOK_SECRET_TOKEN ? "✅ Set" : "❌ Not set"}`);
  console.log("=".repeat(50));

  console.log("\n🔍 Checking if API server is running...");
  const serverRunning = await checkServerHealth();
  if (!serverRunning) {
    console.error(
      "\n❌ API server is not responding!\n" +
        "💡 Please start the dev server first:\n" +
        "   pnpm dev\n\n" +
        "   Then run this test again in another terminal."
    );
    process.exit(1);
  }
  console.log("✅ API server is running\n");

  for (const testCase of testCases) {
    await testWebhook(testCase);
    await new Promise((resolve) => setTimeout(resolve, 500)); // Small delay between tests
  }

  console.log("\n✨ Test suite completed!");
}

runTests().catch(console.error);
