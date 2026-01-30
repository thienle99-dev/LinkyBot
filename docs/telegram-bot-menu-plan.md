# Kế hoạch bổ sung Menu cho Telegram Bot

## Tổng quan

Thêm menu vào Telegram bot để cải thiện trải nghiệm người dùng, giúp họ dễ dàng khám phá và sử dụng các tính năng của bot.

## Các loại Menu trong Telegram Bot

### 1. **Bot Commands Menu** (Menu lệnh)
- Menu hiển thị khi người dùng gõ `/` trong chat với bot
- Được cấu hình qua BotFather
- Hiển thị danh sách các lệnh có sẵn

### 2. **Inline Keyboard Menu** (Menu nút bấm)
- Menu tương tác với các nút bấm
- Có thể cập nhật động
- Hiển thị khi người dùng dùng lệnh `/menu` hoặc `/start`

### 3. **Persistent Menu** (Menu cố định)
- Menu luôn hiển thị ở dưới cùng của chat
- Sử dụng Bot Commands Menu (mặc định của Telegram)

## Kế hoạch triển khai

### Phase 1: Bot Commands Menu (Ưu tiên cao)

#### Mục tiêu
Thiết lập menu lệnh cơ bản để người dùng dễ dàng xem các lệnh có sẵn.

#### Các lệnh sẽ thêm vào menu:
```
start - Bắt đầu sử dụng bot
help - Hướng dẫn sử dụng
menu - Hiển thị menu tương tác
links - Xem danh sách link của bạn
stats - Xem thống kê link
```

#### Cách triển khai:
1. Tạo script để đăng ký commands với BotFather API
2. Script sẽ gọi Telegram Bot API: `setMyCommands`
3. Có thể chạy script này khi deploy hoặc setup bot

#### File cần tạo:
- `scripts/set-bot-commands.ts` - Script đăng ký commands

---

### Phase 2: Inline Keyboard Menu (Ưu tiên cao)

#### Mục tiêu
Tạo menu tương tác với các nút bấm để người dùng dễ dàng điều hướng.

#### Cấu trúc menu:
```
┌─────────────────────────┐
│  📋 MENU CHÍNH          │
├─────────────────────────┤
│ [🔗 Rút gọn link]       │
│ [📊 Xem link của tôi]   │
│ [📈 Thống kê]           │
│ [❓ Trợ giúp]           │
│ [ℹ️  Thông tin bot]     │
└─────────────────────────┘
```

#### Tính năng:
- Menu chính với các nút chính
- Menu con cho từng tính năng (nếu cần)
- Nút "Quay lại" để quay về menu chính
- Cập nhật message thay vì gửi message mới (editMessageText)

#### File cần chỉnh sửa:
- `src/api/telegram-webhook.ts` - Thêm xử lý callback_query và menu

---

### Phase 3: Menu Context-Aware (Tùy chọn, nâng cao)

#### Mục tiêu
Menu thông minh hiển thị các tùy chọn phù hợp với ngữ cảnh.

#### Ví dụ:
- Nếu user chưa có link nào → Ẩn nút "Xem link của tôi"
- Nếu user có nhiều link → Hiển thị nút "Xem thêm"
- Menu khác nhau cho user mới vs user cũ

---

## Chi tiết triển khai

### 1. Bot Commands Menu

#### Script: `scripts/set-bot-commands.ts`

```typescript
// Đăng ký commands với Telegram Bot API
// Sử dụng setMyCommands endpoint
```

**Commands sẽ đăng ký:**
- `start` - Bắt đầu sử dụng bot
- `help` - Hướng dẫn sử dụng  
- `menu` - Hiển thị menu tương tác
- `links` - Xem danh sách link của bạn (sẽ implement sau)
- `stats` - Xem thống kê link (sẽ implement sau)

**Lưu ý:**
- Commands có thể có description tối đa 256 ký tự
- Có thể đặt commands cho từng ngôn ngữ (language_code)
- Commands sẽ tự động hiển thị khi user gõ `/`

