import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Eye, ChevronRight, Sparkles } from "lucide-react";
import visionDiagram from "@assets/7p_Vision_Deploy.png";

type Step = {
  id: string;
  label: string;
  text: string;
};

type HumanLevel = {
  id: string;
  title: string;
  color: string;
  softColor: string;
  text: string;
  steps: Step[];
};

const livingBeingSteps: Step[] = [
  {
    id: "imperfect-senses",
    label: "Imperfect senses",
    text: "Our senses cannot grasp reality fully. Because perception is limited, what we know is always partial and vulnerable to error.",
  },
  {
    id: "illusion",
    label: "Illusion",
    text: "When perception is incomplete, illusion appears. We take the temporary as permanent and mistake appearances for truth.",
  },
  {
    id: "mistakes",
    label: "Mistakes",
    text: "Illusion naturally produces mistakes. Wrong judgment and wrong action are part of conditioned life.",
  },
  {
    id: "cheating",
    label: "Cheating",
    text: "Cheating means pretending, hiding, or acting as if we know more than we do. This is the part we can consciously challenge by choosing honesty.",
  },
];

const animalSteps: Step[] = [
  {
    id: "eating",
    label: "Eating",
    text: "Eating is necessary for survival, but when life revolves only around consumption, consciousness stays on a lower platform.",
  },
  {
    id: "sleeping",
    label: "Sleeping",
    text: "Rest is natural, yet a life centered only on comfort and bodily maintenance cannot awaken higher purpose.",
  },
  {
    id: "defending",
    label: "Defending",
    text: "The urge to protect body, territory, and identity is natural. Human maturity begins when fear no longer rules every choice.",
  },
  {
    id: "mating",
    label: "Mating",
    text: "Attraction is powerful in embodied life. Without purification it deepens material attachment; with dharmic guidance it can be regulated.",
  },
];

const humanLevels: HumanLevel[] = [
  {
    id: "self-satisfaction",
    title: "Self-satisfaction level",
    color: "hsl(162 31% 49%)",
    softColor: "hsl(162 31% 49% / 0.12)",
    text: "This is where a person begins to search for a more coherent and meaningful life instead of living only by reaction.",
    steps: [
      {
        id: "specializing",
        label: "Specializing",
        text: "A person starts discovering real gifts, direction, and a more specific place in life.",
      },
      {
        id: "practising",
        label: "Practising",
        text: "Practice builds steadiness. Through repetition, values and aspirations begin to take real shape.",
      },
      {
        id: "accomplishment",
        label: "Accomplishment",
        text: "Accomplishment here means not just success, but meaningful completion that gives confidence and direction.",
      },
    ],
  },
  {
    id: "self-sufficiency",
    title: "Self-sufficiency level",
    color: "hsl(46 89% 67%)",
    softColor: "hsl(46 89% 67% / 0.16)",
    text: "This level develops practical responsibility. One learns how to contribute, provide, and take care of life in a stable way.",
    steps: [
      {
        id: "supplying",
        label: "Supplying",
        text: "Supplying means helping sustain life with something concrete, useful, and nourishing.",
      },
      {
        id: "processing",
        label: "Processing",
        text: "Human life involves cultivation, refinement, and transformation. We learn how to shape raw potential into serviceable value.",
      },
      {
        id: "trading",
        label: "Trading",
        text: "Exchange becomes healthy when it is fair, transparent, and directed toward mutual upliftment rather than exploitation.",
      },
    ],
  },
  {
    id: "self-management",
    title: "Self-management level",
    color: "hsl(226 59% 44%)",
    softColor: "hsl(226 59% 44% / 0.12)",
    text: "This level develops balance, healthier relationships, and the ability to live and serve with others in a stable way.",
    steps: [
      {
        id: "wellbeing",
        label: "Wellbeing",
        text: "A person becomes more capable of growth when body, mind, and habits move toward healthier balance.",
      },
      {
        id: "engaging",
        label: "Engaging",
        text: "To engage well means participating actively, responsibly, and with a spirit of contribution.",
      },
      {
        id: "caring",
        label: "Caring",
        text: "Caring moves us beyond self-centeredness and teaches us how to uphold others while growing together.",
      },
    ],
  },
  {
    id: "self-development",
    title: "Self-development level",
    color: "hsl(15 43% 60%)",
    softColor: "hsl(15 43% 60% / 0.14)",
    text: "This level matures consciousness through real formation, reflection, and application.",
    steps: [
      {
        id: "learning",
        label: "Learning",
        text: "Learning begins by hearing carefully and taking in teachings that are higher than conditioned habits.",
      },
      {
        id: "applying",
        label: "Applying",
        text: "Application is where knowledge starts becoming character, discipline, and transformation.",
      },
      {
        id: "sharing",
        label: "Sharing",
        text: "What has touched us deeply naturally seeks expression. Sharing becomes an act of compassion and service.",
      },
    ],
  },
];

