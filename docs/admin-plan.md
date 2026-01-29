# Plan: Trang Admin quản lý Short Links

## 1. Mục tiêu

- Trang **Admin** cho phép xem danh sách link, thống kê, xóa link.
- Chỉ người có quyền (admin) mới truy cập được.
- Tái dùng stack hiện tại: Vue 3, Vite, Tailwind, Supabase, Vercel.

---

## 2. Phạm vi tính năng

| Tính năng | Mô tả | Ưu tiên |
|-----------|--------|---------|
| **Danh sách links** | Bảng: code, long URL, short URL, source (web/telegram), created_at, clicks | P0 |
| **Phân trang / tìm kiếm** | Phân trang, filter theo source, tìm theo code hoặc URL | P0 |
| **Xóa link** | Nút xóa từng link, confirm trước khi xóa | P0 |
| **Thống kê tổng quan** | Tổng số link, số link hôm nay, tổng clicks | P1 |
| **Export** | Export danh sách (CSV/JSON) | P2 |
| **Auth đơn giản** | Đăng nhập bằng password (env) hoặc Telegram Login | P0 |

---

## 3. Bảo mật & Auth

**Lựa chọn đề xuất: Admin Secret Token (đơn giản)**

- Biến môi trường: `ADMIN_SECRET_TOKEN` (chuỗi bí mật).
- Frontend: Trang `/admin` có form nhập **password** (chính là token).
- Gửi lên API: `POST /api/admin/auth` với body `{ token }`. API so sánh với `ADMIN_SECRET_TOKEN`, nếu đúng trả về JWT ngắn hạn (hoặc session token) lưu trong `localStorage` / cookie.
- Mọi request admin khác: Header `Authorization: Bearer <token>` hoặc cookie. API `/api/admin/*` kiểm tra token trước khi xử lý.

**Luồng:**

1. User mở `/admin` → redirect đến `/admin/login` nếu chưa có token.
2. Nhập password (admin token) → gọi `POST /api/admin/auth` → nhận token → lưu (localStorage/cookie) → chuyển vào `/admin` (dashboard).
3. Các API admin (`GET /api/admin/links`, `DELETE /api/admin/links/:code`) luôn kiểm tra token.

**Lưu ý:** Không dùng Supabase RLS cho admin (hoặc dùng service role chỉ ở server). Admin API chạy trên Vercel, dùng Supabase **service role** hoặc client với quyền đọc/xóa `links`.

---

## 4. API Admin

**Base path:** `/api/admin/*`. Mọi route đều kiểm tra header `Authorization: Bearer <ADMIN_TOKEN>` hoặc cookie session.

| Method | Path | Mô tả |
|--------|------|--------|
| POST | `/api/admin/auth` | Body `{ token }`. So sánh với `ADMIN_SECRET_TOKEN`, trả về JWT/session nếu đúng. |
| GET | `/api/admin/links` | Query: `page`, `limit`, `source` (web \| telegram), `search` (code hoặc URL). Trả về danh sách links + total. |
| DELETE | `/api/admin/links/:code` | Xóa link theo `code`. Trả về 204 hoặc 200. |
| GET | `/api/admin/stats` | Trả về: `totalLinks`, `linksToday`, `totalClicks` (nếu có cột clicks). |

**Ví dụ response GET /api/admin/links**

```json
{
  "data": [
    {
      "code": "abc123",
      "original_url": "https://example.com/long",
      "short_url": "https://sl0.vercel.app/r/abc123",
      "source": "web",
      "created_at": "2026-01-28T10:00:00.000Z",
      "clicks": 42
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 20
}
```

---

## 5. Database

- Giữ nguyên bảng **links** hiện tại (Supabase): `code`, `original_url`, `created_at`, `source`, `clicks` (nếu đã có).
- Không bắt buộc thêm bảng admin user nếu dùng Admin Secret Token.
- Nếu sau này dùng Telegram Login: có thể thêm bảng `admin_users` (telegram_user_id, role) và RLS hoặc check trong API.

---

## 6. Frontend (Vue 3)

**Cấu trúc thêm:**

