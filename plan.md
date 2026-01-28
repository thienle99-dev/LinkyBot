You are a **senior full‑stack engineer and system architect**.

Your task is to **design and implement a URL Shortener system with Telegram Bot integration, deployed on Vercel**, using **production‑ready code**.

---

## 1. Goal

Build a URL Shortener service that works via:

- **Web UI**: Vue 3
- **Telegram Bot**: create short links via chat

Users should be able to:

- Create short links from the website
- Create short links by sending URLs to the Telegram Bot
- Open short links and be redirected correctly

---

## 2. Tech Stack (required)

**Frontend**

- Vue 3 (Composition API)
- Vite
- TailwindCSS

**Backend**

- Vercel Serverless Functions (Node.js / TypeScript)
- Telegram Bot API (Webhook mode)

**Database** – choose **one** and **justify your choice**:

- Upstash Redis (preferred)
- Vercel KV
- Supabase / Postgres

**Deployment**

- Vercel
- Telegram Webhook → Vercel API Route

---

## 3. System Flows (must be fully covered)

### 3.1 Web Flow

1. User enters a long URL in the Vue app
2. Frontend validates the URL
3. Sends `POST /api/shorten`
4. Backend:
   - Generates a `shortCode`
   - Stores `{ shortCode → longUrl, createdAt, source }`
   - Returns the short URL

### 3.2 Telegram Bot Flow

1. User sends a message containing a URL to the bot
2. Telegram sends a webhook update to `/api/telegram/webhook`
3. Backend:
   - Extracts the URL from the message
   - Validates the URL
   - Generates a `shortCode`
   - Stores the mapping in the database
   - Replies to the user with the short URL

### 3.3 Redirect Flow

1. User opens a short URL: `/r/:code`
2. Backend looks up the `code`
3. Redirects to the original URL (301 or 302)
4. Returns 404 if not found or expired

---

## 4. API Design

**POST `/api/shorten`**

- Request:

```json
{
  "url": "https://example.com/long/url"
}
```

- Response:

```json
{
  "shortUrl": "https://your-domain.vercel.app/abc123"
}
```

**POST `/api/telegram/webhook`**

- Handle Telegram updates
- Send messages back to the user via the Telegram Bot API

**GET `/r/:code`**

- Redirect to the corresponding long URL

---

## 5. Telegram Bot Requirements

- Use **Webhook** (no polling)
- Support commands:
  - `/start` → send a welcome message
  - `/help` → send usage instructions
- Automatically detect URLs in text
- Reply format when a link is created:

```text
✅ Short link created:
https://your-domain.vercel.app/abc123
```

---

## 6. Security & Validation

- Validate URL format (only allow `http` / `https`)
- Reject dangerous schemes: `javascript:`, `data:`, `file:`
- Rate limit important APIs
- Prevent shortCode collisions
- Verify the Telegram webhook secret token
- Sanitize all user input

---

## 7. Project Structure (suggested)

```text
/src
  /frontend
    /components
    /pages
    /services
  /api
    shorten.ts
    telegram-webhook.ts
    redirect.ts
  /lib
    db.ts
    shortCode.ts
    urlValidator.ts
  /config
    telegram.ts
    env.ts
```

---

## 8. Optional Features (if time allows)

- Custom alias for short links
- Link expiration
- Click counter
- User identification via `telegram_user_id`
- Admin dashboard
- QR code generation

---

## 9. Required Output

Produce all of the following (you may structure the answer in sections):

1. High‑level architecture explanation
2. Text‑based flow diagrams for the 3 main flows (Web, Telegram, Redirect)
3. Database schema (for the DB you chose)
4. Telegram webhook handler code
5. URL shortening API code
6. Vue frontend code (clean UI, responsive, good UX)
7. Vercel deployment steps
8. Telegram Bot setup instructions (BotFather, webhook, env variables)
9. Notes on scaling & optimization (rate limiting, caching, cold starts, etc.)

**General requirements**:

- Code must be **production‑quality**, clear, and maintainable.
- Briefly explain key decisions (DB, schema, security, flows).
- **Do not skip any Telegram integration details.**
