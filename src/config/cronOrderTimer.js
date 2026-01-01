import cron from "cron";
import { db } from "../config/db.js";
import {
  orders,
  userPushTokens
} from "../db/schema.js";
import { eq } from "drizzle-orm";
import { Expo } from "expo-server-sdk";

const expo = new Expo();

function getVietnamTimeHHMM() {
  const dateVN = new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" });
  const now = new Date(dateVN);

  const hh = now.getHours().toString().padStart(2, "0");
  const mm = now.getMinutes().toString().padStart(2, "0");

  return `${hh}:${mm}`;
}

const jobOrder = new cron.CronJob("*/1 * * * *", async () => {
  try {
    const currentTime = getVietnamTimeHHMM();

    const results = await db
      .select()
      .from(orders)
      .where(eq(orders.status, "Hẹn giao"));

    if (results.length === 0) {
      return;
    }

    for (const order of results) {
      if (!order.timer) continue;

      const deliveryTime = order.timer.trim();

      if (deliveryTime <= currentTime) {

        await db
          .update(orders)
          .set({ status: "Đang chờ" })
          .where(eq(orders.orderId, order.orderId));

        // ============================================
        // GỬI THÔNG BÁO CHO KHÁCH HÀNG
        // ============================================
        try {
          const tokenRow = await db
            .select()
            .from(userPushTokens)
            .where(eq(userPushTokens.userId, Number(order.userId)));

          if (!tokenRow || tokenRow.length === 0) continue;

          const token = tokenRow[0].token;
          if (!Expo.isExpoPushToken(token)) continue;

          const message = {
            to: token,
            sound: "default",
            title: "Banana - Hẹn giao",
            body: `Đơn hàng #${order.orderCode} đến giờ xử lý. Quán sẽ giao khi đủ 3 món`,
            data: {
              url: `banana://detailorder/${order.orderId}`
            }
          };

          const chunks = expo.chunkPushNotifications([message]);
          for (const chunk of chunks) {
            await expo.sendPushNotificationsAsync(chunk);
          }
        } catch (e) {
          console.error("Lỗi gửi thông báo:", e);
        }
      }
    }
  } catch (err) {
    console.error("Cron place order timer error:", err);
  }
});

export default jobOrder;
