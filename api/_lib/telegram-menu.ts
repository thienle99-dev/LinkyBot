import { Markup } from "telegraf";

export const MENU_ACTIONS = {
  MAIN: "menu:main",
  SHORTEN: "menu:shorten",
  MY_LINKS: "menu:mylinks",
  STATS: "menu:stats",
  HELP: "menu:help",
  ABOUT: "menu:about"
};

export function createMainMenu() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback("🔗 Rút gọn link", MENU_ACTIONS.SHORTEN),
      Markup.button.callback("📊 Xem link của tôi", MENU_ACTIONS.MY_LINKS)
    ],
    [
      Markup.button.callback("📈 Thống kê", MENU_ACTIONS.STATS),
      Markup.button.callback("❓ Trợ giúp", MENU_ACTIONS.HELP)
    ],
    [
      Markup.button.callback("ℹ️ Thông tin bot", MENU_ACTIONS.ABOUT)
    ]
  ]);
}

export function createBackToMenuButton() {
  return Markup.inlineKeyboard([
    [Markup.button.callback("⬅️ Quay lại Menu chính", MENU_ACTIONS.MAIN)]
  ]);
}

export function getMenuContent(action: string) {
  switch (action) {
    case MENU_ACTIONS.SHORTEN:
      return "Gửi cho tôi một URL (bắt đầu bằng http:// hoặc https://) để rút gọn link ngay lập tức.";
    case MENU_ACTIONS.MY_LINKS:
      return "Tính năng xem danh sách link đang được phát triển. Vui lòng quay lại sau!";
    case MENU_ACTIONS.STATS:
      return "Tính năng xem thống kê đang được phát triển. Vui lòng quay lại sau!";
    case MENU_ACTIONS.HELP:
      return "💡 **Hướng dẫn sử dụng:**\n\n1. Gửi trực tiếp URL cho bot.\n2. Click vào các nút menu để khám phá tính năng.\n3. Dùng lệnh /links hoặc /stats để quản lý link của bạn.";
    case MENU_ACTIONS.ABOUT:
      return "🤖 **LinkyBot v0.1.0**\n\nBot rút gọn link mã nguồn mở được xây dựng bằng Vue 3, Vercel Functions và Supabase.\n\nTác giả: @thienle99_dev";
    case "main":
    default:
      return "📋 **MENU CHÍNH**\nChọn một tính năng bên dưới để bắt đầu:";
  }
}
