import { Link } from "wouter";
import { ArrowLeft, Compass, Handshake, Globe2, ShieldCheck } from "lucide-react";

const pillars = [
  {
    number: "01",
    title: "Legacy",
    subtitle: "Srila Prabhupada",
    accent: "hsl(26 68% 42%)",
    softAccent: "hsl(26 68% 42% / 0.12)",
    keywords: ["Vision", "Master plan", "Decision making"],
    icon: Compass,
    summary: "Vision is linked with the legacy of Srila Prabhupada because the 7 Purposes do not begin from our own ideas. They begin from the mission he received, lived, and offered to the world with extraordinary clarity.",
    description:
      "When we speak about vision, we are asking: what are we trying to protect, continue, and embody? Srila Prabhupada gave ISKCON not only teachings, but direction. His books, his example, and the original purposes of the Society form a compass for the future. In the mood of the 7 Purposes courses, Legacy means learning to make choices that are rooted in service, faithful to the original intention, and wide enough to guide new generations with wisdom and steadiness.",
  },
  {
    number: "02",
    title: "Unity",
    subtitle: "Common goal",
    accent: "hsl(220 60% 44%)",
    softAccent: "hsl(220 60% 44% / 0.12)",
    keywords: ["Teamwork", "Harmony", "Mutual respect"],
    icon: Handshake,
    summary: "Unity is linked with a common goal because the 7 Purposes invite us to move from isolated enthusiasm to shared service, where different people, talents, and departments can work with one heart.",
    description:
      "In devotional life, unity does not mean sameness. It means many voices learning how to serve Krishna together without losing the center. The courses on the 7 Purposes naturally lead toward cooperation: simple living supports community, holy place supports learning, sharing grows from applied realization. Unity helps us see that every sincere contribution becomes stronger when it serves a larger whole. It creates a culture where relationships are protected, communication becomes cleaner, and collective service becomes joyful.",
  },
  {
    number: "03",
    title: "Impact",
    subtitle: "Reaching out",
    accent: "hsl(168 42% 33%)",
    softAccent: "hsl(168 42% 33% / 0.12)",
    keywords: ["Accessibility", "Adaptability", "Relevance"],
    icon: Globe2,
    summary: "Impact is linked with reaching out because the 7 Purposes are not meant to remain beautiful ideas inside a closed circle. They are meant to become nourishing pathways for real people, in real places, at the right time.",
    description:
      "The mood here is compassionate extension. Srila Prabhupada wanted Krishna consciousness to be accessible, intelligible, and transformative for society at large. That means we learn how to communicate timeless truths in ways people can genuinely receive. Impact asks whether our spaces are welcoming, whether our language is understandable, and whether our offerings respond to people’s actual spiritual hunger. In that sense, impact is outreach with depth: not dilution, but living relevance.",
  },
  {
    number: "04",
    title: "Integrity",
    subtitle: "Safety & success",
    accent: "hsl(14 40% 30%)",
    softAccent: "hsl(14 40% 30% / 0.12)",
    keywords: ["Trust", "Patience", "Confidence"],
    icon: ShieldCheck,
    summary: "Integrity is linked with safety and success because spiritual culture becomes sustainable only when people feel protected, respected, and able to grow in truth.",
    description:
      "The 7 Purposes flourish where there is trust. Without integrity, even beautiful service can become fragile; with integrity, communities become safe enough for sincerity, accountability, and long-term growth. In the mood of the courses, this pillar reminds us that how we serve is as important as what we build. Integrity means aligning conduct, leadership, and relationships with Vaishnava values. It creates the patient, reliable foundation on which healthy communities, meaningful learning, and real transformation can stand.",
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
          The inner foundation of the 7 Purposes: why they matter, how they stay connected to Srila Prabhupada, and what kind of culture they are meant to nourish.
        </p>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5">
        <div
          className="rounded-3xl p-5 mb-5 shadow-sm"
          style={{ background: "hsl(40 30% 96%)", border: "1px solid hsl(14 25% 72% / 0.35)" }}
        >
          <p className="font-serif italic leading-relaxed" style={{ fontSize: "1rem", color: "hsl(14 50% 28%)" }}>
            The 7 Purposes are not only a structure for action. They carry a mood, a direction, and a way of serving.
            These four pillars help us understand why the journey matters and what kind of consciousness it is meant to cultivate.
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
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className="font-sans font-bold text-xs px-2.5 py-1 rounded-full"
                        style={{ background: pillar.softAccent, color: pillar.accent, letterSpacing: "0.08em" }}
                      >
                        {pillar.number}
                      </span>
                      <span className="font-sans text-xs uppercase tracking-[0.16em]" style={{ color: "hsl(14 35% 50%)" }}>
                        {pillar.subtitle}
                      </span>
                    </div>

                    <h2 className="font-serif font-bold leading-tight" style={{ fontSize: "1.45rem", color: "hsl(14 72% 18%)" }}>
                      {pillar.title}
                    </h2>

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
                  <p className="font-sans leading-relaxed mb-3" style={{ color: "hsl(14 58% 24%)", fontSize: "0.96rem" }}>
                    {pillar.summary}
                  </p>
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
