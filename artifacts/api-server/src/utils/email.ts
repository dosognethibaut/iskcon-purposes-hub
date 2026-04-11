import nodemailer from "nodemailer";

const ADMIN_EMAIL = "iskcon.7purposes@gmail.com";

const PURPOSE_NAMES: Record<number, string> = {
  1: "Simple Living",
  2: "Community",
  3: "Holy Place",
  4: "Accessing",
  5: "Learning",
  6: "Applying",
  7: "Sharing",
};

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

type SurveyAnswer = { questionIndex: number; answers: string[] };

function getTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return null;

  const host = process.env.SMTP_HOST ?? "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT ?? 465);
  const secure = String(process.env.SMTP_SECURE ?? "true") !== "false";

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

function wrap(title: string, body: string): string {
  return `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; background: #fdf6ec; color: #3a1a0a; border-radius: 12px;">
      <div style="border-bottom: 2px solid #c87941; padding-bottom: 16px; margin-bottom: 24px;">
        <h1 style="font-size: 1.4rem; margin: 0; color: #7a3e1a;">ISKCON 7 Purposes · Radhadesh</h1>
        <h2 style="font-size: 1.1rem; margin: 6px 0 0; color: #3a1a0a;">${title}</h2>
      </div>
      ${body}
      <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #d9b896; font-size: 0.8rem; color: #8a5a3a;">
        Sent automatically from the ISKCON 7 Purposes app.
      </div>
    </div>`;
}

function row(label: string, value: string): string {
  return `<tr>
    <td style="padding: 6px 12px 6px 0; font-weight: bold; font-size: 0.9rem; color: #7a3e1a; white-space: nowrap; vertical-align: top;">${label}</td>
    <td style="padding: 6px 0; font-size: 0.9rem; color: #3a1a0a;">${value || "—"}</td>
  </tr>`;
}

async function send(subject: string, html: string) {
  const transporter = getTransporter();
  if (!transporter) {
    console.log(`[Email] Credentials not configured — skipping: ${subject}`);
    return false;
  }
  try {
    await transporter.verify();
    await transporter.sendMail({
      from: `"ISKCON 7 Purposes" <${process.env.GMAIL_USER}>`,
      to: ADMIN_EMAIL,
      subject,
      html,
    });
    console.log(`[Email] Sent: ${subject}`);
    return true;
  } catch (err) {
    console.error("[Email] Failed to send:", err);
    return false;
  }
}

async function sendRegistrationDigestMail(payload: {
  fullName: string;
  email: string;
  dob: string;
  community: string;
  deptRoles: string[];
  surveyAnswers: SurveyAnswer[];
}) {
  const transporter = getTransporter();
  if (!transporter) {
    console.log("[Email] Registration digest skipped: missing GMAIL_USER or GMAIL_APP_PASSWORD");
    return false;
  }

  const surveyBlocks = payload.surveyAnswers.length
    ? payload.surveyAnswers.map((answer) => {
        const question = SURVEY_QUESTIONS[answer.questionIndex] ?? `Question ${answer.questionIndex + 1}`;
        const answerLabels = answer.answers.map((id, index) => {
          const label = PURPOSE_LABELS[id] ?? id;
          return answer.answers.length > 1 ? `${index + 1}. ${label}` : label;
        }).join(", ");

        return `
          <div style="margin-bottom: 16px; padding: 12px; background: #fff8ef; border-radius: 8px; border-left: 3px solid #c87941;">
            <p style="margin: 0 0 6px; font-weight: bold; font-size: 0.85rem; color: #7a3e1a;">${question}</p>
            <p style="margin: 0; font-size: 0.9rem;">${answerLabels || "—"}</p>
          </div>`;
      }).join("")
    : `<p style="margin: 0; font-size: 0.9rem;">No survey answers submitted.</p>`;

  const html = wrap("New Registration Completed", `
    <table style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
      ${row("Name", payload.fullName)}
      ${row("Email", payload.email)}
      ${row("Date of birth", payload.dob)}
      ${row("Community", payload.community)}
      ${row("Departments", payload.deptRoles.length ? payload.deptRoles.join(", ") : "None selected")}
    </table>
    <div>
      <h3 style="margin: 0 0 12px; font-size: 1rem; color: #7a3e1a;">Survey answers</h3>
      ${surveyBlocks}
    </div>
  `);

  try {
    await transporter.verify();
    await transporter.sendMail({
      from: `"ISKCON 7 Purposes" <${process.env.GMAIL_USER}>`,
      to: ADMIN_EMAIL,
      replyTo: payload.email,
      subject: `🙏 New registration completed: ${payload.fullName}`,
      html,
      text: [
        "New Registration Completed",
        "",
        `Name: ${payload.fullName}`,
        `Email: ${payload.email}`,
        `Date of birth: ${payload.dob}`,
        `Community: ${payload.community}`,
        `Departments: ${payload.deptRoles.length ? payload.deptRoles.join(", ") : "None selected"}`,
        "",
        "Survey answers:",
        ...(payload.surveyAnswers.length
          ? payload.surveyAnswers.map((answer) => {
              const question = SURVEY_QUESTIONS[answer.questionIndex] ?? `Question ${answer.questionIndex + 1}`;
              const labels = answer.answers.map((id, index) => {
                const label = PURPOSE_LABELS[id] ?? id;
                return answer.answers.length > 1 ? `${index + 1}. ${label}` : label;
              }).join(", ");
              return `${question}: ${labels || "—"}`;
            })
          : ["No survey answers submitted."]),
      ].join("\n"),
    });
    console.log(`[Email] Registration digest sent for ${payload.email}`);
    return true;
  } catch (err) {
    console.error("[Email] Registration digest failed:", err);
    return false;
  }
}

