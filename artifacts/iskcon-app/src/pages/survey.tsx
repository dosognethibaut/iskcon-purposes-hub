import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import logoAccessing    from "@assets/7p_LogoNoTitle_Accessing_1774931916882.png";
import logoLearning     from "@assets/7p_LogoNoTitle_Learning_1774931916883.png";
import logoApplying     from "@assets/7p_LogoNoTitle_Applying_1774931916883.png";
import logoCommunity    from "@assets/7p_LogoNoTitle_Community_1774931916884.png";
import logoHolyPlace    from "@assets/7p_LogoNoTitle_HolyPlace_1774931916884.png";
import logoSharing      from "@assets/7p_LogoNoTitle_Sharing_1774931916884.png";
import logoSimpleLiving from "@assets/7p_LogoNoTitle_SimpleLiving_1774931916885.png";

const purposes = [
  { id: "accessing",  label: "Accessing",     logo: logoAccessing },
  { id: "learning",   label: "Learning",      logo: logoLearning },
  { id: "community",  label: "Community",     logo: logoCommunity },
  { id: "applying",   label: "Applying",      logo: logoApplying },
  { id: "holy_place", label: "Holy Place",    logo: logoHolyPlace },
  { id: "simple",     label: "Simple Living", logo: logoSimpleLiving },
  { id: "sharing",    label: "Sharing",       logo: logoSharing },
];

const sections = [
  {
    title: "Personal",
    questions: [
      "Which 3 purposes appeal most to you or are most relevant at your current stage of life? Select your top 3 in order of priority.",
      "Which purpose would you put at the bottom of your list?",
      "Which purpose is not so relevant for you right now, but you would like to make more relevant?",
    ],
  },
  {
    title: "Community perspective",
    questions: [
      "List the 7 purposes from strongest to weakest, as you perceive our community is linked to them.",
      "On which purpose should our community focus more?",
    ],
  },
  {
    title: "Your department",
    subtitle: "If you are part of one or more departments, or are a department head",
    questions: [
      "Which purpose is linked to your department the strongest?",
      "Which purpose would you like to link more closely to your department?",
    ],
  },
];

const allQuestions = sections.flatMap(s => s.questions);
const totalQuestions = allQuestions.length;

