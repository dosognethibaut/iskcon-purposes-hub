import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Eye, ArrowUpRight, Sparkles } from "lucide-react";
import visionDiagram from "@assets/7p_Vision_Deploy.png";

type VisionStep = {
  id: string;
  label: string;
  title: string;
  text: string;
  color?: string;
};

type VisionStage = {
  id: string;
  buttonLabel: string;
  stageTitle: string;
  color: string;
  softColor: string;
  lineIntro: string;
  lineMeaning: string;
  reference?: string;
  purposes?: Array<{ label: string; color: string }>;
  steps: VisionStep[];
};

const stages: VisionStage[] = [
  {
    id: "living-being",
    buttonLabel: "I'm a living being",
    stageTitle: "Living Being",
    color: "hsl(0 0% 62%)",
    softColor: "hsl(0 0% 62% / 0.12)",
    lineIntro:
      "At this level we all share the universal condition of embodied life: limitation, confusion, and vulnerability.",
    lineMeaning:
      "Our senses are imperfect, that creates illusion, then mistakes appear, and cheating comes as an attempt to hide those mistakes. Cheating is the one part we can consciously challenge and refuse.",
    reference: "Reference: Śrīla Prabhupāda repeatedly explains the four defects of conditioned life: imperfect senses, illusion, mistakes, and cheating propensity.",
    steps: [
      {
        id: "senses",
        label: "Senses / Illusion",
        title: "Imperfect senses create illusion",
        text: "We do not perceive reality fully. Because our senses are limited, our understanding becomes covered and illusion naturally appears.",
      },
      {
        id: "mistakes",
        label: "Mistakes",
        title: "Illusion leads to mistakes",
        text: "Once perception is incomplete, mistakes follow. This is part of conditioned life, not something unusual.",
      },
      {
        id: "cheating",
        label: "Cheating",
        title: "Cheating is where responsibility begins",
        text: "Cheating means pretending, hiding, or acting as if we know more than we do. This is the part we can consciously control by choosing honesty.",
      },
    ],
  },
  {
    id: "animal",
    buttonLabel: "I'm an animal",
    stageTitle: "Animal",
    color: "hsl(0 0% 50%)",
    softColor: "hsl(0 0% 50% / 0.12)",
    lineIntro:
      "Eating, sleeping, defending, and mating are common to both humans and animals. They are natural, but they are not the goal of human life.",
    lineMeaning:
      "Human life becomes meaningful when these propensities are regulated and purified. Otherwise we remain bound to the same cycle as the animals.",
    reference: "Reference: Hitopadeśa 25; Bhagavad-gītā 6.17; Śrīla Prabhupāda often cites āhāra-nidrā-bhaya-maithuna as the common basis of animal and human life.",
    steps: [
      {
        id: "eating-sleeping",
        label: "Eating / Sleeping",
        title: "Basic maintenance",
        text: "Food and rest are necessary, but when life revolves only around comfort and consumption, consciousness remains on a lower platform.",
      },
      {
        id: "defending",
        label: "Defending",
        title: "Fear and protection",
        text: "The urge to defend body, possessions, and identity is natural. Spiritual growth begins when fear no longer governs all our choices.",
      },
      {
        id: "mating",
        label: "Mating",
        title: "Attraction and attachment",
        text: "This force is powerful in embodied life. Without guidance it binds us more deeply to material identity; with dharmic order it can be purified.",
      },
    ],
  },
  {
    id: "human",
    buttonLabel: "I'm a human",
    stageTitle: "Human",
    color: "hsl(26 68% 42%)",
    softColor: "hsl(26 68% 42% / 0.08)",
    lineIntro:
      "Human life contains several layers of growth. We do not become spiritually steady in one jump, but by passing through formation, responsibility, balance, and conscious development.",
    lineMeaning:
      "The 7 Purposes support these layers. They help human life become mature enough to support real spiritual practice and meaningful contribution.",
    purposes: [
      { label: "Simple Living", color: "hsl(163 40% 36%)" },
      { label: "Community", color: "hsl(220 60% 44%)" },
      { label: "Holy Place", color: "hsl(0 0% 10%)" },
      { label: "Accessing", color: "hsl(26 68% 42%)" },
      { label: "Learning", color: "hsl(17 44% 35%)" },
      { label: "Applying", color: "hsl(14 18% 33%)" },
      { label: "Sharing", color: "hsl(14 40% 30%)" },
    ],
    steps: [
      {
        id: "self-satisfaction",
        label: "Self-satisfaction",
        title: "Self-satisfaction",
        color: "hsl(162 31% 49%)",
        text: "This stage begins the search for a more coherent life. One starts to specialize, practice, and find real direction instead of living only by reaction.",
      },
      {
        id: "self-sufficiency",
        label: "Self-sufficiency",
        title: "Self-sufficiency",
        color: "hsl(46 89% 67%)",
        text: "Here we learn responsibility, contribution, and practical competence. It prepares the ground for healthy sva-dharma and meaningful offering.",
      },
      {
        id: "self-management",
        label: "Self-management",
        title: "Self-management",
        color: "hsl(226 59% 44%)",
        text: "This stage develops wellbeing, engagement, and care. It helps a person become stable enough to live and serve with others in a healthy way.",
      },
      {
        id: "self-development",
        label: "Self-development",
        title: "Self-development",
        color: "hsl(15 43% 60%)",
        text: "This line matures through learning, applying, and sharing. It is where consciousness becomes more teachable, purposeful, and fit for spiritual growth.",
      },
    ],
  },
  {
    id: "devotee",
    buttonLabel: "I'm a devotee",
    stageTitle: "Devotee",
    color: "hsl(0 0% 9%)",
    softColor: "hsl(0 0% 9% / 0.1)",
    lineIntro:
      "This is the black line: the path of bhakti-yoga, where one’s life becomes consciously oriented toward Krishna.",
    lineMeaning:
      "Some are very fortunate and can begin close to the black dot. For most people, the earlier lines help prepare the consciousness and conduct needed for steady devotional life.",
    purposes: [
      { label: "Holy Place", color: "hsl(0 0% 10%)" },
      { label: "Community", color: "hsl(220 60% 44%)" },
      { label: "All 7 Purposes", color: "hsl(26 68% 42%)" },
    ],
    steps: [
      {
        id: "self-realization",
        label: "Self-realization",
        title: "Self-realization",
        text: "Here the person consciously enters the black line of bhakti-yoga through surrender, sincere inquiry, and selfless service, moving toward sankirtan and remembrance of Krishna.",
      },
    ],
  },
];

