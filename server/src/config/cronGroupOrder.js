import cron from "cron";
import { db } from "../config/db.js";
import {
  orders,
  orderItems,
  dishes,
  stores,
  employees,
  groupOrders,
  groupOrderItems,
  userPushTokens,
} from "../db/schema.js";
import { eq, and, gt } from "drizzle-orm";
import { Expo } from "expo-server-sdk";

const expo = new Expo();

// Danh sách tòa theo thứ tự ưu tiên của bạn
const TOWERS = ["A", "H", "E", "B", "X", "V", "D", "T", "C"];

/**
 * parseAddress("A1.01") => { tower: "A", floor: 1 }
 * nếu không hợp lệ => null
 */
function parseAddress(addr) {
  if (!addr) return { tower: null, floor: null };

  // Ví dụ: A1.01 → tower = A, floor = 1
  const regex = /^([A-Z]+)(\d+)\./;
  const match = addr.match(regex);

  if (!match) return { tower: null, floor: null };

  return {
    tower: match[1],
    floor: parseInt(match[2]),
  };
}

/**
 * Trả về danh sách towers theo thứ tự mở rộng 2 chiều từ current tower.
 * Ví dụ currentIndex=2 và TOWERS length 9 => order: left1, right1, left2, right2, ...
 */
function neighborsTwoSides(tower) {
  const idx = TOWERS.indexOf(tower);
  if (idx === -1) return [];

  const result = [];

  // left neighbor (idx - 1)
  if (idx - 1 >= 0) {
    result.push(TOWERS[idx - 1]);
  }

  // right neighbor (idx + 1)
  if (idx + 1 < TOWERS.length) {
    result.push(TOWERS[idx + 1]);
  }

  return result;
}

/**
 * Lấy tổng quantity hiện tại trong group (từ DB)
 */
async function getGroupQuantity(groupId) {
  if (!groupId) return 0;
  const rows = await db
    .select({ q: orderItems.quantity })
    .from(groupOrderItems)
    .innerJoin(orders, eq(orders.orderId, groupOrderItems.orderId))
    .innerJoin(orderItems, eq(orderItems.orderId, orders.orderId))
    .where(eq(groupOrderItems.groupOrderId, groupId));
  if (!rows || rows.length === 0) return 0;
  return rows.reduce((s, r) => s + (r.q || 0), 0);
}

const buildMessageByRole = (role, na) => {
  if (role === "customer") {
    return {
      title: "Banana - Đơn hàng sắp được giao",
      body: `Đơn hàng ${na.orderCode} đã đủ điều kiện giao. Chờ quán chuẩn bị nhé!`,
    };
  } else {
    return {
      title: "Banana - Đơn hàng mới",
      body: `Bạn có 1 đơn hàng mới. Vui lòng kiểm tra ngay!`,
    };
  }
};

/**
 * Lấy hoặc tạo group phù hợp cho storeId + area (tower)
 * Nguyên tắc: ưu tiên group có sumOfQuantity < 3, nếu không có thì tạo mới.
 * Trả về groupOrderId
 */
async function getOrCreateOpenGroup(storeId, area) {
  // tìm group tồn tại (theo created order của DB)
  const existing = await db
    .select()
    .from(groupOrders)
    .where(
      and(eq(groupOrders.storeId, storeId), eq(groupOrders.deliveryArea, area))
    );

  // tìm group có sum < 3
  if (existing && existing.length > 0) {
    for (const g of existing) {
      const sum = await getGroupQuantity(g.groupOrderId);
      if (sum < 3) return { groupId: g.groupOrderId, prevSum: sum };
    }
  }

  // không có group phù hợp -> tạo mới
  const created = await db
    .insert(groupOrders)
    .values({
      storeId,
      deliveryArea: area,
      sumOfQuantity: 0,
    })
    .returning({ groupOrderId: groupOrders.groupOrderId });

  const newGroupId = created[0].groupOrderId;
  return { groupId: newGroupId, prevSum: 0 };
}

