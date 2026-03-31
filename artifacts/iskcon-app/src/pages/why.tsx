import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

const pillars = [
  {
    icon: "🪷",
    title: "Legacy",
    subtitle: "Srila Prabhupada",
    attributes: ["Vision", "Master plan", "Decision making process"],
    color: "hsl(220 55% 42%)",
    bg: "hsl(220 55% 42% / 0.08)",
    border: "hsl(220 55% 42% / 0.25)",
  },
  {
    icon: "🤝",
    title: "Unity",
    subtitle: "Common goal",
    attributes: ["Teamwork", "Harmony", "Mutual Respect", "Unity"],
    color: "hsl(220 55% 42%)",
    bg: "hsl(220 55% 42% / 0.08)",
    border: "hsl(220 55% 42% / 0.25)",
  },
  {
    icon: "🌍",
    title: "Impact",
    subtitle: "Reaching out",
    attributes: ["Accessibility", "Adaptability", "Relevance"],
    color: "hsl(220 55% 42%)",
    bg: "hsl(220 55% 42% / 0.08)",
    border: "hsl(220 55% 42% / 0.25)",
  },
  {
    icon: "🛡️",
    title: "Integrity",
    subtitle: "Safety & Success",
    attributes: ["Trust", "Confidence", "Patience", "Tolerance"],
    color: "hsl(220 55% 42%)",
    bg: "hsl(220 55% 42% / 0.08)",
    border: "hsl(220 55% 42% / 0.25)",
  },
];

export default function Why() {
  return (
    <div className="min-h-[100dvh] bg-background pb-16">

      {/* Header */}
      <div
        className="px-5 pt-10 pb-8"
        style={{ background: "linear-gradient(110deg, hsl(40 58% 84%) 0%, hsl(37 50% 80%) 100%)" }}
      >
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-sans mb-6 opacity-60 hover:opacity-100 transition-opacity"
          style={{ color: "hsl(14 72% 18%)" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <h1 className="font-serif font-bold" style={{ fontSize: "2.5rem", color: "hsl(14 72% 18%)" }}>
          Why?
        </h1>
        <p className="font-sans mt-1" style={{ color: "hsl(14 55% 28%)", fontSize: "0.9rem" }}>
          The four pillars behind ISKCON's 7 Purposes
        </p>
      </div>

      {/* Pillars */}
      <div className="max-w-lg mx-auto px-5 py-6 space-y-4">
        {pillars.map((pillar, i) => (
          <div
            key={pillar.title}
            className="rounded-2xl overflow-hidden"
            style={{ border: `1px solid ${pillar.border}`, background: pillar.bg }}
          >
            <div className="flex items-stretch">
              {/* Left — icon + title */}
              <div className="flex flex-col justify-center px-4 py-4 gap-1" style={{ minWidth: 120 }}>
                <span style={{ fontSize: "1.8rem", lineHeight: 1 }}>{pillar.icon}</span>
                <h2 className="font-serif font-bold mt-2 leading-tight" style={{ fontSize: "1.25rem", color: "hsl(14 72% 18%)" }}>
                  {pillar.title}
                </h2>
                <p className="font-sans" style={{ fontSize: "0.72rem", color: "hsl(14 45% 40%)" }}>
                  {pillar.subtitle}
                </p>
              </div>

              {/* Arrow */}
              <div className="flex items-center px-1" style={{ color: "hsl(14 55% 38%)" }}>
                <svg width="28" height="16" viewBox="0 0 28 16" fill="none">
                  <line x1="0" y1="8" x2="22" y2="8" stroke="currentColor" strokeWidth="1.5"/>
                  <polyline points="16,2 22,8 16,14" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              {/* Right — attributes */}
              <div className="flex flex-col justify-center flex-1 px-3 py-4 gap-1">
                {pillar.attributes.map((attr) => (
                  <span
                    key={attr}
                    className="font-serif italic"
                    style={{ fontSize: "0.9rem", color: "hsl(14 55% 30%)" }}
                  >
                    {attr}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom divider number */}
            <div className="px-4 pb-2">
              <div className="w-full h-px" style={{ background: `${pillar.border}` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-lg mx-auto px-5 pb-4">
        <p className="font-sans text-muted-foreground text-sm leading-relaxed text-center italic">
          These four pillars guide how ISKCON's 7 Purposes are understood, applied, and shared within any community.
        </p>
      </div>
    </div>
  );
}
