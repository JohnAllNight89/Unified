# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **Auth**: Clerk (frontend + API middleware)
- **Payments**: Stripe (checkout, subscriptions, webhooks)
- **Build**: esbuild (CJS bundle)

## Artifacts

### The Unified Spirit — Soul Blueprint (`artifacts/unified-self`)
- **Type**: React + Vite multi-page web app (Wouter routing)
- **Preview Path**: `/`
- **Purpose**: Landing page + member portal for "The Unified Spirit" (theunifiedspirit.com) spiritual soul blueprint report service
- **Brand**: Gold (#c9a84c) + deep purple on near-black background, Cinzel + Raleway fonts
- **Logo**: `@assets/1000118430(1)_1776014912783.png` (also at `public/logo-new.png`)
- **Nav**: Larger 80px bar with logo image, "Member Log In" (signed out) or "My Portal" + "Admin" + "Sign Out" (signed in)

### Pages
- `/` — Home: hero, pricing/products with subscriber-aware pricing, CTAs
- `/about` — About: practitioner story, methodology
- `/sample` — Sample Report preview
- `/faq` — FAQ accordion
- `/connect` — Lead capture form (POST /api/leads)
- `/privacy` — Privacy Policy
- `/sign-in` — Clerk sign-in (redirects to /portal)
- `/sign-up` — Clerk sign-up (redirects to /portal)
- `/portal` — Member portal: profile form, free tools (numerology, astro), subscription CTA, HD/GK education
- `/portal/numerology` — Numerology calculator (5 core numbers)
- `/portal/astro` — Birth chart calculator
- `/portal/astro-interpretation` — Subscriber-gated chart interpretation
- `/discover` — Discover hub: 4 topic cards (Numerology, Astrology, Human Design, Gene Keys)
- `/discover/numerology` — Numerology history, Pythagorean/Chaldean systems, 5 core numbers, Master Numbers
- `/discover/astrology` — Astrology history, 5 types (Western/Vedic/Chinese/Hellenistic/Evolutionary), planets/signs/houses/aspects
- `/discover/human-design` — HD origin, 4 pillars, 5 types, Authority, 9 centers
- `/discover/gene-keys` — Gene Keys origin, Shadow/Gift/Siddhi, 64 archetypes, Hologenetic Profile, 3 sequences
- `/admin` — Admin dashboard (restricted to ADMIN_EMAILS)

### API Server (`artifacts/api-server`)
- **Type**: Express 5 REST API
- **Port**: 8080 (via `PORT` env var)
- **Auth**: Clerk middleware + requireAuth + requireAdmin
- **Routes**:
  - `GET /api/health` — health check
  - `POST /api/leads` — save lead
  - `GET/POST /api/profile` — user profile CRUD (requireAuth)
  - `POST /api/stripe/checkout` — one-time product checkout (6 products)
  - `POST /api/stripe/subscribe` — subscription checkout ($3.99/mo)
  - `POST /api/stripe/webhook` — Stripe webhook (signature verified)
  - `GET /api/stripe/subscription-status` — user subscription status
  - `GET /api/admin/stats` — dashboard analytics (requireAdmin)
  - `GET /api/admin/users` — paginated user list (requireAdmin)
  - `GET /api/admin/orders` — paginated order list (requireAdmin)
  - `PATCH /api/admin/orders/:id/fulfill` — mark order fulfilled (requireAdmin)

### Database (`lib/db`)
- **Tables**:
  - `leads` — lead capture (name, email, birthDate, message, subscribed, source)
  - `profiles` — user profiles (clerkUserId, fullName, birthDate, birthPlace, birthTime, stripe fields, subscriptionStatus)
  - `orders` — one-time purchase tracking (productKey, productName, amountCents, customerEmail, fulfilled, stripeSessionId)
- Schema: `lib/db/src/schema/`

### Products & Pricing
- Soul Blueprint: $49.95 / $39.96 subscriber
- Couples Blueprint: $79.95 / $63.96 subscriber
- Current Life Reading: $12.99 / $10.39 subscriber
- Both Current Life Readings: $20.00 / $16.00 subscriber
- In-depth Numerology Report: $14.99 / $11.99 subscriber
- In-depth Astro Reading: $14.99 / $11.99 subscriber
- Monthly Subscription: $3.99/month

### Environment Variables
- `STRIPE_SECRET_KEY` — Stripe live secret key (secret)
- `STRIPE_WEBHOOK_SECRET` — Stripe webhook signing secret (secret)
- `ADMIN_EMAILS` — Comma-separated admin emails (env var)
- `VITE_CLERK_PUBLISHABLE_KEY` — Clerk publishable key
- `CLERK_SECRET_KEY` — Clerk secret key (secret)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `cd lib/db && pnpm exec tsc --build` — rebuild DB TypeScript declarations
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
