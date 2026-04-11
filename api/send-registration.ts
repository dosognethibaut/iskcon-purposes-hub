import nodemailer from "nodemailer";

type SurveyAnswer = {
  questionIndex: number;
  answers: string[];
};

type RegistrationBody = {
  fullName?: unknown;
  email?: unknown;
  dob?: unknown;
  community?: unknown;
  deptRoles?: unknown;
  surveyAnswers?: unknown;
};

declare const process: {
  env: Record<string, string | undefined>;
};

declare const console: {
  info: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
};

const ADMIN_EMAIL = "iskcon.7purposes@gmail.com";

const SURVEY_QUESTIONS = [
  "Which 3 purposes appeal most to you or are most relevant at your current stage of life? (top 3 in priority order)",
  "Which purpose would you put at the bottom of your list?",
  "Which purpose is not so relevant for you right now, but you would like to make more relevant?",
  "List the 7 purposes from strongest to weakest, as you perceive our community is linked to them.",
  "On which purpose should our community focus more? (1 to 3)",
  "Which purpose is linked to your department the strongest? (1 to 3)",
  "Which purpose would you like to link more closely to your department? (1 to 3)",
];

const PURPOSE_LABELS: Record<string, string> = {
  accessing: "Accessing",
  learning: "Learning",
  community: "Community",
  applying: "Applying",
  holy_place: "Holy Place",
  simple: "Simple Living",
  sharing: "Sharing",
};

function isSurveyAnswer(value: unknown): value is { questionIndex: number; answers: unknown[] } {
  if (typeof value !== "object" || value === null) return false;
  const item = value as { questionIndex?: unknown; answers?: unknown };
  return typeof item.questionIndex === "number" && Array.isArray(item.answers);
}

function normalizeBody(body: RegistrationBody) {
  return {
    fullName: typeof body.fullName === "string" ? body.fullName : "Unknown user",
    email: typeof body.email === "string" ? body.email : "",
    dob: typeof body.dob === "string" ? body.dob : "",
    community: typeof body.community === "string" ? body.community : "",
    deptRoles: Array.isArray(body.deptRoles)
      ? body.deptRoles.filter((role: unknown): role is string => typeof role === "string")
      : [],
    surveyAnswers: Array.isArray(body.surveyAnswers)
      ? body.surveyAnswers
          .filter(isSurveyAnswer)
          .map((item): SurveyAnswer => ({
            questionIndex: item.questionIndex,
            answers: item.answers.filter((answer: unknown): answer is string => typeof answer === "string"),
          }))
      : [],
  };
}

function createTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error("Missing GMAIL_USER or GMAIL_APP_PASSWORD");
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT ?? 465),
    secure: String(process.env.SMTP_SECURE ?? "true") !== "false",
    auth: { user, pass },
  });
}

function buildText(body: ReturnType<typeof normalizeBody>) {
  const lines = [
    "New Registration Completed",
    "",
    `Name: ${body.fullName}`,
    `Email: ${body.email}`,
    `Date of birth: ${body.dob}`,
    `Community: ${body.community}`,
    `Departments: ${body.deptRoles.length ? body.deptRoles.join(", ") : "None selected"}`,
    "",
    "Survey answers:",
  ];

  if (body.surveyAnswers.length === 0) {
    lines.push("No survey answers submitted.");
    return lines.join("\n");
  }

  body.surveyAnswers.forEach((answer) => {
    const question = SURVEY_QUESTIONS[answer.questionIndex] ?? `Question ${answer.questionIndex + 1}`;
    const labels = answer.answers.map((id, index) => {
      const label = PURPOSE_LABELS[id] ?? id;
      return answer.answers.length > 1 ? `${index + 1}. ${label}` : label;
    });
    lines.push(`${question}: ${labels.join(", ") || "—"}`);
  });

  return lines.join("\n");
}

function buildHtml(body: ReturnType<typeof normalizeBody>) {
  const surveyHtml = body.surveyAnswers.length
    ? body.surveyAnswers.map((answer) => {
        const question = SURVEY_QUESTIONS[answer.questionIndex] ?? `Question ${answer.questionIndex + 1}`;
        const labels = answer.answers.map((id, index) => {
          const label = PURPOSE_LABELS[id] ?? id;
          return answer.answers.length > 1 ? `${index + 1}. ${label}` : label;
        });
        return `
          <div style="margin-bottom: 16px; padding: 12px; background: #fff8ef; border-radius: 8px; border-left: 3px solid #c87941;">
            <p style="margin: 0 0 6px; font-weight: bold; font-size: 0.85rem; color: #7a3e1a;">${question}</p>
            <p style="margin: 0; font-size: 0.9rem;">${labels.join(", ") || "—"}</p>
          </div>`;
      }).join("")
    : `<p style="margin: 0; font-size: 0.9rem;">No survey answers submitted.</p>`;

  return `
    <div style="font-family: Georgia, serif; max-width: 640px; margin: 0 auto; padding: 32px 24px; background: #fdf6ec; color: #3a1a0a; border-radius: 12px;">
      <h1 style="font-size: 1.4rem; margin: 0 0 20px; color: #7a3e1a;">New Registration Completed</h1>
      <table style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
        <tr><td style="padding: 6px 12px 6px 0; font-weight: bold;">Name</td><td>${body.fullName}</td></tr>
        <tr><td style="padding: 6px 12px 6px 0; font-weight: bold;">Email</td><td>${body.email || "—"}</td></tr>
        <tr><td style="padding: 6px 12px 6px 0; font-weight: bold;">Date of birth</td><td>${body.dob || "—"}</td></tr>
        <tr><td style="padding: 6px 12px 6px 0; font-weight: bold;">Community</td><td>${body.community || "—"}</td></tr>
        <tr><td style="padding: 6px 12px 6px 0; font-weight: bold;">Departments</td><td>${body.deptRoles.length ? body.deptRoles.join(", ") : "None selected"}</td></tr>
      </table>
      <h2 style="font-size: 1rem; margin: 0 0 12px; color: #7a3e1a;">Survey answers</h2>
      ${surveyHtml}
    </div>
  `;
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "Method not allowed" });
    return;
  }

  try {
    const body = normalizeBody((req.body ?? {}) as RegistrationBody);
    const transporter = createTransporter();

    await transporter.verify();
    await transporter.sendMail({
      from: `"ISKCON 7 Purposes" <${process.env.GMAIL_USER}>`,
      to: ADMIN_EMAIL,
      replyTo: body.email || undefined,
      subject: `🙏 New registration completed: ${body.fullName}`,
      text: buildText(body),
      html: buildHtml(body),
    });

    console.info("[send-registration] Email sent", { email: body.email, fullName: body.fullName });
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error("[send-registration] Failed", error);
    res.status(500).json({ ok: false, error: "Failed to send registration email" });
  }
}
