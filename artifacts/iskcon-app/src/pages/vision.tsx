import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Eye, ArrowUpRight, Sparkles } from "lucide-react";
import visionDiagram from "@assets/7p_Vision_Deploy.png";

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
  steps: Array<{
    id: string;
    label: string;
    title: string;
    text: string;
  }>;
};

const stages: VisionStage[] = [
  {
    id: "living-being",
    buttonLabel: "I'm a living being",
    stageTitle: "Living-being",
    color: "hsl(0 0% 62%)",
    softColor: "hsl(0 0% 62% / 0.12)",
    lineIntro:
      "At this level we all carry the universal condition of embodied life: limitation, confusion, and vulnerability.",
    lineMeaning:
      "Our senses are imperfect, that creates illusion, then mistakes appear, and cheating comes as an attempt to hide those mistakes. Cheating is the part we can consciously refuse, and that choice becomes spiritually important.",
    reference: "Reference: Śrīla Prabhupāda often explains the four defects of conditioned life: imperfect senses, illusion, mistakes, and cheating propensity.",
    steps: [
      {
        id: "senses",
        label: "Senses / Illusion",
        title: "Imperfect senses create illusion",
        text: "We do not see reality fully. Because our senses are limited, our understanding becomes covered and we mistake the temporary for the real.",
      },
      {
        id: "mistakes",
        label: "Mistakes",
        title: "Illusion leads to mistakes",
        text: "When our perception is incomplete, wrong judgment follows easily. This is not rare or exceptional; it is part of conditioned existence.",
      },
      {
        id: "cheating",
        label: "Cheating",
        title: "Cheating is where responsibility begins",
        text: "The impulse to pretend, hide, or act as if we know more than we do is the one part we can challenge directly. Truthfulness begins when we stop protecting illusion.",
      },
    ],
  },
  {
    id: "animal",
    buttonLabel: "I'm an animal",
    stageTitle: "Animal propensities",
    color: "hsl(0 0% 50%)",
    softColor: "hsl(0 0% 50% / 0.12)",
    lineIntro:
      "Eating, sleeping, defending, and mating are present in both humans and animals. They are natural, but they are not the full purpose of human life.",
    lineMeaning:
      "Human life becomes special when these propensities are regulated, purified, and offered in a higher purpose. Otherwise we remain bound to the same cycle as the animals.",
    reference: "Reference: Hitopadeśa 25; Bhagavad-gītā 6.17; Śrīla Prabhupāda repeatedly cites āhāra-nidrā-bhaya-maithuna as the common platform of animal and human life.",
    steps: [
      {
        id: "eating-sleeping",
        label: "Eating / Sleeping",
        title: "Basic maintenance",
        text: "Food and rest are necessary, but when life revolves only around comfort and consumption, consciousness stays on a lower platform.",
      },
      {
        id: "defending",
        label: "Defending",
        title: "Fear and protection",
        text: "The urge to protect body, position, and identity is natural. Spiritual growth begins when fear no longer controls all our choices.",
      },
      {
        id: "mating",
        label: "Mating",
        title: "Attraction and attachment",
        text: "This force is powerful in embodied life. Without guidance it binds us more deeply to material identity; with purification it can be placed in dharmic order.",
      },
    ],
  },
  {
    id: "self-satisfaction",
    buttonLabel: "I'm looking for satisfaction",
    stageTitle: "Self-satisfaction",
    color: "hsl(162 31% 49%)",
    softColor: "hsl(162 31% 49% / 0.12)",
    lineIntro:
      "At this stage a person starts to seek a more meaningful and coherent life instead of only reacting to instinct.",
    lineMeaning:
      "Simple Living is especially powerful here. It helps us simplify, specialize, practice, and build a life that is not scattered in too many directions.",
    purposes: [
      { label: "Simple Living", color: "hsl(163 40% 36%)" },
    ],
    steps: [
      {
        id: "specializing",
        label: "Specializing",
        title: "Discovering a real place",
        text: "One begins to identify gifts, tendencies, and areas of meaningful service rather than living in a vague or fragmented way.",
      },
      {
        id: "practising",
        label: "Practising",
        title: "Growth through repetition",
        text: "Steady practice creates character. It is through repeated effort that values start becoming embodied.",
      },
      {
        id: "accomplishment",
        label: "Accomplishment",
        title: "Completion with purpose",
        text: "True accomplishment is not only success, but maturity: finishing things in a way that supports dharma, steadiness, and offering.",
      },
    ],
  },
  {
    id: "self-sufficiency",
    buttonLabel: "I'm learning to sustain life",
    stageTitle: "Self-sufficiency",
    color: "hsl(46 89% 67%)",
    softColor: "hsl(46 89% 67% / 0.16)",
    lineIntro:
      "Here the person learns how to contribute responsibly and help maintain life in a practical way.",
    lineMeaning:
      "This prepares the ground for sva-dharma. We learn how to produce, process, exchange, and take responsibility for the world we live in.",
    purposes: [
      { label: "Simple Living", color: "hsl(163 40% 36%)" },
    ],
    steps: [
      {
        id: "supplying",
        label: "Supplying",
        title: "Learning to provide",
        text: "Supplying means supporting life with something concrete, useful, and nourishing.",
      },
      {
        id: "processing",
        label: "Processing",
        title: "Transforming raw potential",
        text: "Things rarely arrive complete. Human responsibility includes cultivation, organization, refinement, and thoughtful transformation.",
      },
      {
        id: "trading",
        label: "Trading",
        title: "Exchanging responsibly",
        text: "Exchange becomes healthy when it is fair, transparent, and directed toward mutual upliftment rather than exploitation.",
      },
    ],
  },
  {
    id: "self-management",
    buttonLabel: "I'm learning to relate well",
    stageTitle: "Self-management",
    color: "hsl(226 59% 44%)",
    softColor: "hsl(226 59% 44% / 0.12)",
    lineIntro:
      "This line is about inner balance, healthier relationships, and a more stable participation in collective life.",
    lineMeaning:
      "Community becomes essential here. Wellbeing, engaging, and caring all help us become fit to live and serve with others in a sustainable way.",
    purposes: [
      { label: "Community", color: "hsl(220 60% 44%)" },
    ],
    steps: [
      {
        id: "wellbeing",
        label: "Wellbeing",
        title: "Stability within",
        text: "A person becomes more capable of practice when body, mind, and habits are brought into healthier balance.",
      },
      {
        id: "engaging",
        label: "Engaging",
        title: "Entering shared life",
        text: "To engage well means to participate actively, responsibly, and with a spirit of contribution.",
      },
      {
        id: "caring",
        label: "Caring",
        title: "The heart of community",
        text: "Caring moves us beyond self-centeredness and teaches us how to uphold others while growing together.",
      },
    ],
  },
  {
    id: "self-development",
    buttonLabel: "I'm growing in understanding",
    stageTitle: "Self-development",
    color: "hsl(15 43% 60%)",
    softColor: "hsl(15 43% 60% / 0.14)",
    lineIntro:
      "This line shows the movement from receiving knowledge to embodying it and finally offering it for the benefit of others.",
    lineMeaning:
      "Accessing, Learning, Applying, and Sharing cultivate the adhikaris needed for spiritual life. They help us grow from interest to realization.",
    purposes: [
      { label: "Accessing", color: "hsl(26 68% 42%)" },
      { label: "Learning", color: "hsl(17 44% 35%)" },
      { label: "Applying", color: "hsl(14 18% 33%)" },
      { label: "Sharing", color: "hsl(14 40% 30%)" },
    ],
    steps: [
      {
        id: "learning",
        label: "Learning",
        title: "Receiving proper knowledge",
        text: "Learning begins by hearing carefully and taking in teachings that are higher than our conditioned habits.",
      },
      {
        id: "applying",
        label: "Applying",
        title: "Turning knowledge into life",
        text: "Application is where ideas start becoming character, discipline, and transformation.",
      },
      {
        id: "sharing",
        label: "Sharing",
        title: "Giving what has been received",
        text: "What has touched us deeply naturally seeks expression. Sharing becomes an act of compassion and service.",
      },
    ],
  },
  {
    id: "self-realization",
    buttonLabel: "I want to engage in bhakti-yoga",
    stageTitle: "Self-realization",
    color: "hsl(0 0% 9%)",
    softColor: "hsl(0 0% 9% / 0.1)",
    lineIntro:
      "This is the black line: the path of bhakti-yoga, where one’s life becomes consciously oriented toward Krishna.",
    lineMeaning:
      "Some are very fortunate and can begin close to this black dot. But for most people, the earlier lines help prepare the consciousness, conduct, and relationships needed for steady devotional life.",
    purposes: [
      { label: "Holy Place", color: "hsl(0 0% 10%)" },
      { label: "Community", color: "hsl(220 60% 44%)" },
      { label: "All 7 Purposes", color: "hsl(26 68% 42%)" },
    ],
    steps: [
      {
        id: "surrender",
        label: "Submissively surrender",
        title: "Opening the heart",
        text: "Bhakti begins with humility and the willingness to come under higher guidance.",
      },
      {
        id: "inquire",
        label: "Sincerely inquire",
        title: "Seeking truth deeply",
        text: "Real inquiry is not curiosity alone. It is the sincere desire to understand and live by truth.",
      },
      {
        id: "serve",
        label: "Selflessly serve",
        title: "Service as the natural expression of love",
        text: "Service matures devotion. Through service, the whole journey is brought back into relationship with Krishna.",
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
          A step-by-step journey through the lines of the diagram: from the grey human starting point toward the black line of bhakti-yoga.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-5">
        <div
          className="rounded-3xl px-5 py-5 shadow-sm mb-5"
          style={{ background: "hsl(40 30% 96%)", border: "1px solid hsl(14 25% 72% / 0.35)" }}
        >
          <p className="font-serif italic leading-relaxed" style={{ fontSize: "1.02rem", color: "hsl(14 58% 24%)" }}>
            Most of us begin where there is a grey spot. We grow through different layers of life, and the 7 Purposes help purify, support,
            and organize that journey so we can engage more properly in bhakti-yoga.
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
                  Journey through the lines
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
                        <div className="mt-4 pt-4" style={{ borderTop: "1px solid hsl(14 20% 82%)" }}>
                          <div className="flex flex-wrap gap-2">
                            {stage.steps.map((step) => {
                              const isStepActive = step.id === activeStepId;
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
                                  className="rounded-full px-3 py-2 font-sans text-sm font-semibold transition-all"
                                  style={{
                                    background: isStepActive ? stage.color : "hsl(40 40% 92%)",
                                    color: isStepActive ? "white" : "hsl(14 45% 34%)",
                                    border: isStepActive ? `1px solid ${stage.color}` : "1px solid hsl(14 25% 72% / 0.35)",
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
              style={{ background: "hsl(40 30% 96%)", border: `1.5px solid ${selectedStage.color}` }}
            >
              <p className="font-sans text-xs uppercase tracking-[0.18em] mb-2" style={{ color: "hsl(14 35% 50%)" }}>
                Active line
              </p>
              <h2 className="font-serif font-bold mb-2" style={{ fontSize: "1.45rem", color: "hsl(14 72% 18%)" }}>
                {selectedStage.stageTitle}
              </h2>
              <p className="font-sans leading-relaxed mb-3" style={{ fontSize: "0.92rem", color: "hsl(14 40% 35%)" }}>
                {selectedStage.lineIntro}
              </p>
              <p className="font-sans leading-relaxed" style={{ fontSize: "0.92rem", color: "hsl(14 58% 24%)" }}>
                {selectedStage.lineMeaning}
              </p>
              {selectedStage.reference && (
                <p className="font-sans mt-3" style={{ fontSize: "0.78rem", color: "hsl(14 34% 46%)" }}>
                  {selectedStage.reference}
                </p>
              )}
            </div>

            <div
              className="rounded-3xl p-5 shadow-sm"
              style={{ background: "hsl(40 30% 96%)", border: "1px solid hsl(14 25% 72% / 0.35)" }}
            >
              <p className="font-sans text-xs uppercase tracking-[0.18em] mb-2" style={{ color: "hsl(14 35% 50%)" }}>
                Selected box
              </p>
              <h3 className="font-serif font-bold mb-2" style={{ fontSize: "1.15rem", color: "hsl(14 72% 18%)" }}>
                {selectedStep.title}
              </h3>
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

            <div
              className="rounded-3xl px-5 py-5 shadow-sm"
              style={{ background: "hsl(26 68% 42% / 0.08)", border: "1px solid hsl(26 68% 42% / 0.2)" }}
            >
              <p className="font-serif font-semibold leading-relaxed" style={{ fontSize: "1rem", color: "hsl(14 62% 22%)" }}>
                The goal is not to deny the stages of life, but to bring them into harmony so our identity, duty, and contribution all support remembrance of Krishna.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
