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
  { id: "accessing",    label: "Accessing",     logo: logoAccessing },
  { id: "learning",     label: "Learning",      logo: logoLearning },
  { id: "community",    label: "Community",     logo: logoCommunity },
  { id: "applying",     label: "Applying",      logo: logoApplying },
  { id: "holy_place",   label: "Holy Place",    logo: logoHolyPlace },
  { id: "simple",       label: "Simple Living", logo: logoSimpleLiving },
  { id: "sharing",      label: "Sharing",       logo: logoSharing },
];

const questions = [
  "Which of the 7 Purposes do you feel most connected to right now?",
  "Which purposes would you like to develop or grow in?",
  "Where do you feel you already contribute to the community?",
  "Which purposes inspire you most to serve others?",
  "Which purposes feel most challenging or unfamiliar to you?",
];

function PurposeGrid({
  selected,
  onToggle,
}: {
  selected: Set<string>;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {purposes.map(p => {
        const active = selected.has(p.id);
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onToggle(p.id)}
            className="flex flex-col items-center gap-1 p-1.5 rounded-xl transition-all"
            style={{
              background: active ? "hsl(26 68% 42% / 0.12)" : "hsl(40 30% 90%)",
              border: `1.5px solid ${active ? "hsl(26 68% 42%)" : "hsl(14 20% 78%)"}`,
              opacity: active ? 1 : 0.55,
              transform: active ? "scale(1.04)" : "scale(1)",
            }}
          >
            <img
              src={p.logo}
              alt={p.label}
              style={{ width: 32, height: 32, objectFit: "contain", filter: active ? "none" : "grayscale(60%)" }}
            />
            <span
              className="font-sans text-center leading-tight"
              style={{
                fontSize: "0.55rem",
                color: active ? "hsl(26 55% 28%)" : "hsl(14 30% 50%)",
                fontWeight: active ? 700 : 400,
                maxWidth: 48,
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
  const [answers, setAnswers] = useState<Record<number, Set<string>>>(
    () => Object.fromEntries(questions.map((_, i) => [i, new Set<string>()]))
  );
  const [submitted, setSubmitted] = useState(false);

  const toggle = (qi: number, id: string) => {
    setAnswers(prev => {
      const next = new Set(prev[qi]);
      next.has(id) ? next.delete(id) : next.add(id);
      return { ...prev, [qi]: next };
    });
  };

  const answered = questions.filter((_, i) => answers[i].size > 0).length;
  const allAnswered = answered === questions.length;

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
          {answered} / {questions.length} answered — select the purposes that match each question
        </p>
        {/* Progress bar */}
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "hsl(14 30% 70% / 0.25)" }}>
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${(answered / questions.length) * 100}%`, background: "hsl(26 68% 42%)" }}
          />
        </div>
      </div>

      {/* Questions */}
      <div className="max-w-lg mx-auto px-5 py-6 space-y-6">
        {questions.map((q, qi) => (
          <div
            key={qi}
            className="rounded-2xl p-4"
            style={{ background: "hsl(40 40% 93%)", border: `1px solid ${answers[qi].size > 0 ? "hsl(26 68% 42% / 0.4)" : "hsl(14 20% 80%)"}` }}
          >
            <div className="flex gap-4 items-start">
              {/* Question */}
              <div className="flex-1 min-w-0 pr-2">
                <span className="font-sans font-bold text-xs" style={{ color: "hsl(26 68% 42%)" }}>
                  {String(qi + 1).padStart(2, "0")}
                </span>
                <p className="font-serif font-semibold mt-0.5 leading-snug" style={{ fontSize: "0.9rem", color: "hsl(14 72% 18%)" }}>
                  {q}
                </p>
                {answers[qi].size > 0 && (
                  <p className="font-sans text-xs mt-1.5" style={{ color: "hsl(26 55% 38%)" }}>
                    {answers[qi].size} selected
                  </p>
                )}
              </div>

              {/* Logos grid */}
              <div className="shrink-0" style={{ width: 160 }}>
                <PurposeGrid
                  selected={answers[qi]}
                  onToggle={id => toggle(qi, id)}
                />
              </div>
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
          {allAnswered ? "Submit survey" : `Answer all ${questions.length} questions to continue`}
        </button>
      </div>
    </div>
  );
}