export async function emailNewRegistration(user: {
  fullName: string;
  email: string;
  dob: string;
  community: string;
  deptRoles: string[];
}) {
  const body = `
    <table style="border-collapse: collapse; width: 100%;">
      ${row("Name", user.fullName)}
      ${row("Email", user.email)}
      ${row("Date of birth", user.dob)}
      ${row("Community", user.community)}
      ${row("Departments", user.deptRoles.length ? user.deptRoles.join(", ") : "None selected")}
    </table>`;
  await send(`🙏 New Registration: ${user.fullName}`, wrap("New Member Registration", body));
}

export async function emailSurveyAnswers(user: {
  fullName: string;
  email: string;
}, answers: SurveyAnswer[]) {
  const rows = answers.map(a => {
    const question = SURVEY_QUESTIONS[a.questionIndex] ?? `Question ${a.questionIndex + 1}`;
    const answerLabels = a.answers.map((id, i) => {
      const label = PURPOSE_LABELS[id] ?? id;
      return a.answers.length > 1 ? `${i + 1}. ${label}` : label;
    }).join(", ");
    return `
      <div style="margin-bottom: 16px; padding: 12px; background: #fff8ef; border-radius: 8px; border-left: 3px solid #c87941;">
        <p style="margin: 0 0 6px; font-weight: bold; font-size: 0.85rem; color: #7a3e1a;">${question}</p>
        <p style="margin: 0; font-size: 0.9rem;">${answerLabels || "—"}</p>
      </div>`;
  }).join("");

  const body = `
    <p style="margin-bottom: 20px;"><strong>${user.fullName}</strong> (${user.email}) just submitted their survey.</p>
    ${rows}`;
  await send(`📋 Survey: ${user.fullName}`, wrap("Survey Results", body));
}

export async function emailRegistrationDigest(payload: {
  fullName: string;
  email: string;
  dob: string;
  community: string;
  deptRoles: string[];
  surveyAnswers: SurveyAnswer[];
}) {
  return sendRegistrationDigestMail(payload);
}

export async function emailNewActivity(activity: {
  title: string;
  description: string;
  authorName: string;
  purposeId: number;
}) {
  const purposeName = PURPOSE_NAMES[activity.purposeId] ?? `Purpose ${activity.purposeId}`;
  const body = `
    <table style="border-collapse: collapse; width: 100%;">
      ${row("Purpose", purposeName)}
      ${row("Title", activity.title)}
      ${row("Proposed by", activity.authorName)}
    </table>
    <div style="margin-top: 16px; padding: 12px; background: #fff8ef; border-radius: 8px; border-left: 3px solid #c87941;">
      <p style="margin: 0; font-size: 0.9rem; line-height: 1.6;">${activity.description}</p>
    </div>`;
  await send(`📅 New Activity (${purposeName}): ${activity.title}`, wrap("New Activity Proposed", body));
}

export async function emailNewMessage(message: {
  content: string;
  authorName: string;
  purposeId: number;
}) {
  const purposeName = PURPOSE_NAMES[message.purposeId] ?? `Purpose ${message.purposeId}`;
  const body = `
    <table style="border-collapse: collapse; width: 100%; margin-bottom: 16px;">
      ${row("Purpose", purposeName)}
      ${row("Posted by", message.authorName)}
    </table>
    <div style="padding: 16px; background: #fff8ef; border-radius: 8px; border-left: 3px solid #c87941;">
      <p style="margin: 0; font-size: 1rem; font-style: italic; line-height: 1.7; color: #3a1a0a;">"${message.content}"</p>
    </div>`;
  await send(`💬 New Message (${purposeName}) by ${message.authorName}`, wrap("New Community Message", body));
}