const jobGroup = new cron.CronJob("*/1 * * * *", async () => {
  try {
    // 1) Lấy các order_items của orders có status "Đang chờ"
    // Note: join trả về 1 row cho mỗi order_item. Ta sẽ aggregate per orderId
    const nowVN = new Date(Date.now() + 7 * 60 * 60 * 1000);

    const oneHourAgoVN = new Date(nowVN.getTime() - 60 * 60 * 1000);

    const rows = await db
      .select({
        orderId: orders.orderId,
        orderCode: orders.orderCode,
        userId: orders.userId,
        deliveryAddress: orders.deliveryAddress,
        storeId: stores.storeId,
        quantity: orderItems.quantity,
      })
      .from(orders)
      .innerJoin(orderItems, eq(orders.orderId, orderItems.orderId))
      .innerJoin(dishes, eq(dishes.dishId, orderItems.dishId))
      .innerJoin(stores, eq(stores.storeId, dishes.storeId))
      .where(
        and(eq(orders.status, "Đang chờ"), gt(orders.orderDate, oneHourAgoVN))
      );

    if (!rows || rows.length === 0) {
      return;
    }

    // 2) Aggregate rows -> ordersMap (tổng quantity của toàn order)
    const ordersMap = new Map();
    for (const r of rows) {
      if (!ordersMap.has(r.orderId)) {
        ordersMap.set(r.orderId, {
          orderId: r.orderId,
          orderCode: r.orderCode,
          userId: r.userId,
          deliveryAddress: r.deliveryAddress,
          storeId: r.storeId,
          quantity: 0,
        });
      }

      ordersMap.get(r.orderId).quantity += Number(r.quantity || 0);
    }

    // 3) Group orders by storeId for processing
    const byStore = new Map();
    for (const o of ordersMap.values()) {
      if (!byStore.has(o.storeId)) byStore.set(o.storeId, []);
      byStore.get(o.storeId).push(o);
    }

    // 4) For each store, process grouping
    for (const [storeId, orderList] of byStore.entries()) {
      // prepare list of orders with parsed address
      const prepared = [];
      for (const o of orderList) {
        const parsed = parseAddress(o.deliveryAddress);
        if (!parsed) {
          // skip malformed addresses
          console.warn(
            "[Cron] skip malformed address",
            o.orderId,
            o.deliveryAddress
          );
          continue;
        }
        prepared.push({
          ...o,
          tower: parsed.tower,
          floor: parsed.floor,
        });
      }

      // mark assigned orders
      const assigned = new Set();

      // we will try each unassigned order as seed (prioritize same-tower groups)
      for (let i = 0; i < prepared.length; i++) {
        const seed = prepared[i];
        if (assigned.has(seed.orderId)) continue;

        // 4A: collect candidates in same tower within ±3 floors
        let candidates = prepared.filter(
          (p) =>
            !assigned.has(p.orderId) &&
            p.tower === seed.tower &&
            Math.abs(p.floor - seed.floor) <= 3
        );

        let total = candidates.reduce((s, c) => s + (c.quantity || 0), 0);

        // 4B: if not enough, expand to neighbor towers (both directions) in order
        if (total < 3) {
          const neighbors = neighborsTwoSides(seed.tower);
          for (const nb of neighbors) {
            // take unassigned orders in neighbor tower that are within ±3 floors of ANY candidate
            const extra = prepared.filter(
              (p) =>
                !assigned.has(p.orderId) &&
                p.tower === nb &&
                // check if floor within 3 of at least one existing candidate (or seed)
                (candidates.some((c) => Math.abs(c.floor - p.floor) <= 3) ||
                  Math.abs(seed.floor - p.floor) <= 3)
            );

            if (extra.length > 0) {
              candidates = candidates.concat(extra);
              total = candidates.reduce((s, c) => s + (c.quantity || 0), 0);
            }

            if (total >= 3) break;
          }
        }

        // if still not enough, skip (will be attempted later possibly as part of other seeds)
        if (total < 3) continue;

        // 5) We have candidates whose combined quantity >= 3 -> assign them to a group
        // determine area (deliveryArea) we use for groupOrders: prefer seed.tower
        const area = seed.tower;

        // get or create an open group for (storeId, area)
        const { groupId } = await (async () => {
          // search existing groups for store+area -> pick one with sumOfQuantity < 3
          const existing = await db
            .select()
            .from(groupOrders)
            .where(
              and(
                eq(groupOrders.storeId, storeId),
                eq(groupOrders.deliveryArea, area)
              )
            );

          if (existing && existing.length > 0) {
            for (const g of existing) {
              const sum = await getGroupQuantity(g.groupOrderId);
              if (sum < 3) {
                return { groupId: g.groupOrderId };
              }
            }
          }

          // otherwise create new
          const created = await db
            .insert(groupOrders)
            .values({
              storeId,
              deliveryArea: area,
              sumOfQuantity: 0,
            })
            .returning({ groupOrderId: groupOrders.groupOrderId });

          // ensure we use newly created group immediately
          return { groupId: created[0].groupOrderId };
        })();

        // newlyAdded list for notifications
        const newlyAdded = [];

        // Insert each candidate if not already in groupOrderItems
        for (const c of candidates) {
          // Skip nếu đã assigned trong logic hiện tại
          if (assigned.has(c.orderId)) continue;

          // Skip nếu đã có trong DB
          const existed = await db
            .select({ id: groupOrderItems.groupOrderItemId })
            .from(groupOrderItems)
            .where(eq(groupOrderItems.orderId, c.orderId));

          if (existed && existed.length > 0) {
            assigned.add(c.orderId);
            continue;
          }

          // Insert
          await db.insert(groupOrderItems).values({
            groupOrderId: groupId,
            orderId: c.orderId,
            userId: c.userId,
          });

          // Update order
          await db
            .update(orders)
            .set({ status: "Đang chuẩn bị" })
            .where(eq(orders.orderId, c.orderId));

          // ADD TO newlyAdded (CHỈ KHI thật sự mới)
          newlyAdded.push(c);

          assigned.add(c.orderId);
        }

        // Recompute real total from DB and update groupOrders.sumOfQuantity
        const realTotal = await getGroupQuantity(groupId);
        await db
          .update(groupOrders)
          .set({ sumOfQuantity: realTotal })
          .where(eq(groupOrders.groupOrderId, groupId));

        // Send notifications for newlyAdded (batch with expo.chunkPushNotifications)
        if (newlyAdded.length > 0) {
          const messages = [];

          for (const na of newlyAdded) {
            const receivers = {
              customer: new Set(),
              owner: new Set(),
              staff: new Set(),
            };

            // 1. Khách hàng
            if (na.userId) {
              receivers.customer.add(Number(na.userId));
            }

            // 2. Chủ quán
            if (na.storeId) {
              const store = await db
                .select({ ownerId: stores.userId })
                .from(stores)
                .where(eq(stores.storeId, na.storeId))
                .limit(1);

              if (store.length > 0 && store[0].ownerId) {
                receivers.owner.add(Number(store[0].ownerId));
              }

              // 3. Nhân viên
              const staffRows = await db
                .select({ userId: employees.userId })
                .from(employees)
                .where(eq(employees.storeId, na.storeId));

              for (const staff of staffRows) {
                if (staff.userId) {
                  receivers.staff.add(Number(staff.userId));
                }
              }
            }

            // 4. Gửi notification cho tất cả userId đã gom
            for (const [role, userSet] of Object.entries(receivers)) {
              for (const userId of userSet) {
                const tokenRows = await db
                  .select()
                  .from(userPushTokens)
                  .where(eq(userPushTokens.userId, userId));

                if (!tokenRows || tokenRows.length === 0) continue;

                // GỌI Ở ĐÂY
                const content = buildMessageByRole(role, na);

                for (const row of tokenRows) {
                  if (!Expo.isExpoPushToken(row.token)) continue;

                  messages.push({
                    to: row.token,
                    sound: "default",
                    title: content.title,
                    body: content.body,
                    data: {
                      url: `banana://detailorder/${na.orderId}`,
                      role: role,
                    },
                  });
                }
              }
            }
          }

          if (messages.length > 0) {
            const chunks = expo.chunkPushNotifications(messages);
            for (const chunk of chunks) {
              try {
                await expo.sendPushNotificationsAsync(chunk);
              } catch (e) {
                console.error("[Cron] expo send error:", e);
              }
            }
          }
        }
      } // end for each seed order
    } // end for each store
  } catch (err) {
    console.error("Cron group error:", err);
  }
});

export default jobGroup;
