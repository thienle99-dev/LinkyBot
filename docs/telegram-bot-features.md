# Gợi ý tính năng thêm cho Telegram Bot

## Đã có hiện tại
- `/start`, `/help`
- Tự động detect URL trong tin nhắn → tạo short link và reply

---

## Tính năng nên thêm (theo ưu tiên)

### 1. **Custom alias** (tùy chọn short code)
- **Cách dùng:** User gửi `https://example.com/long myalias` → bot tạo link `/r/myalias`.
- **Logic:** Parse "URL + khoảng trắng + alias". Validate alias (chỉ a-z, 0-9, độ dài giới hạn). Nếu alias trùng → báo lỗi hoặc gợi ý alias khác.
- **Lợi:** Link dễ nhớ, dễ chia sẻ.

### 2. **Lưu telegram_user_id khi tạo link**
- Lưu thêm `telegram_user_id` vào bảng `links` (hoặc bảng riêng) mỗi khi tạo link từ bot.
- **Lợi:** Làm nền cho "xem link của tôi", "xóa link của tôi", giới hạn theo user.

### 3. **/links — Xem link vừa tạo**
- Command `/links` (hoặc `/mylinks`): bot trả về danh sách N link gần nhất do user đó tạo (dựa trên `telegram_user_id`).
- Format: từng dòng `shortUrl → longUrl` hoặc bảng gọn.
- **Lợi:** User không cần lưu lại từng tin nhắn.

### 4. **/delete &lt;code&gt; — Xóa link của mình**
- Chỉ cho phép xóa link do chính user đó tạo (so `telegram_user_id`).
- Reply: "Đã xóa" hoặc "Không tìm thấy / không có quyền".
- **Lợi:** Thu hồi link sai hoặc không dùng nữa.

### 5. **/stats [code] — Thống kê**
- `/stats`: tổng số link user đã tạo + tổng clicks (nếu có).
- `/stats abc123`: số lần click của link có code `abc123` (chỉ với link do user đó tạo).
- **Lợi:** Biết link nào được dùng nhiều.

### 6. **QR code**
- Khi bot reply "Short link created", gửi kèm ảnh QR của short URL (dùng lib tạo QR trên server, hoặc link tới API QR như `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=<shortUrl>`).
- Hoặc command riêng: `/qr <code>` → gửi ảnh QR.
- **Lợi:** Tiện in hoặc chia sẻ offline.

### 7. **Rút gọn nhiều link trong một tin**
- User gửi nhiều dòng, mỗi dòng một URL. Bot reply từng short link tương ứng.
- **Lợi:** Tạo hàng loạt link nhanh.

### 8. **Hết hạn (TTL) tùy chọn**
- Cú pháp ví dụ: `https://example.com 7d` → link hết hạn sau 7 ngày.
- Cần: cột `expires_at` trong DB; redirect kiểm tra hết hạn trước khi redirect.
- **Lợi:** Link tạm thời, ít rác.

### 9. **Rate limit theo user**
- Giới hạn số link tạo/giờ (ví dụ 20 link/1h) theo `telegram_user_id`.
- Khi vượt: reply "Bạn đã tạo đủ link trong giờ này, thử lại sau."
- **Lợi:** Chống spam, lạm dụng.

### 10. **Inline mode** (nâng cao)
- User gõ `@t_shortlink_bot https://example.com` trong bất kỳ chat nào → chọn kết quả để gửi short link.
- Cần bật Inline Mode trong BotFather và xử lý `inline_query` trong webhook.
- **Lợi:** Trải nghiệm nhanh, không cần mở chat bot.

### 11. **Đa ngôn ngữ (i18n)**
- `/start`, `/help` và toàn bộ message theo ngôn ngữ (tiếng Việt / English) dựa trên `ctx.from.language_code` hoặc user chọn.
- **Lợi:** Dễ dùng cho nhiều đối tượng.

---

## Gợi ý thứ tự làm

| Bước | Tính năng | Ghi chú |
|------|-----------|--------|
| 1 | Lưu `telegram_user_id` khi tạo link | Migration/cột mới trong `links` |
| 2 | Custom alias | Parse "URL + alias", validate, lưu code = alias |
| 3 | `/links` | Query theo `telegram_user_id`, limit 10–20 |
| 4 | `/delete <code>` | Chỉ xóa link của user đó |
| 5 | `/stats` và `/stats <code>` | Dùng cột `clicks` sẵn có |
| 6 | Rate limit theo user | In-memory hoặc Redis/DB đếm theo user + giờ |
| 7 | QR code | API hoặc lib tạo QR, gửi ảnh kèm reply |
| 8 | Nhiều URL trong một tin | Split lines, loop tạo link |
| 9 | TTL (expires_at) | Schema + logic redirect |
| 10 | Inline mode, i18n | Tuỳ nhu cầu |

---

## Tóm tắt

- **Nên làm sớm:** Lưu `telegram_user_id`, custom alias, `/links`, `/delete`, `/stats`, rate limit.
- **Làm thêm khi cần:** QR, nhiều URL/tin, TTL, inline mode, i18n.

Bạn muốn triển khai tính năng nào trước thì có thể bắt đầu từ bước tương ứng trong bảng trên.