export default function Vision() {
  const [activeStage, setActiveStage] = useState(stages[0].id);
  const [activeStepByStage, setActiveStepByStage] = useState<Record<string, string>>(
    Object.fromEntries(stages.map((stage) => [stage.id, stage.steps[0].id])),
  );

  const selectedStage = useMemo(
    () => stages.find((stage) => stage.id === activeStage) ?? stages[0],
    [activeStage],
  );
  const selectedStep = selectedStage.steps.find((step) => step.id === activeStepByStage[selectedStage.id]) ?? selectedStage.steps[0];

  return (
    <div className="min-h-[100dvh] bg-background pb-16">
      <style>{`
        @keyframes visionRiseReveal {
          0% {
            opacity: 0;
            clip-path: inset(100% 0 0 0 round 28px);
            transform: translateY(32px);
          }
          100% {
            opacity: 1;
            clip-path: inset(0 0 0 0 round 28px);
            transform: translateY(0);
          }
        }
      `}</style>

      <div
        className="px-5 pt-10 pb-8"
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
        <div className="flex items-center gap-3 mb-2">
          <Eye className="w-7 h-7" style={{ color: "hsl(14 55% 38%)" }} />
          <h1 className="font-serif font-bold" style={{ fontSize: "2.2rem", color: "hsl(14 72% 18%)" }}>
            Vision
          </h1>
        </div>
        <p className="font-sans max-w-3xl" style={{ color: "hsl(14 55% 28%)", fontSize: "0.92rem" }}>
          A step-by-step journey from the grey human starting point toward the black line of bhakti-yoga.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-5">
        <div
          className="rounded-3xl px-5 py-5 shadow-sm mb-5"
          style={{ background: "hsl(40 30% 96%)", border: "1px solid hsl(14 25% 72% / 0.35)" }}
        >
          <p className="font-serif italic leading-relaxed" style={{ fontSize: "1.02rem", color: "hsl(14 58% 24%)" }}>
            Most of us begin where there is a grey spot. We grow through different layers of life, and the 7 Purposes help purify, support, and organize that journey so we can engage more properly in bhakti-yoga.
          </p>
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.95fr)] items-start">
          <div className="space-y-5">
            <div
              className="rounded-[2rem] p-3 shadow-sm overflow-hidden"
              style={{
                background: "hsl(40 30% 96%)",
                border: "1px solid hsl(14 25% 72% / 0.35)",
                animation: "visionRiseReveal 1.3s cubic-bezier(0.22, 1, 0.36, 1) both",
                transformOrigin: "bottom center",
              }}
            >
              <img
                src={visionDiagram}
                alt="Vision journey diagram showing the movement from living-being to self-realization and bhakti-yoga"
                className="w-full h-auto block rounded-[1.4rem]"
              />
            </div>

            <div
              className="rounded-3xl p-5 shadow-sm"
              style={{ background: "hsl(40 30% 96%)", border: "1px solid hsl(14 25% 72% / 0.35)" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4" style={{ color: "hsl(26 68% 42%)" }} />
                <h2 className="font-serif font-bold" style={{ fontSize: "1.2rem", color: "hsl(14 72% 18%)" }}>
                  7 Purposes Journey
                </h2>
              </div>

              <div className="space-y-3">
                {stages.map((stage) => {
                  const isActive = stage.id === activeStage;
                  const activeStepId = activeStepByStage[stage.id] ?? stage.steps[0].id;

                  return (
                    <div
                      key={stage.id}
                      className="rounded-3xl p-4 transition-all"
                      style={{
                        background: isActive ? stage.softColor : "hsl(40 40% 93%)",
                        border: `1.5px solid ${isActive ? stage.color : "hsl(14 25% 72% / 0.35)"}`,
                        boxShadow: isActive ? `0 12px 30px ${stage.color}20` : "none",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setActiveStage(stage.id)}
                        className="w-full text-left flex items-center justify-between gap-3"
                      >
                        <div>
                          <p className="font-serif font-bold leading-tight" style={{ fontSize: "1.08rem", color: "hsl(14 72% 18%)" }}>
                            {stage.buttonLabel}
                          </p>
                          <p className="font-sans mt-1" style={{ fontSize: "0.82rem", color: "hsl(14 38% 38%)" }}>
                            {stage.stageTitle}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className="inline-flex items-center justify-center rounded-full"
                            style={{ width: 14, height: 14, background: stage.color }}
                          />
                          {isActive && <ArrowUpRight className="w-4 h-4" style={{ color: stage.color }} />}
                        </div>
                      </button>

                      {isActive && (
                        <div className="mt-4 pt-4 space-y-4" style={{ borderTop: "1px solid hsl(14 20% 82%)" }}>
                          <div
                            className="rounded-2xl p-4"
                            style={{ background: "hsl(40 35% 94%)", border: "1px solid hsl(14 25% 72% / 0.28)" }}
                          >
                            <h3 className="font-serif font-bold mb-2" style={{ fontSize: "1rem", color: "hsl(14 72% 18%)" }}>
                              {stage.stageTitle} level
                            </h3>
                            <p className="font-sans leading-relaxed mb-2" style={{ fontSize: "0.88rem", color: "hsl(14 40% 35%)" }}>
                              {stage.lineIntro}
                            </p>
                            <p className="font-sans leading-relaxed" style={{ fontSize: "0.88rem", color: "hsl(14 58% 24%)" }}>
                              {stage.lineMeaning}
                            </p>
                            {stage.reference && (
                              <p className="font-sans mt-3" style={{ fontSize: "0.76rem", color: "hsl(14 34% 46%)" }}>
                                {stage.reference}
                              </p>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {stage.steps.map((step) => {
                              const isStepActive = step.id === activeStepId;
                              const stepColor = step.color ?? stage.color;

                              return (
                                <button
                                  key={step.id}
                                  type="button"
                                  onClick={() =>
                                    setActiveStepByStage((prev) => ({
                                      ...prev,
                                      [stage.id]: step.id,
                                    }))
                                  }
                                  className="rounded-2xl px-3 py-2 font-sans text-sm font-semibold transition-all"
                                  style={{
                                    background: isStepActive ? stepColor : "hsl(40 40% 92%)",
                                    color: isStepActive ? "white" : "hsl(14 45% 34%)",
                                    border: isStepActive ? `1px solid ${stepColor}` : "1px solid hsl(14 25% 72% / 0.35)",
                                  }}
                                >
                                  {step.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-4 xl:sticky xl:top-5">
            <div
              className="rounded-3xl p-5 shadow-sm"
              style={{ background: "hsl(40 30% 96%)", border: `1.5px solid ${selectedStep.color ?? selectedStage.color}` }}
            >
              <p className="font-sans text-xs uppercase tracking-[0.18em] mb-2" style={{ color: "hsl(14 35% 50%)" }}>
                Selected box
              </p>
              <h2 className="font-serif font-bold mb-2" style={{ fontSize: "1.35rem", color: "hsl(14 72% 18%)" }}>
                {selectedStep.title}
              </h2>
              <p className="font-sans leading-relaxed" style={{ fontSize: "0.92rem", color: "hsl(14 40% 35%)" }}>
                {selectedStep.text}
              </p>
            </div>

            {selectedStage.purposes && (
              <div
                className="rounded-3xl p-5 shadow-sm"
                style={{ background: "hsl(40 30% 96%)", border: "1px solid hsl(14 25% 72% / 0.35)" }}
              >
                <p className="font-sans text-xs uppercase tracking-[0.18em] mb-3" style={{ color: "hsl(14 35% 50%)" }}>
                  Related purposes
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedStage.purposes.map((purpose) => (
                    <span
                      key={purpose.label}
                      className="rounded-full px-3 py-1.5 font-sans text-xs font-semibold"
                      style={{ background: `${purpose.color}18`, color: purpose.color, border: `1px solid ${purpose.color}33` }}
                    >
                      {purpose.label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div
              className="rounded-3xl p-5 shadow-sm"
              style={{ background: "hsl(0 0% 9% / 0.05)", border: "1px solid hsl(0 0% 9% / 0.18)" }}
            >
              <p className="font-serif font-semibold mb-2" style={{ fontSize: "1rem", color: "hsl(14 72% 18%)" }}>
                The black line is bhakti-yoga
              </p>
              <p className="font-sans leading-relaxed" style={{ fontSize: "0.9rem", color: "hsl(14 40% 35%)" }}>
                Some very fortunate souls can begin near the black dot. Most of us, however, need the earlier lines to be purified and organized so devotional life can become deep, stable, and genuine.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
