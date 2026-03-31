import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

const questions = [
  {
    id: "awareness",
    text: "How familiar are you with ISKCON's 7 Purposes?",
    options: ["Not familiar at all", "I've heard of them", "I know them broadly", "I know them well"],
  },
  {
    id: "purpose_lived",
    text: "Which purpose do you most naturally live already?",
    options: ["Accessing", "Learning", "Community", "Applying", "Holy Place", "Simple Living", "Sharing"],
  },
  {
    id: "purpose_grow",
    text: "Which purpose would you most like to develop?",
    options: ["Accessing", "Learning", "Community", "Applying", "Holy Place", "Simple Living", "Sharing"],
  },
  {
    id: "community_role",
    text: "How do you mainly contribute to your community?",
    options: ["Organising events", "Teaching / sharing knowledge", "Practical service (cooking, cleaning…)", "Supporting others", "I'm just starting"],
  },
  {
    id: "motivation",
    text: "What motivates you to engage with ISKCON's mission?",
    options: ["Personal spiritual growth", "Serving others", "Being part of a community", "Spreading Krishna consciousness", "Family & tradition"],
  },
  {
    id: "frequency",
    text: "How often do you engage with your spiritual community?",
    options: ["Daily", "Several times a week", "Weekly", "Monthly", "Occasionally"],
  },
];

export default function Survey() {
  const [, navigate] = useLocation();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const allAnswered = questions.every(q => answers[q.id]);

  const handleSubmit = () => {
    if (!allAnswered) return;
    sessionStorage.setItem("survey_done", "1");
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center px-6 gap-4">
        <CheckCircle2 className="w-16 h-16" style={{ color: "hsl(26 68% 42%)" }} />
        <h2 className="font-serif font-bold text-2xl text-foreground text-center">Thank you!</h2>
        <p className="font-sans text-muted-foreground text-center text-sm max-w-xs">
          Your answers help us build a richer community experience. Now go back to complete your registration.
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
    <div className="min-h-[100dvh] bg-background pb-16">

      {/* Header */}
      <div className="px-5 pt-10 pb-6" style={{ background: "linear-gradient(110deg, hsl(40 58% 84%) 0%, hsl(37 50% 80%) 100%)" }}>
        <Link href="/register" className="inline-flex items-center gap-1.5 text-sm font-sans mb-5 opacity-60 hover:opacity-100 transition-opacity" style={{ color: "hsl(14 72% 18%)" }}>
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <h1 className="font-serif font-bold" style={{ fontSize: "2rem", color: "hsl(14 72% 18%)" }}>Community Survey</h1>
        <p className="font-sans mt-1" style={{ color: "hsl(14 55% 28%)", fontSize: "0.9rem" }}>
          {Object.keys(answers).length} / {questions.length} answered
        </p>
        {/* Progress bar */}
        <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: "hsl(14 30% 70% / 0.3)" }}>
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%`, background: "hsl(26 68% 42%)" }}
          />
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 py-6 space-y-8">
        {questions.map((q, qi) => (
          <div key={q.id}>
            <p className="font-serif font-semibold mb-3 leading-snug" style={{ fontSize: "1.05rem", color: "hsl(14 72% 18%)" }}>
              <span style={{ color: "hsl(26 68% 42%)" }}>{qi + 1}. </span>{q.text}
            </p>
            <div className="space-y-2">
              {q.options.map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setAnswers(a => ({ ...a, [q.id]: opt }))}
                  className="w-full text-left px-4 py-3 rounded-xl font-sans text-sm border transition-all"
                  style={{
                    borderColor: answers[q.id] === opt ? "hsl(26 68% 42%)" : "hsl(14 30% 70% / 0.4)",
                    background: answers[q.id] === opt ? "hsl(26 68% 42% / 0.1)" : "hsl(40 40% 93%)",
                    color: answers[q.id] === opt ? "hsl(26 55% 28%)" : "hsl(14 55% 30%)",
                    fontWeight: answers[q.id] === opt ? 600 : 400,
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}

        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className="w-full py-3.5 rounded-full font-sans font-semibold text-sm transition-opacity"
          style={{
            background: allAnswered ? "hsl(26 68% 42%)" : "hsl(14 20% 70%)",
            color: allAnswered ? "hsl(40 80% 96%)" : "hsl(14 20% 50%)",
            cursor: allAnswered ? "pointer" : "not-allowed",
          }}
        >
          {allAnswered ? "Submit survey" : `Answer all ${questions.length} questions to continue`}
        </button>
      </div>
    </div>
  );
}
