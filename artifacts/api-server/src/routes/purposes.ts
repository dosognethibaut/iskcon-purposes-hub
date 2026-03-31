import { Router, type IRouter } from "express";
import {
  db, purposesTable, activitiesTable, messagesTable,
  commentsTable, activityCommentsTable, activityParticipantsTable,
  notificationsTable,
  insertActivitySchema, insertMessageSchema, usersTable,
} from "@workspace/db";
import { eq, and, sql, isNotNull, inArray, desc } from "drizzle-orm";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { emailNewActivity, emailNewMessage } from "../utils/email";

const router: IRouter = Router();
const JWT_SECRET = process.env.SESSION_SECRET ?? "fallback-secret-change-me";

async function getRequestUser(authHeader?: string) {
  if (!authHeader?.startsWith("Bearer ")) return null;
  try {
    const payload = jwt.verify(authHeader.slice(7), JWT_SECRET) as { sub: number };
    const [user] = await db
      .select({ id: usersTable.id, isAdmin: usersTable.isAdmin, fullName: usersTable.fullName })
      .from(usersTable)
      .where(eq(usersTable.id, Number(payload.sub)));
    return user ?? null;
  } catch { return null; }
}

async function createNotification(userId: number, type: string, message: string) {
  try {
    await db.insert(notificationsTable).values({ userId, type, message });
  } catch { /* silent — never break main flow */ }
}

async function notifyAdmins(type: string, message: string) {
  try {
    const admins = await db.select({ id: usersTable.id }).from(usersTable).where(eq(usersTable.isAdmin, true));
    await Promise.all(admins.map(a => createNotification(a.id, type, message)));
  } catch { }
}

async function notifyAllMembers(type: string, message: string, excludeUserId?: number) {
  try {
    const members = await db.select({ id: usersTable.id }).from(usersTable);
    await Promise.all(
      members
        .filter(m => m.id !== excludeUserId)
        .map(m => createNotification(m.id, type, message)),
    );
  } catch { }
}

// ── Purposes ────────────────────────────────────────────────────────────────

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
    if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }
    const [purpose] = await db.select().from(purposesTable).where(eq(purposesTable.id, id));
    if (!purpose) { res.status(404).json({ error: "Not found" }); return; }
    res.json(purpose);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch purpose");
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── Activities ───────────────────────────────────────────────────────────────

async function enrichActivities(rawActivities: any[], userId?: number) {
  if (!rawActivities.length) return [];
  const ids = rawActivities.map((a: any) => a.id);
  const counts = await db
    .select({
      activityId: activityParticipantsTable.activityId,
      count: sql<number>`cast(count(*) as int)`,
    })
    .from(activityParticipantsTable)
    .where(inArray(activityParticipantsTable.activityId, ids))
    .groupBy(activityParticipantsTable.activityId);

  const joined = userId
    ? await db
        .select({ activityId: activityParticipantsTable.activityId })
        .from(activityParticipantsTable)
        .where(and(
          inArray(activityParticipantsTable.activityId, ids),
          eq(activityParticipantsTable.userId, userId),
        ))
    : [];

  const countMap: Record<number, number> = {};
  counts.forEach((c: any) => { countMap[c.activityId] = c.count; });
  const joinedSet = new Set(joined.map((j: any) => j.activityId));

  return rawActivities.map((a: any) => ({
    ...a,
    participantCount: countMap[a.id] ?? 0,
    isJoined: joinedSet.has(a.id),
  }));
}

