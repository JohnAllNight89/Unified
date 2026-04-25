import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const profilesTable = pgTable("profiles", {
  id: serial("id").primaryKey(),
  clerkUserId: text("clerk_user_id").notNull().unique(),
  fullName: text("full_name"),
  username: text("username").unique(),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  birthDate: text("birth_date"),
  birthTime: text("birth_time"),
  birthPlace: text("birth_place"),
  birthLat: text("birth_lat"),
  birthLng: text("birth_lng"),
  numerologyData: text("numerology_data"),
  astrologyData: text("astrology_data"),
  humanDesignData: text("human_design_data"),
  geneKeysData: text("gene_keys_data"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  subscriptionStatus: text("subscription_status").default("inactive"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertProfileSchema = createInsertSchema(profilesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profilesTable.$inferSelect;