const devoteeLevel: HumanLevel = {
  id: "self-realization",
  title: "Self-realization level",
  color: "hsl(0 0% 9%)",
  softColor: "hsl(0 0% 9% / 0.08)",
  text: "This is the doorway to the black line of bhakti-yoga, where life becomes consciously oriented toward Krishna.",
  steps: [
    {
      id: "surrender",
      label: "Submissively surrender",
      text: "Bhakti begins with humility and the willingness to come under higher guidance.",
    },
    {
      id: "inquire",
      label: "Sincerely inquire",
      text: "Real inquiry is not curiosity alone. It is the sincere desire to understand and live by truth.",
    },
    {
      id: "serve",
      label: "Selflessly serve",
      text: "Service matures devotion. Through service, the whole journey is brought back into relationship with Krishna.",
    },
  ],
};

function StepButtons({
  steps,
  accent,
  activeStep,
  onSelect,
}: {
  steps: Step[];
  accent: string;
  activeStep: string;
  onSelect: (stepId: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {steps.map((step, index) => {
        const isActive = step.id === activeStep;
        return (
          <div key={step.id} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onSelect(step.id)}
              className="rounded-2xl px-3 py-2 font-sans text-sm font-semibold transition-all"
              style={{
                background: isActive ? accent : "hsl(40 40% 92%)",
                color: isActive ? "white" : "hsl(14 45% 34%)",
                border: isActive ? `1px solid ${accent}` : "1px solid hsl(14 25% 72% / 0.35)",
              }}
            >
              {step.label}
            </button>
            {index < steps.length - 1 && <ChevronRight className="w-4 h-4" style={{ color: "hsl(14 25% 58%)" }} />}
          </div>
        );
      })}
    </div>
  );
}

