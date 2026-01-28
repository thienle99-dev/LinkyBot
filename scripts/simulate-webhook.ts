import { config } from "dotenv";
config(); // Load env vars

// Mock Vercel Request/Response
const req = {
    method: "POST",
    body: {
        update_id: 123456789,
        message: {
            message_id: 1,
            from: { id: 999999, first_name: "TestUser" },
            chat: { id: 999999, type: "private" },
            text: "https://google.com"
        }
    },
    headers: {}
};

const res: any = {
    statusCode: 200,
    setHeader: (key: string, value: string) => {
        console.log(`[Header] ${key}: ${value}`);
    },
    status: function (code: number) {
        this.statusCode = code;
        return this;
    },
    json: function (data: any) {
        console.log(`[Response ${this.statusCode}]`, JSON.stringify(data, null, 2));
        return this;
    },
    send: function (data: any) {
        console.log(`[Response ${this.statusCode}]`, data);
        return this;
    }
};

// We need to use dynamic import because the handler is a TS file and we are running via ts-node
async function run() {
    try {
        const handlerModule = await import("../api/telegram-webhook.ts");
        const handler = handlerModule.default;

        console.log("--- Simulating Webhook Request ---");
        console.log("Input:", JSON.stringify(req.body, null, 2));

        await handler(req as any, res as any);

        console.log("--- Done ---");
    } catch (err: any) {
        console.error("Error running simulation:", err);
    }
}

run();
