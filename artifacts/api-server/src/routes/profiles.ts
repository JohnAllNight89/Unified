import { Router } from "express";
import { eq, and, ne } from "drizzle-orm";
import { db, profilesTable } from "@workspace/db";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

router.get("/profile", requireAuth, async (req, res) => {
  try {
    const userId = req.userId!;
    const rows = await db
      .select()
      .from(profilesTable)
      .where(eq(profilesTable.clerkUserId, userId))
      .limit(1);
    if (rows.length === 0) {
      return res.json({ profile: null });
    }
    return res.json({ profile: rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

router.post("/profile", requireAuth, async (req, res) => {
  try {
    const userId = req.userId!;
    const {
      fullName,
      username,
      bio,
      avatarUrl,
      birthDate,
      birthTime,
      birthPlace,
      birthLat,
      birthLng,
      numerologyData,
      astrologyData,
      humanDesignData,
      geneKeysData,
    } = req.body;

    if (!fullName || !birthDate || !birthPlace) {
      return res.status(400).json({ error: "fullName, birthDate, and birthPlace are required" });
    }

    if (username && typeof username === "string") {
      const usernameClean = username.trim().toLowerCase();
      if (!/^[a-z0-9_]{3,30}$/.test(usernameClean)) {
        return res.status(400).json({ error: "Username must be 3-30 characters and contain only letters, numbers, and underscores." });
      }
      const conflict = await db
        .select({ id: profilesTable.id })
        .from(profilesTable)
        .where(
          and(
            eq(profilesTable.username, usernameClean),
            ne(profilesTable.clerkUserId, userId)
          )
        )
        .limit(1);
      if (conflict.length > 0) {
        return res.status(400).json({ error: "That username is already taken. Please choose another." });
      }
    }

    const existing = await db
      .select()
      .from(profilesTable)
      .where(eq(profilesTable.clerkUserId, userId))
      .limit(1);

    const setFields: Record<string, unknown> = {
      fullName,
      birthDate,
      birthPlace,
      birthTime: birthTime || null,
      birthLat: birthLat || null,
      birthLng: birthLng || null,
      updatedAt: new Date(),
    };
    if (username !== undefined) setFields.username = username ? username.trim().toLowerCase() : null;
    if (bio !== undefined) setFields.bio = bio || null;
    if (avatarUrl !== undefined) setFields.avatarUrl = avatarUrl || null;
    if (numerologyData !== undefined) setFields.numerologyData = numerologyData || null;
    if (astrologyData !== undefined) setFields.astrologyData = astrologyData || null;
    if (humanDesignData !== undefined) setFields.humanDesignData = humanDesignData || null;
    if (geneKeysData !== undefined) setFields.geneKeysData = geneKeysData || null;

    if (existing.length > 0) {
      const updated = await db
        .update(profilesTable)
        .set(setFields)
        .where(eq(profilesTable.clerkUserId, userId))
        .returning();
      return res.json({ profile: updated[0] });
    }

    const inserted = await db
      .insert(profilesTable)
      .values({
        clerkUserId: userId,
        fullName,
        username: username ? username.trim().toLowerCase() : null,
        bio: bio || null,
        avatarUrl: avatarUrl || null,
        birthDate,
        birthTime: birthTime || null,
        birthPlace,
        birthLat: birthLat || null,
        birthLng: birthLng || null,
        numerologyData: numerologyData || null,
        astrologyData: astrologyData || null,
        humanDesignData: humanDesignData || null,
        geneKeysData: geneKeysData || null,
      })
      .returning();
    return res.json({ profile: inserted[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