export default function Vision() {
  const [activeStage, setActiveStage] = useState<"living-being" | "animal" | "human" | "devotee">("living-being");
  const [livingStep, setLivingStep] = useState(livingBeingSteps[0].id);
  const [animalStep, setAnimalStep] = useState(animalSteps[0].id);
  const [activeHumanLevel, setActiveHumanLevel] = useState(humanLevels[0].id);
  const [humanStepByLevel, setHumanStepByLevel] = useState<Record<string, string>>(
    Object.fromEntries(humanLevels.map((level) => [level.id, level.steps[0].id])),
  );
  const [devoteeStep, setDevoteeStep] = useState(devoteeLevel.steps[0].id);

  const selectedLivingStep = livingBeingSteps.find((step) => step.id === livingStep) ?? livingBeingSteps[0];
  const selectedAnimalStep = animalSteps.find((step) => step.id === animalStep) ?? animalSteps[0];
  const selectedHumanLevel = humanLevels.find((level) => level.id === activeHumanLevel) ?? humanLevels[0];
  const selectedHumanStep =
    selectedHumanLevel.steps.find((step) => step.id === humanStepByLevel[selectedHumanLevel.id]) ?? selectedHumanLevel.steps[0];
  const selectedDevoteeStep = devoteeLevel.steps.find((step) => step.id === devoteeStep) ?? devoteeLevel.steps[0];

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

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(360px,1fr)] items-start">
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

          <div className="space-y-4 xl:sticky xl:top-5">
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
                <div
                  className="rounded-3xl p-4 transition-all"
                  style={{
                    background: activeStage === "living-being" ? "hsl(0 0% 62% / 0.12)" : "hsl(40 40% 93%)",
                    border: `1.5px solid ${activeStage === "living-being" ? "hsl(0 0% 62%)" : "hsl(14 25% 72% / 0.35)"}`,
                  }}
                >
                  <button type="button" onClick={() => setActiveStage("living-being")} className="w-full text-left">
                    <p className="font-serif font-bold leading-tight" style={{ fontSize: "1.08rem", color: "hsl(14 72% 18%)" }}>
                      I'm a living being
                    </p>
                  </button>

                  {activeStage === "living-being" && (
                    <div className="mt-4 pt-4 space-y-4" style={{ borderTop: "1px solid hsl(14 20% 82%)" }}>
                      <div className="rounded-2xl p-4" style={{ background: "hsl(40 35% 94%)", border: "1px solid hsl(14 25% 72% / 0.28)" }}>
                        <p className="font-sans leading-relaxed" style={{ fontSize: "0.9rem", color: "hsl(14 58% 24%)" }}>
                          As Living Being we are made of imperfect senses, that creates illusion, then mistakes appear, and cheating comes as an attempt to hide those mistakes.
                        </p>
                      </div>
                      <StepButtons steps={livingBeingSteps} accent="hsl(0 0% 62%)" activeStep={livingStep} onSelect={setLivingStep} />
                      <div className="rounded-2xl p-4" style={{ background: "hsl(40 35% 94%)", border: "1px solid hsl(14 25% 72% / 0.28)" }}>
                        <p className="font-serif font-bold mb-2" style={{ fontSize: "1rem", color: "hsl(14 72% 18%)" }}>
                          {selectedLivingStep.label}
                        </p>
                        <p className="font-sans leading-relaxed" style={{ fontSize: "0.9rem", color: "hsl(14 40% 35%)" }}>
                          {selectedLivingStep.text}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div
                  className="rounded-3xl p-4 transition-all"
                  style={{
                    background: activeStage === "animal" ? "hsl(0 0% 50% / 0.12)" : "hsl(40 40% 93%)",
                    border: `1.5px solid ${activeStage === "animal" ? "hsl(0 0% 50%)" : "hsl(14 25% 72% / 0.35)"}`,
                  }}
                >
                  <button type="button" onClick={() => setActiveStage("animal")} className="w-full text-left">
                    <p className="font-serif font-bold leading-tight" style={{ fontSize: "1.08rem", color: "hsl(14 72% 18%)" }}>
                      I'm an animal
                    </p>
                  </button>

                  {activeStage === "animal" && (
                    <div className="mt-4 pt-4 space-y-4" style={{ borderTop: "1px solid hsl(14 20% 82%)" }}>
                      <div className="rounded-2xl p-4" style={{ background: "hsl(40 35% 94%)", border: "1px solid hsl(14 25% 72% / 0.28)" }}>
                        <p className="font-sans leading-relaxed" style={{ fontSize: "0.9rem", color: "hsl(14 58% 24%)" }}>
                          As Animal we are eating, sleeping, defending and mating. But as human being, we have also a superior consciousness that allow us to transcend tha nimal stage.
                        </p>
                      </div>
                      <StepButtons steps={animalSteps} accent="hsl(0 0% 50%)" activeStep={animalStep} onSelect={setAnimalStep} />
                      <div className="rounded-2xl p-4" style={{ background: "hsl(40 35% 94%)", border: "1px solid hsl(14 25% 72% / 0.28)" }}>
                        <p className="font-serif font-bold mb-2" style={{ fontSize: "1rem", color: "hsl(14 72% 18%)" }}>
                          {selectedAnimalStep.label}
                        </p>
                        <p className="font-sans leading-relaxed" style={{ fontSize: "0.9rem", color: "hsl(14 40% 35%)" }}>
                          {selectedAnimalStep.text}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div
                  className="rounded-3xl p-4 transition-all"
                  style={{
                    background: activeStage === "human" ? "hsl(26 68% 42% / 0.08)" : "hsl(40 40% 93%)",
                    border: `1.5px solid ${activeStage === "human" ? "hsl(26 68% 42%)" : "hsl(14 25% 72% / 0.35)"}`,
                  }}
                >
                  <button type="button" onClick={() => setActiveStage("human")} className="w-full text-left">
                    <p className="font-serif font-bold leading-tight" style={{ fontSize: "1.08rem", color: "hsl(14 72% 18%)" }}>
                      I'm a human
                    </p>
                  </button>

                  {activeStage === "human" && (
                    <div className="mt-4 pt-4 space-y-4" style={{ borderTop: "1px solid hsl(14 20% 82%)" }}>
                      <div className="rounded-2xl p-4" style={{ background: "hsl(40 35% 94%)", border: "1px solid hsl(14 25% 72% / 0.28)" }}>
                        <p className="font-sans leading-relaxed" style={{ fontSize: "0.9rem", color: "hsl(14 58% 24%)" }}>
                          Human life contains several layers of growth. We do not become spiritually steady in one jump, but by passing through formation, responsibility, balance, and development.
                        </p>
                      </div>

                      <div className="space-y-3">
                        {humanLevels.map((level) => {
                          const isLevelActive = level.id === activeHumanLevel;
                          const activeStep = humanStepByLevel[level.id] ?? level.steps[0].id;
                          const selectedStep = level.steps.find((step) => step.id === activeStep) ?? level.steps[0];

                          return (
                            <div
                              key={level.id}
                              className="rounded-3xl p-4"
                              style={{
                                background: isLevelActive ? level.softColor : "hsl(40 40% 93%)",
                                border: `1.5px solid ${isLevelActive ? level.color : "hsl(14 25% 72% / 0.35)"}`,
                              }}
                            >
                              <button type="button" onClick={() => setActiveHumanLevel(level.id)} className="w-full text-left">
                                <p className="font-serif font-bold leading-tight" style={{ fontSize: "1rem", color: "hsl(14 72% 18%)" }}>
                                  {level.title}
                                </p>
                              </button>

                              {isLevelActive && (
                                <div className="mt-4 pt-4 space-y-4" style={{ borderTop: "1px solid hsl(14 20% 82%)" }}>
                                  <p className="font-sans leading-relaxed" style={{ fontSize: "0.88rem", color: "hsl(14 40% 35%)" }}>
                                    {level.text}
                                  </p>
                                  <StepButtons
                                    steps={level.steps}
                                    accent={level.color}
                                    activeStep={activeStep}
                                    onSelect={(stepId) =>
                                      setHumanStepByLevel((prev) => ({
                                        ...prev,
                                        [level.id]: stepId,
                                      }))
                                    }
                                  />
                                  <div className="rounded-2xl p-4" style={{ background: "hsl(40 35% 94%)", border: "1px solid hsl(14 25% 72% / 0.28)" }}>
                                    <p className="font-serif font-bold mb-2" style={{ fontSize: "1rem", color: "hsl(14 72% 18%)" }}>
                                      {selectedStep.label}
                                    </p>
                                    <p className="font-sans leading-relaxed" style={{ fontSize: "0.9rem", color: "hsl(14 40% 35%)" }}>
                                      {selectedStep.text}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div
                  className="rounded-3xl p-4 transition-all"
                  style={{
                    background: activeStage === "devotee" ? "hsl(0 0% 9% / 0.08)" : "hsl(40 40% 93%)",
                    border: `1.5px solid ${activeStage === "devotee" ? "hsl(0 0% 9%)" : "hsl(14 25% 72% / 0.35)"}`,
                  }}
                >
                  <button type="button" onClick={() => setActiveStage("devotee")} className="w-full text-left">
                    <p className="font-serif font-bold leading-tight" style={{ fontSize: "1.08rem", color: "hsl(14 72% 18%)" }}>
                      I'm a devotee
                    </p>
                  </button>

                  {activeStage === "devotee" && (
                    <div className="mt-4 pt-4 space-y-4" style={{ borderTop: "1px solid hsl(14 20% 82%)" }}>
                      <div className="rounded-2xl p-4" style={{ background: "hsl(40 35% 94%)", border: "1px solid hsl(14 25% 72% / 0.28)" }}>
                        <p className="font-sans leading-relaxed" style={{ fontSize: "0.9rem", color: "hsl(14 58% 24%)" }}>
                          This is the doorway to the black line of bhakti-yoga, where life becomes consciously oriented toward Krishna.
                        </p>
                      </div>
                      <StepButtons steps={devoteeLevel.steps} accent={devoteeLevel.color} activeStep={devoteeStep} onSelect={setDevoteeStep} />
                      <div className="rounded-2xl p-4" style={{ background: "hsl(40 35% 94%)", border: "1px solid hsl(14 25% 72% / 0.28)" }}>
                        <p className="font-serif font-bold mb-2" style={{ fontSize: "1rem", color: "hsl(14 72% 18%)" }}>
                          {selectedDevoteeStep.label}
                        </p>
                        <p className="font-sans leading-relaxed" style={{ fontSize: "0.9rem", color: "hsl(14 40% 35%)" }}>
                          {selectedDevoteeStep.text}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div
              className="rounded-3xl p-5 shadow-sm"
              style={{ background: "hsl(0 0% 9% / 0.05)", border: "1px solid hsl(0 0% 9% / 0.18)" }}
            >
              <p className="font-serif font-semibold mb-2" style={{ fontSize: "1rem", color: "hsl(14 72% 18%)" }}>
                The black line is bhakti-yoga
              </p>
              <p className="font-sans leading-relaxed" style={{ fontSize: "0.9rem", color: "hsl(14 40% 35%)" }}>
                Some very fortunate souls can begin near the black dot. Most of us, however, need the earlier layers of life to be purified and organized so devotional life can become deep, stable, and genuine.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
