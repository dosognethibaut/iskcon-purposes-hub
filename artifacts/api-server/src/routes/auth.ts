import { Router, type IRouter } from "express";
import { db, usersTable, surveyAnswersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

const router: IRouter = Router();

const JWT_SECRET = process.env.SESSION_SECRET ?? "fallback-secret-change-me";

function signToken(userId: number) {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: "30d" });
}

const registerSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  dob: z.string().min(1),
  community: z.string().min(1),
  deptRoles: z.array(z.string()).optional().default([]),
  photoDataUrl: z.string().optional(),
  surveyAnswers: z.array(z.object({
    questionIndex: z.number(),
    answers: z.array(z.string()),
  })).optional().default([]),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post("/auth/register", async (req, res) => {
  try {
    const body = registerSchema.parse(req.body);

    const existing = await db.select({ id: usersTable.id }).from(usersTable).where(eq(usersTable.email, body.email));
    if (existing.length > 0) {
      res.status(409).json({ error: "An account with this email already exists." });
      return;
    }

    const passwordHash = await bcrypt.hash(body.password, 12);

    const [user] = await db.insert(usersTable).values({
      fullName: body.fullName,
      email: body.email,
      passwordHash,
      dob: body.dob,
      community: body.community,
      deptRoles: JSON.stringify(body.deptRoles),
      photoDataUrl: body.photoDataUrl ?? null,
    }).returning();

    if (body.surveyAnswers.length > 0) {
      await db.insert(surveyAnswersTable).values(
        body.surveyAnswers.map(a => ({
          userId: user.id,
          questionIndex: a.questionIndex,
          answers: JSON.stringify(a.answers),
        }))
      );
    }

    const token = signToken(user.id);
    res.status(201).json({
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        community: user.community,
        deptRoles: body.deptRoles,
        photoDataUrl: user.photoDataUrl ?? null,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    req.log.error({ err }, "Registration failed");
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid data", details: err.errors });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

router.post("/auth/login", async (req, res) => {
  try {
    const body = loginSchema.parse(req.body);

    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, body.email));
    if (!user) {
      res.status(401).json({ error: "Invalid email or password." });
      return;
    }

    const valid = await bcrypt.compare(body.password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Invalid email or password." });
      return;
    }

    const token = signToken(user.id);
    res.json({
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        community: user.community,
        deptRoles: JSON.parse(user.deptRoles || "[]"),
        photoDataUrl: user.photoDataUrl ?? null,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    req.log.error({ err }, "Login failed");
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid data" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

router.get("/auth/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }
    const token = authHeader.slice(7);
    const payload = jwt.verify(token, JWT_SECRET) as { sub: number };
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, Number(payload.sub)));
    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }
    res.json({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      community: user.community,
      deptRoles: JSON.parse(user.deptRoles || "[]"),
      photoDataUrl: user.photoDataUrl ?? null,
      isAdmin: user.isAdmin,
    });
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

export default router;