---

### 2. Inline Keyboard Menu

#### Cấu trúc dữ liệu:

```typescript
interface MenuButton {
  text: string;
  callback_data: string;
}

interface InlineKeyboard {
  inline_keyboard: MenuButton[][];
}
```

#### Callback data format:
- `menu:main` - Menu chính
- `menu:shorten` - Rút gọn link
- `menu:mylinks` - Xem link của tôi
- `menu:stats` - Thống kê
- `menu:help` - Trợ giúp
- `menu:about` - Thông tin bot

#### Flow xử lý:

1. User gửi `/menu` hoặc `/start`
2. Bot gửi message với Inline Keyboard
3. User click vào nút
4. Bot nhận `callback_query`
5. Bot xử lý action tương ứng
6. Bot cập nhật message (editMessageText) hoặc gửi message mới

#### Xử lý callback_query:

```typescript
if (update.callback_query) {
  const { data, message, from } = update.callback_query;
  
  // Parse callback_data
  const [action, ...params] = data.split(':');
  
  switch (action) {
    case 'menu':
      handleMenuAction(params[0], from.id, message.chat.id);
      break;
    // ... other actions
  }
  
  // Answer callback để bỏ loading state
  await answerCallbackQuery(callback_query.id);
}
```

---

### 3. Cải thiện /start command

#### Hiện tại:
- Chỉ gửi text message

#### Sau khi có menu:
- Gửi message chào mừng
- Kèm theo Inline Keyboard Menu
- Format đẹp hơn với emoji và cấu trúc rõ ràng

---

## Cấu trúc code

### File cần tạo/chỉnh sửa:

1. **`scripts/set-bot-commands.ts`** (MỚI)
   - Script đăng ký Bot Commands với Telegram API
   - Có thể chạy độc lập hoặc trong CI/CD

2. **`src/api/telegram-webhook.ts`** (CHỈNH SỬA)
   - Thêm xử lý `callback_query` cho Inline Keyboard
   - Thêm hàm tạo menu keyboard
   - Thêm hàm xử lý các action từ menu
   - Cải thiện `/start` và `/menu` commands

3. **`src/lib/telegram-menu.ts`** (MỚI - TÙY CHỌN)
   - Helper functions để tạo menu keyboard
   - Constants cho menu structure
   - Type definitions cho menu

---

## User Experience Flow

### Flow 1: User mới

```
1. User: /start
   ↓
2. Bot: [Welcome message + Menu keyboard]
   ┌─────────────────────────┐
   │ [🔗 Rút gọn link]       │
   │ [📊 Xem link của tôi]   │
   │ [📈 Thống kê]           │
   │ [❓ Trợ giúp]           │
   └─────────────────────────┘
   ↓
3. User: Click "🔗 Rút gọn link"
   ↓
4. Bot: "Gửi cho tôi một URL để rút gọn..."
   ↓
5. User: https://example.com
   ↓
6. Bot: "✅ Short link created: ..."
```

### Flow 2: User dùng menu

```
1. User: /menu
   ↓
2. Bot: [Menu keyboard]
   ↓
3. User: Click "📊 Xem link của tôi"
   ↓
4. Bot: [Danh sách links] (sẽ implement sau)
```

---

## Implementation Steps

### Bước 1: Tạo script đăng ký Bot Commands
- [ ] Tạo `scripts/set-bot-commands.ts`
- [ ] Đăng ký các commands cơ bản
- [ ] Test script hoạt động

### Bước 2: Thêm Inline Keyboard Menu
- [ ] Thêm type definitions cho callback_query
- [ ] Tạo hàm `createMenuKeyboard()`
- [ ] Thêm xử lý `callback_query` trong webhook handler
- [ ] Implement `/menu` command

### Bước 3: Cải thiện /start command
- [ ] Thêm Inline Keyboard vào `/start`
- [ ] Cải thiện welcome message
- [ ] Test flow hoàn chỉnh

