import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

const pillars = [
  {
    number: "01",
    title: "Legacy",
    subtitle: "Srila Prabhupada",
    attributes: ["Vision", "Master plan", "Decision making"],
    color: "hsl(220 52% 42%)",
    svgPath: "M12 2C8 2 5 5.5 5 9c0 4 4 8 7 10 3-2 7-6 7-10 0-3.5-3-7-7-7zm0 9a2 2 0 1 1 0-4 2 2 0 0 1 0 4z",
  },
  {
    number: "02",
    title: "Unity",
    subtitle: "Common goal",
    attributes: ["Teamwork", "Harmony", "Mutual Respect", "Unity"],
    color: "hsl(220 52% 42%)",
    svgPath: "M17 20h5v-2a4 4 0 0 0-4-4h-1M9 20H4v-2a4 4 0 0 1 4-4h1m4-4a4 4 0 1 0-8 0 4 4 0 0 0 8 0zm6-4a3 3 0 1 0-6 0 3 3 0 0 0 6 0z",
  },
  {
    number: "03",
    title: "Impact",
    subtitle: "Reaching out",
    attributes: ["Accessibility", "Adaptability", "Relevance"],
    color: "hsl(220 52% 42%)",
    svgPath: "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm-2 14.5v-9l6 4.5-6 4.5z",
  },
  {
    number: "04",
    title: "Integrity",
    subtitle: "Safety & Success",
    attributes: ["Trust", "Confidence", "Patience", "Tolerance"],
    color: "hsl(220 52% 42%)",
    svgPath: "M12 2L4 6v6c0 5.25 3.5 10.15 8 11.5C16.5 22.15 20 17.25 20 12V6l-8-4zm0 4l6 3v5c0 3.5-2.5 6.75-6 8-3.5-1.25-6-4.5-6-8V9l6-3zm-1 4v4h2v-4h-2zm0 5v2h2v-2h-2z",
  },
];

export default function Why() {
  return (
    <div className="min-h-[100dvh] pb-16" style={{ background: "hsl(40 30% 96%)" }}>

      {/* Header */}
      <div className="px-5 pt-10 pb-8" style={{ borderBottom: "1px solid hsl(14 20% 80%)" }}>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-sans mb-8 opacity-50 hover:opacity-100 transition-opacity"
          style={{ color: "hsl(14 72% 18%)" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <h1 className="font-serif font-bold" style={{ fontSize: "3.5rem", color: "hsl(14 72% 16%)", lineHeight: 1 }}>
          Why?
        </h1>
        <p className="font-sans mt-2" style={{ color: "hsl(14 40% 48%)", fontSize: "0.9rem", letterSpacing: "0.01em" }}>
          The four pillars behind ISKCON's 7 Purposes
        </p>
      </div>

      {/* Pillars */}
      <div className="max-w-lg mx-auto px-5 pt-4 pb-4">
        {pillars.map((pillar, i) => (
          <div key={pillar.title}>
            <div className="flex items-start gap-4 py-6">

              {/* Number + Icon */}
              <div className="shrink-0 flex flex-col items-center gap-1.5">
                <span
                  className="font-sans font-bold"
                  style={{ fontSize: "0.65rem", color: "hsl(220 40% 60%)", letterSpacing: "0.08em" }}
                >
                  {pillar.number}
                </span>
                <div
                  className="rounded-full flex items-center justify-center shadow-sm"
                  style={{ width: 44, height: 44, background: pillar.color }}
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d={pillar.svgPath} />
                  </svg>
                </div>
              </div>

              {/* Title block */}
              <div className="shrink-0" style={{ width: 100 }}>
                <div
                  className="font-serif font-bold leading-tight"
                  style={{ fontSize: "1.2rem", color: "hsl(14 72% 16%)" }}
                >
                  {pillar.title}
                </div>
                <div
                  className="font-sans mt-0.5"
                  style={{ fontSize: "0.7rem", color: "hsl(14 35% 52%)", letterSpacing: "0.02em" }}
                >
                  {pillar.subtitle}
                </div>
              </div>

              {/* Arrow */}
              <div className="flex items-center self-center" style={{ flex: 1, minWidth: 20, height: 1, position: "relative", marginTop: 10 }}>
                <div className="w-full" style={{ height: 1, background: "hsl(14 35% 62%)" }} />
                <svg
                  viewBox="0 0 10 10"
                  width="10" height="10"
                  className="shrink-0"
                  style={{ position: "absolute", right: 0 }}
                >
                  <path d="M1 5 L9 5 M5 1 L9 5 L5 9" stroke="hsl(14 35% 62%)" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {/* Attributes */}
              <div className="shrink-0 flex flex-col gap-0.5" style={{ width: 110, paddingTop: 4 }}>
                {pillar.attributes.map(attr => (
                  <span
                    key={attr}
                    className="font-serif italic"
                    style={{ fontSize: "0.85rem", color: "hsl(14 50% 30%)", lineHeight: 1.45 }}
                  >
                    {attr}
                  </span>
                ))}
              </div>
            </div>

            {/* Connector between rows */}
            {i < pillars.length - 1 && (
              <div
                className="ml-6 h-px"
                style={{ background: "hsl(14 20% 82%)" }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
