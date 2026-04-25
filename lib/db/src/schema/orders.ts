import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  clerkUserId: text("clerk_user_id"),
  customerEmail: text("customer_email"),
  stripeSessionId: text("stripe_session_id").unique(),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  productKey: text("product_key").notNull(),
  productName: text("product_name").notNull(),
  amountCents: integer("amount_cents").notNull(),
  currency: text("currency").default("usd").notNull(),
  status: text("status").default("completed").notNull(),
  fulfilled: boolean("fulfilled").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertOrderSchema = createInsertSchema(ordersTable).omit({
  id: true,
  createdAt: true,
});
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof ordersTable.$inferSelect;