### Bước 4: Thêm helper functions
- [ ] Tạo `src/lib/telegram-menu.ts` (nếu cần)
- [ ] Refactor code để dễ maintain
- [ ] Add error handling

### Bước 5: Testing
- [ ] Test tất cả các nút menu
- [ ] Test callback_query handling
- [ ] Test edge cases (invalid callback_data, etc.)
- [ ] Test trên production

---

## API Reference

### Telegram Bot API Methods cần dùng:

1. **setMyCommands**
   - URL: `https://api.telegram.org/bot{token}/setMyCommands`
   - Method: POST
   - Body: `{ commands: [...] }`

2. **sendMessage** (đã có)
   - Thêm parameter `reply_markup` với Inline Keyboard

3. **editMessageText** (MỚI)
   - URL: `https://api.telegram.org/bot{token}/editMessageText`
   - Method: POST
   - Body: `{ chat_id, message_id, text, reply_markup }`

4. **answerCallbackQuery** (MỚI)
   - URL: `https://api.telegram.org/bot{token}/answerCallbackQuery`
   - Method: POST
   - Body: `{ callback_query_id }`

---

## Lưu ý kỹ thuật

1. **Callback Query Timeout**
   - Telegram chỉ giữ callback_query trong 60 giây
   - Phải answer callback_query trong thời gian này

2. **Message Editing**
   - Chỉ có thể edit message trong 48 giờ
   - Nếu quá thời gian, phải gửi message mới

3. **Keyboard Layout**
   - Mỗi row có thể có nhiều nút (tối đa width của screen)
   - Nên giữ layout đơn giản, dễ đọc

4. **Error Handling**
   - Xử lý lỗi khi edit message (message quá cũ)
   - Xử lý lỗi khi answer callback_query
   - Log errors để debug

5. **Security**
   - Validate callback_data trước khi xử lý
   - Không trust user input trong callback_data
   - Check user permissions nếu cần

---

## Tương lai (Future Enhancements)

1. **Menu động theo user**
   - Menu khác nhau cho user mới vs user cũ
   - Menu theo số lượng links user có

2. **Menu đa cấp**
   - Menu chính → Menu con → Action
   - Ví dụ: Thống kê → Thống kê tổng / Thống kê link cụ thể

3. **Menu theo ngôn ngữ**
   - Menu tiếng Việt / English
   - Dựa trên `language_code` của user

4. **Quick Actions trong menu**
   - Nút "Rút gọn link gần nhất"
   - Nút "Xem link phổ biến nhất"

---

## Checklist triển khai

### Phase 1: Bot Commands Menu
- [ ] Tạo script `set-bot-commands.ts`
- [ ] Đăng ký commands với BotFather API
- [ ] Test commands hiển thị đúng trong Telegram
- [ ] Thêm script vào package.json (npm script)

### Phase 2: Inline Keyboard Menu
- [ ] Thêm type definitions cho callback_query
- [ ] Tạo hàm `createMenuKeyboard()`
- [ ] Implement xử lý callback_query
- [ ] Implement `/menu` command
- [ ] Cải thiện `/start` command với menu
- [ ] Test tất cả các nút menu
- [ ] Add error handling

### Phase 3: Testing & Documentation
- [ ] Test end-to-end flow
- [ ] Test edge cases
- [ ] Update README với hướng dẫn menu
- [ ] Update telegram-bot-features.md

---

## Kết luận

Việc thêm menu vào Telegram bot sẽ:
- ✅ Cải thiện UX đáng kể
- ✅ Giúp user dễ dàng khám phá tính năng
- ✅ Tăng engagement với bot
- ✅ Chuẩn bị nền tảng cho các tính năng tương lai

**Ưu tiên triển khai:**
1. Bot Commands Menu (dễ, nhanh)
2. Inline Keyboard Menu (quan trọng, cải thiện UX nhiều)
3. Menu nâng cao (tùy chọn, sau này)
