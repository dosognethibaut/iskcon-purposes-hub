import { Router, type IRouter } from "express";
import { db, purposesTable, activitiesTable, messagesTable, insertActivitySchema, insertMessageSchema } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/purposes", async (req, res) => {
  try {
    const purposes = await db.select().from(purposesTable).orderBy(purposesTable.number);
    res.json(purposes);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch purposes");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/purposes/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }
    const [purpose] = await db.select().from(purposesTable).where(eq(purposesTable.id, id));
    if (!purpose) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(purpose);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch purpose");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/purposes/:purposeId/activities", async (req, res) => {
  try {
    const purposeId = Number(req.params.purposeId);
    if (isNaN(purposeId)) {
      res.status(400).json({ error: "Invalid purposeId" });
      return;
    }
    const activities = await db.select().from(activitiesTable)
      .where(eq(activitiesTable.purposeId, purposeId))
      .orderBy(activitiesTable.createdAt);
    res.json(activities);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch activities");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/purposes/:purposeId/activities", async (req, res) => {
  try {
    const purposeId = Number(req.params.purposeId);
    if (isNaN(purposeId)) {
      res.status(400).json({ error: "Invalid purposeId" });
      return;
    }
    const body = insertActivitySchema.parse({ ...req.body, purposeId });
    const [activity] = await db.insert(activitiesTable).values(body).returning();
    res.status(201).json(activity);
  } catch (err) {
    req.log.error({ err }, "Failed to create activity");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/purposes/:purposeId/activities/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }
    await db.delete(activitiesTable).where(eq(activitiesTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete activity");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/purposes/:purposeId/messages", async (req, res) => {
  try {
    const purposeId = Number(req.params.purposeId);
    if (isNaN(purposeId)) {
      res.status(400).json({ error: "Invalid purposeId" });
      return;
    }
    const messages = await db.select().from(messagesTable)
      .where(eq(messagesTable.purposeId, purposeId))
      .orderBy(messagesTable.createdAt);
    res.json(messages);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch messages");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/purposes/:purposeId/messages", async (req, res) => {
  try {
    const purposeId = Number(req.params.purposeId);
    if (isNaN(purposeId)) {
      res.status(400).json({ error: "Invalid purposeId" });
      return;
    }
    const body = insertMessageSchema.parse({ ...req.body, purposeId });
    const [message] = await db.insert(messagesTable).values(body).returning();
    res.status(201).json(message);
  } catch (err) {
    req.log.error({ err }, "Failed to create message");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/purposes/:purposeId/messages/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }
    await db.delete(messagesTable).where(eq(messagesTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete message");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
