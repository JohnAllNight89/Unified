import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { clerkMiddleware } from "@clerk/express";
import { CLERK_PROXY_PATH, clerkProxyMiddleware } from "./middlewares/clerkProxyMiddleware";
import router from "./routes";
import { logger } from "./lib/logger";

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

export default app;
