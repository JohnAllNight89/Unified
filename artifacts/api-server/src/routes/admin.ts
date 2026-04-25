import { Router, type Request, type Response } from "express";
import { eq, desc, sql, count } from "drizzle-orm";
import { db, profilesTable, ordersTable } from "@workspace/db";
import { requireAdmin } from "../middlewares/requireAdmin";

const router = Router();

router.get("/admin/stats", requireAdmin, async (_req: Request, res: Response) => {
  try {
    const [userStats] = await db
      .select({
        total: count(),
        withProfile: count(profilesTable.fullName),
      })
      .from(profilesTable);

    const [subStats] = await db
      .select({ active: count() })
      .from(profilesTable)
      .where(
        sql`${profilesTable.subscriptionStatus} IN ('active', 'trialing')`
      );

    const [orderStats] = await db
      .select({
        totalOrders: count(),
        totalRevenue: sql<number>`COALESCE(SUM(${ordersTable.amountCents}), 0)`,
        fulfilled: sql<number>`COUNT(*) FILTER (WHERE ${ordersTable.fulfilled} = true)`,
        unfulfilled: sql<number>`COUNT(*) FILTER (WHERE ${ordersTable.fulfilled} = false)`,
      })
      .from(ordersTable);

    res.json({
      users: {
        total: userStats.total,
        withProfile: userStats.withProfile,
        subscribersOnly: userStats.total - userStats.withProfile,
      },
      subscribers: {
        active: subStats.active,
      },
      orders: {
        total: orderStats.totalOrders,
        revenueCents: orderStats.totalRevenue,
        fulfilled: orderStats.fulfilled,
        unfulfilled: orderStats.unfulfilled,
      },
    });
  } catch (err) {
    console.error("[admin/stats]", err);
    res.status(500).json({ error: "Failed to load stats" });
  }
});

router.get("/admin/users", requireAdmin, async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 50));
    const offset = (page - 1) * limit;

    const [{ total }] = await db.select({ total: count() }).from(profilesTable);

    const users = await db
      .select()
      .from(profilesTable)
      .orderBy(desc(profilesTable.createdAt))
      .limit(limit)
      .offset(offset);

    res.json({ users, total, page, limit });
  } catch (err) {
    console.error("[admin/users]", err);
    res.status(500).json({ error: "Failed to load users" });
  }
});

router.get("/admin/orders", requireAdmin, async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 50));
    const offset = (page - 1) * limit;

    const [{ total }] = await db.select({ total: count() }).from(ordersTable);

    const orders = await db
      .select()
      .from(ordersTable)
      .orderBy(desc(ordersTable.createdAt))
      .limit(limit)
      .offset(offset);

    res.json({ orders, total, page, limit });
  } catch (err) {
    console.error("[admin/orders]", err);
    res.status(500).json({ error: "Failed to load orders" });
  }
});

router.patch("/admin/orders/:id/fulfill", requireAdmin, async (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.id as string);
    if (isNaN(orderId)) {
      res.status(400).json({ error: "Invalid order ID" });
      return;
    }

    const updated = await db
      .update(ordersTable)
      .set({ fulfilled: true })
      .where(eq(ordersTable.id, orderId))
      .returning();

    if (updated.length === 0) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    res.json({ order: updated[0] });
  } catch (err) {
    console.error("[admin/orders/fulfill]", err);
    res.status(500).json({ error: "Failed to fulfill order" });
  }
});

export default router;
