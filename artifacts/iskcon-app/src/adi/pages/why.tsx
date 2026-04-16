import { Link } from "wouter";
import { ArrowLeft, Compass, Handshake, Globe2, ShieldCheck } from "lucide-react";

const pillars = [
  {
    title: "Legacy",
    subtitle: "Srila Prabhupada",
    accent: "hsl(26 68% 42%)",
    softAccent: "hsl(26 68% 42% / 0.12)",
    keywords: ["Vision", "Master plan", "Decision making"],
    icon: Compass,
    description:
      "The 7 Purposes begin with Srila Prabhupada's vision. Legacy means staying connected to his mood, his mission, and the direction he gave ISKCON.",
  },
  {
    title: "Unity",
    subtitle: "Common goal",
    accent: "hsl(220 60% 44%)",
    softAccent: "hsl(220 60% 44% / 0.12)",
    keywords: ["Teamwork", "Harmony", "Mutual respect"],
    icon: Handshake,
    description:
      "Unity means serving together with one heart. Different people and services become stronger when they move toward the same spiritual purpose.",
  },
  {
    title: "Impact",
    subtitle: "Reaching out",
    accent: "hsl(168 42% 33%)",
    softAccent: "hsl(168 42% 33% / 0.12)",
    keywords: ["Accessibility", "Adaptability", "Relevance"],
    icon: Globe2,
    description:
      "Impact means making Krishna consciousness reachable and meaningful. The 7 Purposes are meant to touch people, guide them, and serve real needs.",
  },
  {
    title: "Integrity",
    subtitle: "Safety & success",
    accent: "hsl(14 40% 30%)",
    softAccent: "hsl(14 40% 30% / 0.12)",
    keywords: ["Trust", "Patience", "Confidence"],
    icon: ShieldCheck,
    description:
      "Integrity creates trust. It helps the community grow with honesty, safety, patience, and respect, so service can become steady and successful.",
  },
];

export default function Why() {
  return (
    <div className="min-h-[100dvh] bg-background pb-16">
      <div
        className="px-5 pt-10 pb-6"
        style={{ background: "linear-gradient(110deg, hsl(40 58% 84%) 0%, hsl(37 50% 80%) 100%)" }}
      >
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-sans mb-5 opacity-60 hover:opacity-100 transition-opacity"
          style={{ color: "hsl(14 72% 18%)" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <h1 className="font-serif font-bold" style={{ fontSize: "2.2rem", color: "hsl(14 72% 18%)" }}>
          Why?
        </h1>
        <p className="font-sans mt-1 max-w-md" style={{ color: "hsl(14 55% 28%)", fontSize: "0.9rem" }}>
          The four foundations behind the 7 Purposes.
        </p>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5">
        <div
          className="rounded-3xl p-5 mb-5 shadow-sm"
          style={{ background: "hsl(40 30% 96%)", border: "1px solid hsl(14 25% 72% / 0.35)" }}
        >
          <p className="font-serif italic leading-relaxed" style={{ fontSize: "1rem", color: "hsl(14 50% 28%)" }}>
            These four pillars help explain the mood, direction, and strength behind the 7 Purposes.
          </p>
        </div>

        <div className="space-y-4">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;

            return (
              <div
                key={pillar.title}
                className="rounded-3xl p-5 shadow-sm"
                style={{ background: "hsl(40 30% 96%)", border: "1px solid hsl(14 25% 72% / 0.35)" }}
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0">
                    <div
                      className="rounded-2xl flex items-center justify-center"
                      style={{ width: 52, height: 52, background: pillar.softAccent }}
                    >
                      <Icon className="w-5 h-5" style={{ color: pillar.accent }} />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="font-serif font-bold leading-tight" style={{ fontSize: "1.45rem", color: "hsl(14 72% 18%)" }}>
                      {pillar.title}
                    </h2>
                    <p className="font-sans mt-1" style={{ fontSize: "0.95rem", color: "hsl(14 42% 38%)" }}>
                      {pillar.subtitle}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {pillar.keywords.map((keyword) => (
                        <span
                          key={keyword}
                          className="font-sans text-xs font-semibold px-2.5 py-1 rounded-full"
                          style={{ background: "hsl(40 40% 92%)", color: "hsl(14 45% 34%)", border: "1px solid hsl(14 25% 72% / 0.35)" }}
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4" style={{ borderTop: "1px solid hsl(14 20% 82%)" }}>
                  <p className="font-sans leading-relaxed" style={{ color: "hsl(14 40% 35%)", fontSize: "0.92rem" }}>
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