```text
src/frontend/
  pages/
    AdminLogin.vue    # Form nhập password (admin token)
    AdminDashboard.vue # Bảng links + stats + nút xóa
  components/
    AdminLinkTable.vue
    AdminStats.vue
  services/
    adminApi.ts      # Gọi /api/admin/auth, /api/admin/links, ...
  router (nếu dùng Vue Router)
    /admin          → AdminDashboard (guard: đã login?)
    /admin/login    → AdminLogin
```

**Luồng UI:**

1. **AdminLogin:** 1 input password, 1 nút "Đăng nhập". Gọi `POST /api/admin/auth`. Thành công → lưu token, redirect `/admin`.
2. **AdminDashboard:**
   - Góc trên: thẻ thống kê (tổng link, link hôm nay, tổng clicks).
   - Bảng: cột Code, Long URL, Short URL, Source, Created, Clicks, Actions (Copy short URL, Xóa).
   - Phân trang: prev/next hoặc số trang.
   - Filter: dropdown source (All / web / telegram), ô tìm theo code hoặc URL.
3. Xóa: click Xóa → confirm → `DELETE /api/admin/links/:code` → cập nhật danh sách hoặc refetch.

**Bảo vệ route:** Trước khi vào `/admin` (dashboard), check trong `localStorage`/cookie có token; không có thì redirect `/admin/login`.

---

## 7. Cấu trúc file backend (Vercel)

```text
api/
  admin/
    auth.post.ts     # hoặc auth.ts với method POST
    links.get.ts     # GET /api/admin/links
    links/[code].delete.ts  # DELETE /api/admin/links/:code
    stats.get.ts     # GET /api/admin/stats
  _lib/
    adminAuth.ts     # Hàm kiểm tra Bearer token hoặc cookie
```

- `adminAuth.ts`: đọc header `Authorization: Bearer <token>`, so sánh với `ADMIN_SECRET_TOKEN`; trả về 401 nếu sai.
- Các handler `links`, `stats`, `delete` gọi `adminAuth(req)` trước khi truy vấn Supabase.

---

## 8. Biến môi trường

| Biến | Mô tả |
|------|--------|
| `ADMIN_SECRET_TOKEN` | Chuỗi bí mật dùng làm "password" admin và để verify API. |

Đặt trong Vercel Project Settings và `.env` local.

---

## 9. Thứ tự triển khai gợi ý

1. **Backend**
   - Thêm `ADMIN_SECRET_TOKEN` vào config.
   - Implement `api/admin/auth.post.ts` (so sánh token, trả về JWT đơn giản hoặc session).
   - Implement `api/admin/links.get.ts` (đọc từ Supabase, phân trang, filter, search).
   - Implement `api/admin/links/[code].delete.ts` (xóa theo code).
   - Implement `api/admin/stats.get.ts` (aggregate từ bảng links).
   - Dùng chung helper `adminAuth` cho các route admin.

2. **Frontend**
   - Thêm route `/admin`, `/admin/login` (Vue Router hoặc điều kiện component).
   - Trang AdminLogin + gọi `POST /api/admin/auth`, lưu token.
   - Trang AdminDashboard: gọi stats + links, hiển thị bảng + phân trang + filter + xóa.

3. **Kiểm thử**
   - Test đăng nhập sai token → 401.
   - Test GET links, DELETE link, GET stats khi đã có token hợp lệ.

---

## 10. Tóm tắt

- **Auth:** Admin Secret Token; login bằng password (token), API admin verify token mỗi request.
- **API:** `POST /api/admin/auth`, `GET /api/admin/links`, `DELETE /api/admin/links/:code`, `GET /api/admin/stats`.
- **Frontend:** `/admin/login`, `/admin` (dashboard) với bảng links, stats, phân trang, filter, xóa.
- **DB:** Giữ bảng `links` hiện tại; dùng Supabase với quyền đủ để đọc/xóa từ server.

Sau khi làm xong bước 1–3, có thể mở rộng: Telegram Login Widget cho admin, export CSV, chỉnh sửa link (đổi destination URL).
