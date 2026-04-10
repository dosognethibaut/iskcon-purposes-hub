import { Router } from "express";
import nodemailer from "nodemailer";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ ok: true });
});

router.post("/send-registration", async (req, res) => {
  try {
    const {
      fullName,
      email,
      dob,
      community,
      deptRoles,
      surveyAnswers,
    } = req.body ?? {};

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const surveyText = Array.isArray(surveyAnswers)
      ? surveyAnswers
          .map(
            (item: { questionIndex: number; answers: string[] }) =>
              `Question ${item.questionIndex + 1}: ${(item.answers || []).join(", ")}`
          )
          .join("\n")
      : "No survey answers";

    const deptText = Array.isArray(deptRoles) ? deptRoles.join(", ") : "";

    const text = `
New registration received

Full name: ${fullName || ""}
Email: ${email || ""}
Date of birth: ${dob || ""}
Community: ${community || ""}
Department / Role: ${deptText}

Survey answers:
${surveyText}
    `.trim();

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: "iskcon.7purposes@gmail.com",
      subject: `New registration: ${fullName || "Unknown user"}`,
      text,
    });

    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: "Failed to send email" });
  }
});

export default router;