function PurposeGrid({
  order,
  onToggle,
}: {
  order: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-7 gap-1 w-full">
      {purposes.map(p => {
        const rank = order.indexOf(p.id);
        const active = rank !== -1;
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onToggle(p.id)}
            className="relative flex flex-col items-center gap-1 py-1.5 rounded-lg transition-all"
            style={{
              background: active ? "hsl(26 68% 42% / 0.1)" : "transparent",
              border: "none",
              outline: active ? "2px solid hsl(26 68% 42%)" : "2px solid transparent",
              outlineOffset: 0,
              opacity: active ? 1 : 0.38,
            }}
          >
            {active && (
              <span
                className="absolute -top-1.5 -right-1.5 flex items-center justify-center rounded-full font-sans font-bold"
                style={{
                  width: 15, height: 15,
                  fontSize: "0.48rem",
                  background: "hsl(26 68% 42%)",
                  color: "hsl(40 90% 96%)",
                  lineHeight: 1,
                  zIndex: 1,
                }}
              >
                {rank + 1}
              </span>
            )}
            <img
              src={p.logo}
              alt={p.label}
              style={{ width: 36, height: 36, objectFit: "contain", filter: active ? "none" : "grayscale(70%)" }}
            />
            <span
              className="font-sans text-center leading-tight px-0.5"
              style={{
                fontSize: "0.48rem",
                color: active ? "hsl(26 55% 28%)" : "hsl(14 30% 50%)",
                fontWeight: active ? 700 : 400,
              }}
            >
              {p.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default function Survey() {
  const [answers, setAnswers] = useState<Record<number, string[]>>(
    () => Object.fromEntries(Array.from({ length: totalQuestions }, (_, i) => [i, []]))
  );
  const [submitted, setSubmitted] = useState(false);

  const toggle = (qi: number, id: string) => {
    setAnswers(prev => {
      const current = prev[qi];
      const next = current.includes(id)
        ? current.filter(x => x !== id)
        : [...current, id];
      return { ...prev, [qi]: next };
    });
  };

  const answered = Array.from({ length: totalQuestions }, (_, i) => i)
    .filter(i => answers[i].length > 0).length;
  const allAnswered = answered === totalQuestions;

  const handleSubmit = () => {
    if (!allAnswered) return;
    sessionStorage.setItem("survey_done", "1");
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center px-6 gap-4" style={{ background: "hsl(40 30% 96%)" }}>
        <CheckCircle2 className="w-16 h-16" style={{ color: "hsl(26 68% 42%)" }} />
        <h2 className="font-serif font-bold text-2xl text-center" style={{ color: "hsl(14 72% 18%)" }}>
          Thank you!
        </h2>
        <p className="font-sans text-center text-sm max-w-xs" style={{ color: "hsl(14 40% 42%)" }}>
          Your answers help us build a richer community experience. Go back to complete your registration.
        </p>
        <Link
          href="/register"
          className="mt-4 px-6 py-3 rounded-full font-sans font-semibold text-sm"
          style={{ background: "hsl(26 68% 42%)", color: "hsl(40 80% 96%)" }}
        >
          Back to registration
        </Link>
      </div>
    );
  }

  let globalIndex = 0;

  return (
    <div className="min-h-[100dvh] pb-16" style={{ background: "hsl(40 30% 96%)" }}>

      {/* Header */}
      <div
        className="px-5 pt-10 pb-6"
        style={{ background: "linear-gradient(110deg, hsl(40 58% 84%) 0%, hsl(37 50% 80%) 100%)", borderBottom: "1px solid hsl(14 20% 78%)" }}
      >
        <Link href="/register" className="inline-flex items-center gap-1.5 text-sm font-sans mb-5 opacity-60 hover:opacity-100 transition-opacity" style={{ color: "hsl(14 72% 18%)" }}>
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <h1 className="font-serif font-bold" style={{ fontSize: "2rem", color: "hsl(14 72% 18%)" }}>
          Community Survey
        </h1>
        <p className="font-sans mt-1 mb-3" style={{ color: "hsl(14 45% 38%)", fontSize: "0.88rem" }}>
          {answered} / {totalQuestions} answered — tap logos in the order that feels right
        </p>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "hsl(14 30% 70% / 0.25)" }}>
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${(answered / totalQuestions) * 100}%`, background: "hsl(26 68% 42%)" }}
          />
        </div>
      </div>

      {/* Questions by section */}
      <div className="max-w-lg mx-auto px-5 py-6 space-y-8">
        {sections.map((section) => (
          <div key={section.title}>
            {/* Section header */}
            <div className="mb-4">
              <h2 className="font-serif font-bold" style={{ fontSize: "1.1rem", color: "hsl(14 72% 18%)" }}>
                {section.title}
              </h2>
              {section.subtitle && (
                <p className="font-sans text-xs mt-0.5 italic" style={{ color: "hsl(14 40% 48%)" }}>
                  {section.subtitle}
                </p>
              )}
              <div className="mt-2 h-px" style={{ background: "hsl(14 25% 72%)" }} />
            </div>

            <div className="space-y-4">
              {section.questions.map((q) => {
                const qi = globalIndex++;
                return (
                  <div
                    key={qi}
                    className="rounded-2xl p-4"
                    style={{ background: "hsl(40 40% 93%)", border: `1px solid ${answers[qi].length > 0 ? "hsl(26 68% 42% / 0.4)" : "hsl(14 20% 80%)"}` }}
                  >
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="font-sans font-bold text-xs shrink-0" style={{ color: "hsl(26 68% 42%)" }}>
                        {String(qi + 1).padStart(2, "0")}
                      </span>
                      <p className="font-serif font-semibold leading-snug" style={{ fontSize: "0.92rem", color: "hsl(14 72% 18%)" }}>
                        {q}
                      </p>
                    </div>

                    <PurposeGrid
                      order={answers[qi]}
                      onToggle={id => toggle(qi, id)}
                    />

                    {answers[qi].length > 0 && (
                      <p className="font-sans text-xs mt-2" style={{ color: "hsl(26 55% 38%)" }}>
                        {answers[qi].length} selected
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className="w-full py-3.5 rounded-full font-sans font-semibold text-sm transition-all"
          style={{
            background: allAnswered ? "hsl(26 68% 42%)" : "hsl(14 20% 75%)",
            color: allAnswered ? "hsl(40 80% 96%)" : "hsl(14 20% 52%)",
            cursor: allAnswered ? "pointer" : "not-allowed",
          }}
        >
          {allAnswered ? "Submit survey" : `Answer all ${totalQuestions} questions to continue`}
        </button>
      </div>
    </div>
  );
}
