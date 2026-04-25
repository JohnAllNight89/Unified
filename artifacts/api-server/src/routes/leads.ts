import { Router } from "express";
import { db, insertLeadSchema, leadsTable } from "@workspace/db";

const router = Router();

router.post("/leads", async (req, res) => {
  try {
    const parsed = insertLeadSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid data", details: parsed.error.issues });
      return;
    }

    const [lead] = await db.insert(leadsTable).values(parsed.data).returning({ id: leadsTable.id });
    res.status(201).json({ success: true, id: lead?.id });
  } catch (err) {
    req.log.error({ err }, "Failed to save lead");
    res.status(500).json({ error: "Could not save your information. Please try again." });
  }
});

export default router;
