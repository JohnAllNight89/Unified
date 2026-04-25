import express, { Router, type Request, type Response } from "express";
import Stripe from "stripe";
import { eq } from "drizzle-orm";
import { getAuth } from "@clerk/express";
import { db, profilesTable, ordersTable } from "@workspace/db";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, { apiVersion: "2026-03-25.dahlia" });
}

interface ProductDef {
  name: string;
  fullPrice: number;
  subscriberPrice: number | null;
}

const PRODUCTS: Record<string, ProductDef> = {
  soul_blueprint:    { name: "The Soul Blueprint",         fullPrice: 5994, subscriberPrice: 4995 },
  couples_blueprint: { name: "The Couples Blueprint",      fullPrice: 9594, subscriberPrice: 7995 },
  current_life:      { name: "Current Life Reading",       fullPrice: 1559, subscriberPrice: 1299 },
  couples_life:      { name: "Both Current Life Readings", fullPrice: 3118, subscriberPrice: 2598 },
  numerology_report: { name: "In-depth Numerology Report", fullPrice: 1799, subscriberPrice: 1499 },
  astro_reading:     { name: "In-depth Astro Reading",     fullPrice: 1799, subscriberPrice: 1499 },
};

const SUB_PRICE_CENTS = 399;
const SUB_NICKNAME = "unified-spirit-monthly";
const SUB_PRODUCT_NAME = "Unified Spirit Monthly Membership";

const TRUSTED_URL_PATTERNS: RegExp[] = [
  /^https?:\/\/localhost(:\d+)?(\/|$)/,
  /^https?:\/\/[\w-]+\.replit\.(app|dev|co)(\/|$)/,
  /^https?:\/\/(www\.)?theunifiedspirit\.com(\/|$)/,
];

if (process.env.REPLIT_DEV_DOMAIN) {
  const escaped = process.env.REPLIT_DEV_DOMAIN.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  TRUSTED_URL_PATTERNS.push(new RegExp(`^https?://${escaped}(\\/|$)`));
}

function isTrustedUrl(url: string): boolean {
  return TRUSTED_URL_PATTERNS.some((re) => re.test(url));
}

async function isActiveSubscriber(userId: string): Promise<boolean> {
  const rows = await db
    .select({ subscriptionStatus: profilesTable.subscriptionStatus })
    .from(profilesTable)
    .where(eq(profilesTable.clerkUserId, userId))
    .limit(1);
  const status = rows[0]?.subscriptionStatus;
  return status === "active" || status === "trialing";
}

router.post("/stripe/checkout", async (req: Request, res: Response) => {
  const stripe = getStripe();
  if (!stripe) {
    res.status(503).json({ error: "Stripe is not yet configured. Please add your Stripe keys." });
    return;
  }

  const auth = getAuth(req);
  const userId = auth?.userId ?? null;

  const { productKey, successUrl, cancelUrl } = req.body as {
    productKey?: string;
    successUrl?: string;
    cancelUrl?: string;
  };

  if (!productKey || !successUrl || !cancelUrl) {
    res.status(400).json({ error: "productKey, successUrl, cancelUrl required" });
    return;
  }

  if (!isTrustedUrl(successUrl) || !isTrustedUrl(cancelUrl)) {
    res.status(400).json({ error: "successUrl and cancelUrl must point to a trusted origin" });
    return;
  }

  const product = PRODUCTS[productKey];
  if (!product) {
    res.status(400).json({ error: "Unknown product" });
    return;
  }

  let unitAmount = product.fullPrice;
  if (userId && product.subscriberPrice !== null) {
    try {
      if (await isActiveSubscriber(userId)) {
        unitAmount = product.subscriberPrice;
      }
    } catch (_err) {
    }
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: unitAmount,
          product_data: { name: product.name },
        },
      }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { clerkUserId: userId ?? "", productKey },
    });
    res.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stripe error";
    res.status(500).json({ error: message });
  }
});

