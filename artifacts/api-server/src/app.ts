import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { clerkMiddleware } from "@clerk/express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { CLERK_PROXY_PATH, clerkProxyMiddleware } from "./middlewares/clerkProxyMiddleware";
import router from "./routes";
import { logger } from "./lib/logger";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

app.use(CLERK_PROXY_PATH, clerkProxyMiddleware());

const TRUSTED_ORIGIN_PATTERNS: RegExp[] = [
  /^https?:\/\/localhost(:\d+)?$/,
  /^https?:\/\/[\w-]+\.replit\.(app|dev|co)$/,
  /^https?:\/\/(www\.)?theunifiedspirit\.com$/,
  /^https?:\/\/[\w-]+\.onrender\.com$/,
];

if (process.env.REPLIT_DEV_DOMAIN) {
  const devDomain = process.env.REPLIT_DEV_DOMAIN.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  TRUSTED_ORIGIN_PATTERNS.push(new RegExp(`^https?://${devDomain}$`));
}

app.use(
  cors({
    credentials: true,
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }
      const trusted = TRUSTED_ORIGIN_PATTERNS.some((re) => re.test(origin));
      if (trusted) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin not allowed — ${origin}`));
      }
    },
  }),
);

app.use("/api/stripe/webhook", express.raw({ type: "application/json" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(clerkMiddleware());

app.use("/api", router);

// Serve built frontend
const frontendDist = path.resolve(__dirname, "../../unified-self/dist");
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get("/{*path}", (_req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

// Clerk's dev-instance handshake path throws (rather than degrading
// gracefully, as a production instance would) whenever a visitor's browser
// presents a session cookie that no longer matches the instance's current
// signing keys -- e.g. after any Clerk key rotation. Without this handler
// that crashes the page with a 500 for that visitor. Clear the stale Clerk
// cookies and serve the page as signed-out instead, so a key rotation never
// takes the site down for anyone.
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (res.headersSent) {
    next(err);
    return;
  }
  req.log?.error({ err }, "Unhandled request error");

  const isClerkAuthError = typeof err?.message === "string" && err.message.includes("Clerk");
  if (isClerkAuthError && fs.existsSync(frontendDist)) {
    res.clearCookie("__session");
    res.clearCookie("__client_uat");
    res.clearCookie("__client");
    res.sendFile(path.join(frontendDist, "index.html"));
    return;
  }

  res.status(500).json({ error: "Internal server error" });
});

export default app;

