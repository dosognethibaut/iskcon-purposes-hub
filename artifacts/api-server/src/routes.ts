import { Router } from "express";
import { emailRegistrationDigest } from "./utils/email";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ ok: true });
});

router.post("/send-registration", async (req, res) => {
  try {
    const body = (req.body ?? {}) as {
      fullName?: unknown;
      email?: unknown;
      dob?: unknown;
      community?: unknown;
      deptRoles?: unknown;
      surveyAnswers?: unknown;
    };
    const result = await emailRegistrationDigest({
      fullName: typeof body.fullName === "string" ? body.fullName : "Unknown user",
      email: typeof body.email === "string" ? body.email : "",
      dob: typeof body.dob === "string" ? body.dob : "",
      community: typeof body.community === "string" ? body.community : "",
      deptRoles: Array.isArray(body.deptRoles) ? body.deptRoles.filter((role: unknown): role is string => typeof role === "string") : [],
      surveyAnswers: Array.isArray(body.surveyAnswers)
        ? body.surveyAnswers
            .filter((item: unknown): item is { questionIndex: number; answers: unknown[] } =>
              typeof item?.questionIndex === "number" && Array.isArray(item?.answers),
            )
            .map((item: { questionIndex: number; answers: unknown[] }) => ({
              questionIndex: item.questionIndex,
              answers: item.answers.filter((answer: unknown): answer is string => typeof answer === "string"),
            }))
        : [],
    });

    if (!result) {
      console.error("[Registration email] Delivery failed or was skipped");
      res.status(500).json({ ok: false, error: "Failed to send registration email" });
      return;
    }

    res.json({ ok: true });
  } catch (error) {
    console.error("[Registration email] Unexpected error:", error);
    res.status(500).json({ ok: false, error: "Failed to send registration email" });
  }
});

export default router;