router.post("/stripe/subscribe", requireAuth, async (req: Request, res: Response) => {
  const stripe = getStripe();
  if (!stripe) {
    res.status(503).json({ error: "Stripe is not yet configured. Please add your Stripe keys." });
    return;
  }

  const userId = req.userId!;
  const { successUrl, cancelUrl } = req.body as {
    successUrl?: string;
    cancelUrl?: string;
  };

  if (!successUrl || !cancelUrl) {
    res.status(400).json({ error: "successUrl, cancelUrl required" });
    return;
  }

  if (!isTrustedUrl(successUrl) || !isTrustedUrl(cancelUrl)) {
    res.status(400).json({ error: "successUrl and cancelUrl must point to a trusted origin" });
    return;
  }

  try {
    const profiles = await db
      .select({ stripeCustomerId: profilesTable.stripeCustomerId })
      .from(profilesTable)
      .where(eq(profilesTable.clerkUserId, userId))
      .limit(1);
    const customerId = profiles[0]?.stripeCustomerId ?? undefined;

    let priceId: string;
    const prices = await stripe.prices.list({ limit: 100, active: true, type: "recurring" });
    const existing = prices.data.find((p) => p.nickname === SUB_NICKNAME);

    if (existing) {
      priceId = existing.id;
    } else {
      const prod = await stripe.products.create({ name: SUB_PRODUCT_NAME });
      const price = await stripe.prices.create({
        product: prod.id,
        unit_amount: SUB_PRICE_CENTS,
        currency: "usd",
        recurring: { interval: "month" },
        nickname: SUB_NICKNAME,
      });
      priceId = price.id;
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer: customerId,
      metadata: { clerkUserId: userId },
    });
    res.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stripe error";
    res.status(500).json({ error: message });
  }
});

router.post("/stripe/webhook", express.raw({ type: "application/json" }), async (req: Request, res: Response) => {
  const stripe = getStripe();
  if (!stripe) {
    res.status(503).json({ error: "Stripe not configured" });
    return;
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    res.status(503).json({ error: "STRIPE_WEBHOOK_SECRET is not configured. Webhook verification is required." });
    return;
  }

  const sig = req.headers["stripe-signature"];
  if (!sig || typeof sig !== "string") {
    res.status(400).json({ error: "Missing stripe-signature header" });
    return;
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body as Buffer, sig, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook error";
    res.status(400).json({ error: `Webhook signature verification failed: ${message}` });
    return;
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const clerkUserId = session.metadata?.clerkUserId;
      if (clerkUserId && session.mode === "subscription" && session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        await db
          .insert(profilesTable)
          .values({
            clerkUserId,
            fullName: null,
            birthDate: null,
            birthPlace: null,
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: session.subscription as string,
            subscriptionStatus: subscription.status,
          })
          .onConflictDoUpdate({
            target: profilesTable.clerkUserId,
            set: {
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: session.subscription as string,
              subscriptionStatus: subscription.status,
              updatedAt: new Date(),
            },
          });
      }

      if (session.mode === "payment" && session.metadata?.productKey) {
        const productKey = session.metadata.productKey;
        const product = PRODUCTS[productKey];
        await db
          .insert(ordersTable)
          .values({
            clerkUserId: clerkUserId || null,
            customerEmail: session.customer_details?.email ?? null,
            stripeSessionId: session.id,
            stripePaymentIntentId: (session.payment_intent as string) ?? null,
            productKey,
            productName: product?.name ?? productKey,
            amountCents: session.amount_total ?? 0,
            currency: session.currency ?? "usd",
            status: "completed",
            fulfilled: false,
          })
          .onConflictDoNothing();
      }
    }

    if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;
      await db
        .update(profilesTable)
        .set({ subscriptionStatus: subscription.status, updatedAt: new Date() })
        .where(eq(profilesTable.stripeCustomerId, customerId));
    }

    res.json({ received: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Handler error";
    res.status(500).json({ error: `Webhook handler failed: ${message}` });
  }
});

router.get("/stripe/subscription-status", requireAuth, async (req: Request, res: Response) => {
  const userId = req.userId!;
  try {
    const rows = await db
      .select({ subscriptionStatus: profilesTable.subscriptionStatus })
      .from(profilesTable)
      .where(eq(profilesTable.clerkUserId, userId))
      .limit(1);
    const status = rows[0]?.subscriptionStatus ?? "inactive";
    res.json({ status });
  } catch (_err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