router.get("/purposes/:purposeId/activities", async (req, res) => {
  try {
    const purposeId = Number(req.params.purposeId);
    if (isNaN(purposeId)) { res.status(400).json({ error: "Invalid purposeId" }); return; }
    const user = await getRequestUser(req.headers.authorization);
    const raw = user?.isAdmin
      ? await db.select().from(activitiesTable).where(eq(activitiesTable.purposeId, purposeId)).orderBy(activitiesTable.createdAt)
      : await db.select().from(activitiesTable).where(and(eq(activitiesTable.purposeId, purposeId), eq(activitiesTable.approved, true))).orderBy(activitiesTable.createdAt);
    res.json(await enrichActivities(raw, user?.id));
  } catch (err) {
    req.log.error({ err }, "Failed to fetch activities");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/activities", async (req, res) => {
  try {
    const user = await getRequestUser(req.headers.authorization);
    const raw = await db.select().from(activitiesTable)
      .where(and(eq(activitiesTable.approved, true), isNotNull(activitiesTable.scheduledAt)))
      .orderBy(activitiesTable.scheduledAt);
    res.json(await enrichActivities(raw, user?.id));
  } catch (err) {
    req.log.error({ err }, "Failed to fetch calendar activities");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/purposes/:purposeId/activities", async (req, res) => {
  try {
    const user = await getRequestUser(req.headers.authorization);
    if (!user) { res.status(401).json({ error: "Not authenticated" }); return; }
    const purposeId = Number(req.params.purposeId);
    if (isNaN(purposeId)) { res.status(400).json({ error: "Invalid purposeId" }); return; }
    const body = insertActivitySchema.parse({ ...req.body, purposeId });
    const [activity] = await db.insert(activitiesTable).values({ ...body, userId: user.id, approved: false }).returning();
    emailNewActivity({ title: activity.title, description: activity.description, authorName: activity.authorName, purposeId }).catch(() => {});
    notifyAdmins("activity_pending", `📅 New activity proposed by ${activity.authorName}: "${activity.title}" — awaiting your validation`);
    res.status(201).json(activity);
  } catch (err) {
    req.log.error({ err }, "Failed to create activity");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/purposes/:purposeId/activities/:id/join", async (req, res) => {
  try {
    const user = await getRequestUser(req.headers.authorization);
    if (!user) { res.status(401).json({ error: "Not authenticated" }); return; }
    const id = Number(req.params.id);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }
    const [activity] = await db.select().from(activitiesTable).where(eq(activitiesTable.id, id));
    if (!activity || !activity.approved) { res.status(404).json({ error: "Activity not found" }); return; }
    const [countRow] = await db
      .select({ count: sql<number>`cast(count(*) as int)` })
      .from(activityParticipantsTable)
      .where(eq(activityParticipantsTable.activityId, id));
    const current = countRow?.count ?? 0;
    if (activity.maxParticipants && current >= activity.maxParticipants) {
      res.status(409).json({ error: "Activity is full" }); return;
    }
    await db.insert(activityParticipantsTable)
      .values({ activityId: id, userId: user.id })
      .onConflictDoNothing();
    // Notify activity owner that someone joined (only if different person)
    if (activity.userId && activity.userId !== user.id) {
      createNotification(activity.userId, "activity_joined",
        `${user.fullName} joined your activity "${activity.title}"`);
    }
    res.json({ joined: true, participantCount: current + 1 });
  } catch (err) {
    req.log.error({ err }, "Failed to join activity");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/purposes/:purposeId/activities/:id/join", async (req, res) => {
  try {
    const user = await getRequestUser(req.headers.authorization);
    if (!user) { res.status(401).json({ error: "Not authenticated" }); return; }
    const id = Number(req.params.id);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }
    await db.delete(activityParticipantsTable)
      .where(and(eq(activityParticipantsTable.activityId, id), eq(activityParticipantsTable.userId, user.id)));
    res.json({ joined: false });
  } catch (err) {
    req.log.error({ err }, "Failed to leave activity");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/purposes/:purposeId/activities/:id/approve", async (req, res) => {
  try {
    const user = await getRequestUser(req.headers.authorization);
    if (!user?.isAdmin) { res.status(403).json({ error: "Forbidden" }); return; }
    const id = Number(req.params.id);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }
    const [updated] = await db.update(activitiesTable).set({ approved: true }).where(eq(activitiesTable.id, id)).returning();
    // Notify the submitter personally
    if (updated.userId) {
      createNotification(updated.userId, "activity_approved",
        `✅ Your activity "${updated.title}" has been validated and is now published!`);
    }
    // Notify all other members that a new activity is available
    notifyAllMembers("activity_new", `📅 New activity published: "${updated.title}" — check it out and join!`, updated.userId ?? undefined);
    res.json(updated);
  } catch (err) {
    req.log.error({ err }, "Failed to approve activity");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/purposes/:purposeId/activities/:id/complete", async (req, res) => {
  try {
    const user = await getRequestUser(req.headers.authorization);
    if (!user?.isAdmin) { res.status(403).json({ error: "Forbidden" }); return; }
    const id = Number(req.params.id);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }
    const body = z.object({ completedPhotoDataUrl: z.string().optional() }).parse(req.body);
    const [updated] = await db.update(activitiesTable)
      .set({ completedAt: new Date(), completedPhotoDataUrl: body.completedPhotoDataUrl ?? null })
      .where(eq(activitiesTable.id, id)).returning();
    res.json(updated);
  } catch (err) {
    req.log.error({ err }, "Failed to complete activity");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/purposes/:purposeId/activities/:id/uncomplete", async (req, res) => {
  try {
    const user = await getRequestUser(req.headers.authorization);
    if (!user?.isAdmin) { res.status(403).json({ error: "Forbidden" }); return; }
    const id = Number(req.params.id);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }
    const [updated] = await db.update(activitiesTable)
      .set({ completedAt: null, completedPhotoDataUrl: null })
      .where(eq(activitiesTable.id, id)).returning();
    res.json(updated);
  } catch (err) {
    req.log.error({ err }, "Failed to uncomplete activity");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/purposes/:purposeId/activities/:id/disapprove", async (req, res) => {
  try {
    const user = await getRequestUser(req.headers.authorization);
    if (!user?.isAdmin) { res.status(403).json({ error: "Forbidden" }); return; }
    const id = Number(req.params.id);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }
    const [updated] = await db.update(activitiesTable).set({ approved: false }).where(eq(activitiesTable.id, id)).returning();
    res.json(updated);
  } catch (err) {
    req.log.error({ err }, "Failed to disapprove activity");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/purposes/:purposeId/activities/:id", async (req, res) => {
  try {
    const user = await getRequestUser(req.headers.authorization);
    if (!user?.isAdmin) { res.status(403).json({ error: "Forbidden" }); return; }
    const id = Number(req.params.id);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }
    await db.delete(activityParticipantsTable).where(eq(activityParticipantsTable.activityId, id));
    await db.delete(activityCommentsTable).where(eq(activityCommentsTable.activityId, id));
    await db.delete(activitiesTable).where(eq(activitiesTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete activity");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/purposes/:purposeId/activities/:activityId/comments", async (req, res) => {
  try {
    const activityId = Number(req.params.activityId);
    if (isNaN(activityId)) { res.status(400).json({ error: "Invalid activityId" }); return; }
    const comments = await db.select().from(activityCommentsTable)
      .where(eq(activityCommentsTable.activityId, activityId))
      .orderBy(activityCommentsTable.createdAt);
    res.json(comments);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch activity comments");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/purposes/:purposeId/activities/:activityId/comments", async (req, res) => {
  try {
    const user = await getRequestUser(req.headers.authorization);
    if (!user) { res.status(401).json({ error: "Not authenticated" }); return; }
    const activityId = Number(req.params.activityId);
    if (isNaN(activityId)) { res.status(400).json({ error: "Invalid activityId" }); return; }
    const body = z.object({ content: z.string().min(1) }).parse(req.body);
    const [comment] = await db.insert(activityCommentsTable).values({
      activityId,
      userId: user.id,
      authorName: user.fullName,
      content: body.content,
    }).returning();
    // Notify activity owner
    const [activity] = await db.select().from(activitiesTable).where(eq(activitiesTable.id, activityId));
    if (activity?.userId && activity.userId !== user.id) {
      createNotification(activity.userId, "activity_comment",
        `${user.fullName} replied to your activity "${activity.title}"`);
    }
    res.status(201).json(comment);
  } catch (err) {
    req.log.error({ err }, "Failed to create activity comment");
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── Messages ─────────────────────────────────────────────────────────────────

router.get("/purposes/:purposeId/messages", async (req, res) => {
  try {
    const purposeId = Number(req.params.purposeId);
    if (isNaN(purposeId)) { res.status(400).json({ error: "Invalid purposeId" }); return; }
    const user = await getRequestUser(req.headers.authorization);
    const messages = user?.isAdmin
      ? await db.select().from(messagesTable).where(eq(messagesTable.purposeId, purposeId)).orderBy(messagesTable.createdAt)
      : await db.select().from(messagesTable).where(and(eq(messagesTable.purposeId, purposeId), eq(messagesTable.approved, true))).orderBy(messagesTable.createdAt);
    res.json(messages);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch messages");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/purposes/:purposeId/messages", async (req, res) => {
  try {
    const user = await getRequestUser(req.headers.authorization);
    if (!user) { res.status(401).json({ error: "Not authenticated" }); return; }
    const purposeId = Number(req.params.purposeId);
    if (isNaN(purposeId)) { res.status(400).json({ error: "Invalid purposeId" }); return; }
    const body = insertMessageSchema.parse({ ...req.body, purposeId });
    const [message] = await db.insert(messagesTable).values({ ...body, userId: user.id, approved: false }).returning();
    emailNewMessage({ content: message.content, authorName: message.authorName, purposeId }).catch(() => {});
    notifyAdmins("message_pending", `💬 New message proposed by ${message.authorName} — awaiting your validation`);
    res.status(201).json(message);
  } catch (err) {
    req.log.error({ err }, "Failed to create message");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/purposes/:purposeId/messages/:id/approve", async (req, res) => {
  try {
    const user = await getRequestUser(req.headers.authorization);
    if (!user?.isAdmin) { res.status(403).json({ error: "Forbidden" }); return; }
    const id = Number(req.params.id);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }
    const [updated] = await db.update(messagesTable).set({ approved: true }).where(eq(messagesTable.id, id)).returning();
    // Notify the submitter personally
    if (updated.userId) {
      createNotification(updated.userId, "message_approved",
        `✅ Your message has been validated and is now published!`);
    }
    // Notify all other members that a new message is available
    notifyAllMembers("message_new", `💬 New message published by ${updated.authorName} — go read it!`, updated.userId ?? undefined);
    res.json(updated);
  } catch (err) {
    req.log.error({ err }, "Failed to approve message");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/purposes/:purposeId/messages/:id/disapprove", async (req, res) => {
  try {
    const user = await getRequestUser(req.headers.authorization);
    if (!user?.isAdmin) { res.status(403).json({ error: "Forbidden" }); return; }
    const id = Number(req.params.id);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }
    const [updated] = await db.update(messagesTable).set({ approved: false }).where(eq(messagesTable.id, id)).returning();
    res.json(updated);
  } catch (err) {
    req.log.error({ err }, "Failed to disapprove message");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/purposes/:purposeId/messages/:id", async (req, res) => {
  try {
    const user = await getRequestUser(req.headers.authorization);
    if (!user?.isAdmin) { res.status(403).json({ error: "Forbidden" }); return; }
    const id = Number(req.params.id);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }
    await db.delete(commentsTable).where(eq(commentsTable.messageId, id));
    await db.delete(messagesTable).where(eq(messagesTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete message");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/purposes/:purposeId/messages/:messageId/comments", async (req, res) => {
  try {
    const messageId = Number(req.params.messageId);
    if (isNaN(messageId)) { res.status(400).json({ error: "Invalid messageId" }); return; }
    const comments = await db.select().from(commentsTable)
      .where(eq(commentsTable.messageId, messageId))
      .orderBy(commentsTable.createdAt);
    res.json(comments);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch comments");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/purposes/:purposeId/messages/:messageId/comments", async (req, res) => {
  try {
    const user = await getRequestUser(req.headers.authorization);
    if (!user) { res.status(401).json({ error: "Not authenticated" }); return; }
    const messageId = Number(req.params.messageId);
    if (isNaN(messageId)) { res.status(400).json({ error: "Invalid messageId" }); return; }
    const body = z.object({ content: z.string().min(1) }).parse(req.body);
    const [comment] = await db.insert(commentsTable).values({
      messageId,
      userId: user.id,
      authorName: user.fullName,
      content: body.content,
    }).returning();
    // Notify message owner
    const [message] = await db.select().from(messagesTable).where(eq(messagesTable.id, messageId));
    if (message?.userId && message.userId !== user.id) {
      createNotification(message.userId, "message_comment",
        `${user.fullName} replied to your message`);
    }
    res.status(201).json(comment);
  } catch (err) {
    req.log.error({ err }, "Failed to create comment");
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── Badges — role-aware feed of IDs per purpose ──────────────────────────────
// Admin: pending (awaiting validation) IDs  — they need to act on these
// Members/anon: approved IDs               — new content they haven't seen

router.get("/badges", async (req, res) => {
  try {
    const user = await getRequestUser(req.headers.authorization);
    const isAdmin = !!user?.isAdmin;

    const activities = await db
      .select({ id: activitiesTable.id, purposeId: activitiesTable.purposeId })
      .from(activitiesTable)
      .where(eq(activitiesTable.approved, isAdmin ? false : true));
    const messages = await db
      .select({ id: messagesTable.id, purposeId: messagesTable.purposeId })
      .from(messagesTable)
      .where(eq(messagesTable.approved, isAdmin ? false : true));

    const map: Record<number, { activityIds: number[]; messageIds: number[] }> = {};
    for (const a of activities) {
      if (!map[a.purposeId]) map[a.purposeId] = { activityIds: [], messageIds: [] };
      map[a.purposeId].activityIds.push(a.id);
    }
    for (const m of messages) {
      if (!map[m.purposeId]) map[m.purposeId] = { activityIds: [], messageIds: [] };
      map[m.purposeId].messageIds.push(m.id);
    }
    res.json(map);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── Notifications ─────────────────────────────────────────────────────────────

router.get("/notifications", async (req, res) => {
  try {
    const user = await getRequestUser(req.headers.authorization);
    if (!user) { res.status(401).json({ error: "Not authenticated" }); return; }
    const rows = await db
      .select()
      .from(notificationsTable)
      .where(eq(notificationsTable.userId, user.id))
      .orderBy(desc(notificationsTable.createdAt))
      .limit(30);
    const unreadCount = rows.filter((n) => !n.read).length;
    res.json({ unreadCount, notifications: rows });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch notifications");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/notifications/read-all", async (req, res) => {
  try {
    const user = await getRequestUser(req.headers.authorization);
    if (!user) { res.status(401).json({ error: "Not authenticated" }); return; }
    await db
      .update(notificationsTable)
      .set({ read: true })
      .where(and(eq(notificationsTable.userId, user.id), eq(notificationsTable.read, false)));
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to mark notifications read");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
