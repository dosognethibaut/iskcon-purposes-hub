import { Link } from "wouter";
import { ArrowLeft, Compass, Handshake, Globe2, ShieldCheck } from "lucide-react";
import { brandTheme, withAlpha } from "@/lib/brand";

const pillars = [
  {
    title: "Legacy",
    subtitle: "Srila Prabhupada",
    accent: brandTheme.goldDark,
    softAccent: withAlpha(brandTheme.goldDark, 0.12),
    keywords: ["Vision", "Master plan", "Decision making"],
    icon: Compass,
    description:
      "The 7 Purposes begin with Srila Prabhupada's vision. Legacy means staying connected to his mood, his mission, and the direction he gave ISKCON.",
  },
  {
    title: "Unity",
    subtitle: "Common goal",
    accent: brandTheme.indigo,
    softAccent: withAlpha(brandTheme.indigo, 0.12),
    keywords: ["Teamwork", "Harmony", "Mutual respect"],
    icon: Handshake,
    description:
      "Unity means serving together with one heart. Different people and services become stronger when they move toward the same spiritual purpose.",
  },
  {
    title: "Impact",
    subtitle: "Reaching out",
    accent: brandTheme.sage,
    softAccent: withAlpha(brandTheme.sage, 0.18),
    keywords: ["Accessibility", "Adaptability", "Relevance"],
    icon: Globe2,
    description:
      "Impact means making Krishna consciousness reachable and meaningful. The 7 Purposes are meant to touch people, guide them, and serve real needs.",
  },
  {
    title: "Integrity",
    subtitle: "Safety & success",
    accent: brandTheme.plum,
    softAccent: withAlpha(brandTheme.plum, 0.14),
    keywords: ["Trust", "Patience", "Confidence"],
    icon: ShieldCheck,
    description:
      "Integrity creates trust. It helps the community grow with honesty, safety, patience, and respect, so service can become steady and successful.",
  },
];

export default function Why() {
  return (
    <div className="min-h-[100dvh] bg-background pb-16">
      <div className="px-5 pt-10 pb-6" style={{ background: brandTheme.cream }}>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-sans mb-5 opacity-60 hover:opacity-100 transition-opacity"
          style={{ color: "hsl(319 32% 19%)" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <h1 className="font-serif font-bold" style={{ fontSize: "2.2rem", color: "hsl(319 32% 19%)" }}>
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
                    <h2 className="font-serif font-bold leading-tight" style={{ fontSize: "1.45rem", color: "hsl(319 32% 19%)" }}>
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
                  <p className="font-sans leading-relaxed" style={{ color: "hsl(330 18% 34%)", fontSize: "0.92rem" }}>
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
