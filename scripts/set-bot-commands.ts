import dotenv from "dotenv";
dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!BOT_TOKEN) {
  console.error("❌ TELEGRAM_BOT_TOKEN is missing in .env");
  process.exit(1);
}

const COMMANDS = [
  { command: "start", description: "Bắt đầu sử dụng bot" },
  { command: "help", description: "Hướng dẫn sử dụng" },
  { command: "menu", description: "Hiển thị menu tương tác" },
  { command: "links", description: "Xem danh sách link của bạn" },
  { command: "stats", description: "Xem thống kê link" }
];

async function setBotCommands() {
  const apiUrl = `https://api.telegram.org/bot${BOT_TOKEN}/setMyCommands`;

  console.log("🔌 Registering bot commands...");

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        commands: COMMANDS
      })
    });

    const data = await res.json();

    if (data.ok) {
      console.log("✅ Bot commands registered successfully!");
      COMMANDS.forEach(cmd => {
        console.log(`   /${cmd.command} - ${cmd.description}`);
      });
    } else {
      console.error("❌ Failed to register commands:");
      console.error(JSON.stringify(data, null, 2));
    }
  } catch (error: any) {
    console.error("❌ Error sending request:", error.message);
  }
}

setBotCommands();
