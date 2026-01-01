import cron from "cron";
import { db } from "../config/db.js";
import {
  dishes,
  orders,
  orderItems,
  groupOrders,
  groupOrderItems,
  userPushTokens,
  employees,
  stores,
} from "../db/schema.js";
import { lt, eq, and, sum, inArray } from "drizzle-orm";
import { Expo } from "expo-server-sdk";

const expo = new Expo();

const jobCancel = new cron.CronJob("*/1 * * * *", async () => {
  try {
    const nowVN = new Date(Date.now() + 7 * 60 * 60 * 1000);

    const oneHourAgoVN = new Date(nowVN.getTime() - 60 * 60 * 1000);

    const pendingOrders = await db
      .select()
      .from(orders)
      .where(
        and(eq(orders.status, "Đang chờ"), lt(orders.orderDate, oneHourAgoVN))
      );

    if (pendingOrders.length === 0) {
      return;
    }

    for (const order of pendingOrders) {
      await db
        .update(orders)
        .set({ status: "Bị hủy" })
        .where(eq(orders.orderId, order.orderId));

      const userId = await db
        .select({
          ownerId: stores.userId,
          employeeId: employees.userId,
          orderCode: orders.orderCode,
        })
        .from(stores)
        .innerJoin(dishes, eq(dishes.storeId, stores.storeId))
        .innerJoin(orderItems, eq(orderItems.dishId, dishes.dishId))
        .innerJoin(orders, eq(orders.orderId, orderItems.orderId))
        .innerJoin(employees, eq(stores.storeId, employees.storeId))
        .where(eq(orders.orderId, parseInt(order.orderId)));

      const tokenRows = await db
        .select()
        .from(userPushTokens)
        .where(
          inArray(userPushTokens.userId, [
            order.userId,
            userId[0].ownerId,
            userId[0].employeeId,
          ])
        );

      if (tokenRows.length === 0) return;

      const messages = [];

      for (const row of tokenRows) {
        const token = row.token;
        if (!Expo.isExpoPushToken(token)) continue;

        messages.push({
          to: token,
          sound: "default",
          title: "Banana - Hủy đơn hàng",
          body: `Đơn hàng ${order.orderCode} của bạn đã bị hủy bởi hệ thống do quá thời gian chờ`,
          data: {
            url: `banana://detailorder/${order.orderId}`,
          },
        });
      }

      if (messages.length > 0) {
        await expo.sendPushNotificationsAsync(messages);
      }

      const item = await db
        .select()
        .from(groupOrderItems)
        .where(eq(groupOrderItems.orderId, order.orderId))
        .limit(1);

      if (item.length === 0) continue;

      const groupId = item[0].groupOrderId;

      await db
        .delete(groupOrderItems)
        .where(eq(groupOrderItems.orderId, item[0].orderId));

      const remaining = await db
        .select({
          total: sum(groupOrderItems.quantity).as("total"),
        })
        .from(groupOrderItems)
        .where(eq(groupOrderItems.groupOrderId, groupId));

      const sumQuantity = remaining[0].total ?? 0;

      if (sumQuantity === 0) {
        await db.delete(groupOrders).where(eq(groupOrders.id, groupId));

        await db
          .delete(groupOrderItems)
          .where(eq(groupOrderItems.groupOrderId, groupId));
      } else {
        await db
          .update(groupOrders)
          .set({ sumOfQuantity: sumQuantity })
          .where(eq(groupOrders.id, groupId));
      }
    }
  } catch (err) {
    console.log("Cron error:", err);
  }
});

export default jobCancel;
