import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

const pillars = [
  {
    svgPath: "M12 2C8 2 5 5.5 5 9c0 4 4 8 7 10 3-2 7-6 7-10 0-3.5-3-7-7-7zm0 9a2 2 0 1 1 0-4 2 2 0 0 1 0 4z",
    viewBox: "0 0 24 24",
    title: "Legacy",
    subtitle: "Srila Prabhupada",
    attributes: ["Vision", "Master plan", "Decision making process"],
    isLast: false,
  },
  {
    svgPath: "M17 20h5v-2a4 4 0 0 0-4-4h-1M9 20H4v-2a4 4 0 0 1 4-4h1m4-4a4 4 0 1 0-8 0 4 4 0 0 0 8 0zm6-4a3 3 0 1 0-6 0 3 3 0 0 0 6 0z",
    viewBox: "0 0 24 24",
    title: "Unity",
    subtitle: "Common goal",
    attributes: ["Teamwork", "Harmony", "Mutual Respect", "Unity"],
    isLast: false,
  },
  {
    svgPath: "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm-2 14.5v-9l6 4.5-6 4.5z",
    viewBox: "0 0 24 24",
    title: "Impact",
    subtitle: "Reaching out",
    attributes: ["Accessibility", "Adaptability", "Relevance"],
    isLast: false,
  },
  {
    svgPath: "M12 2L4 6v6c0 5.25 3.5 10.15 8 11.5C16.5 22.15 20 17.25 20 12V6l-8-4zm0 4l6 3v5c0 3.5-2.5 6.75-6 8-3.5-1.25-6-4.5-6-8V9l6-3zm-1 4v4h2v-4h-2zm0 5v2h2v-2h-2z",
    viewBox: "0 0 24 24",
    title: "Integrity",
    subtitle: "Safety & Success",
    attributes: ["Trust", "Confidence", "Patience", "Tolerance"],
    isLast: true,
  },
];

export default function Why() {
  return (
    <div className="min-h-[100dvh] pb-16" style={{ background: "hsl(40 52% 87%)" }}>

      {/* Header — slide-style title */}
      <div className="px-5 pt-10 pb-6" style={{ borderBottom: "1px solid hsl(14 30% 70% / 0.3)" }}>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-sans mb-6 opacity-60 hover:opacity-100 transition-opacity"
          style={{ color: "hsl(14 72% 18%)" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <h1
          className="font-serif font-bold"
          style={{ fontSize: "3rem", color: "hsl(14 72% 18%)", lineHeight: 1 }}
        >
          Why?
        </h1>
        <p className="font-sans mt-2" style={{ color: "hsl(14 50% 35%)", fontSize: "0.85rem" }}>
          The four pillars behind ISKCON's 7 Purposes
        </p>
      </div>

      {/* Pillars — slide rows */}
      <div className="px-5 pt-6 pb-4 space-y-0 max-w-lg mx-auto">
        {pillars.map((pillar) => (
          <div key={pillar.title}>
            {/* Row */}
            <div className="flex items-center gap-3 py-4">

              {/* Icon column */}
              <div className="shrink-0 flex flex-col items-center" style={{ width: 40 }}>
                <div
                  className="rounded-full flex items-center justify-center"
                  style={{ width: 40, height: 40, background: "hsl(220 52% 42%)" }}
                >
                  <svg viewBox={pillar.viewBox} width="20" height="20" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d={pillar.svgPath} />
                  </svg>
                </div>
              </div>

              {/* Title + subtitle */}
              <div className="shrink-0" style={{ width: 110 }}>
                <div className="font-serif font-bold leading-tight" style={{ fontSize: "1.25rem", color: "hsl(14 72% 16%)" }}>
                  {pillar.title}
                </div>
                <div className="font-sans" style={{ fontSize: "0.7rem", color: "hsl(14 40% 45%)", marginTop: 2 }}>
                  {pillar.subtitle}
                </div>
              </div>

              {/* Arrow — long horizontal */}
              <div className="flex items-center flex-1 relative" style={{ minWidth: 24 }}>
                <div className="w-full h-px" style={{ background: "hsl(14 55% 30%)" }} />
                <svg
                  viewBox="0 0 12 10"
                  width="12" height="10"
                  className="absolute right-0 shrink-0"
                  style={{ fill: "hsl(14 55% 30%)" }}
                >
                  <path d="M0 5 L10 5 L6 1 M10 5 L6 9" stroke="hsl(14 55% 30%)" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {/* Attributes */}
              <div className="shrink-0 flex flex-col items-start gap-0.5" style={{ width: 120 }}>
                {pillar.attributes.map((attr) => (
                  <span
                    key={attr}
                    className="font-serif italic leading-snug"
                    style={{ fontSize: "0.88rem", color: "hsl(14 55% 28%)" }}
                  >
                    {attr}
                  </span>
                ))}
              </div>
            </div>

            {/* Divider between rows (not after last) */}
            {!pillar.isLast && (
              <div className="flex items-center pl-5">
                {/* Chevron connecting icon columns */}
                <div className="flex flex-col items-center" style={{ width: 40 }}>
                  <svg viewBox="0 0 16 10" width="16" height="10" fill="none">
                    <polyline points="4,2 8,8 12,2" stroke="hsl(220 52% 55%)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="flex-1 h-px ml-3" style={{ background: "hsl(14 30% 70% / 0.3)" }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
