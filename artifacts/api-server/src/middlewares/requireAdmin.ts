import type { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";

export async function requireAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  const auth = getAuth(req);
  if (!auth?.userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    res.status(503).json({ error: "Admin access is not configured" });
    return;
  }

  const providedPassword = req.headers["x-admin-password"];
  if (!providedPassword || providedPassword !== adminPassword) {
    res.status(403).json({ error: "Invalid admin password" });
    return;
  }

  req.userId = auth.userId;
  next();
}
