import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Eye, CircleDot, ArrowUpRight, HeartHandshake, Sparkles } from "lucide-react";
import visionDiagram from "@assets/7p_Vision_Deploy.png";

const stages = [
  {
    id: "living-being",
    title: "Living-being",
    color: "hsl(0 0% 62%)",
    softColor: "hsl(0 0% 62% / 0.12)",
    keywords: ["Eating", "Defending", "Mating"],
    description:
      "This is where many people begin. Life is mostly shaped by basic needs, conditioning, fear, and survival patterns. The grey point reminds us that spiritual life often starts from an ordinary human situation.",
    purposeLink:
      "The 7 Purposes do not reject this stage. They help lift life from mere survival toward meaning, responsibility, and service.",
  },
  {
    id: "self-satisfaction",
    title: "Self-satisfaction",
    color: "hsl(162 31% 49%)",
    softColor: "hsl(162 31% 49% / 0.12)",
    keywords: ["Specializing", "Practising", "Accomplishment"],
    description:
      "Here a person begins to organize life with more intention. Skills, discipline, and contribution start to take shape, and life becomes more purposeful.",
    purposeLink:
      "Simple Living especially supports this movement by helping us live with clarity, steadiness, and less distraction.",
  },
  {
    id: "self-sufficiency",
    title: "Self-sufficiency",
    color: "hsl(46 89% 67%)",
    softColor: "hsl(46 89% 67% / 0.16)",
    keywords: ["Supplying", "Processing", "Trading"],
    description:
      "This stage is about responsibility, contribution, and practical competence. One learns how to sustain life, offer value, and stand in a healthy relationship with the world.",
    purposeLink:
      "Our sva-dharma grows here. What we do in the world can become part of our offering when it is aligned with Krishna conscious purpose.",
  },
  {
    id: "self-management",
    title: "Self-management",
    color: "hsl(226 59% 44%)",
    softColor: "hsl(226 59% 44% / 0.12)",
    keywords: ["Wellbeing", "Engaging", "Caring"],
    description:
      "This is the stage of healthier relationships, emotional maturity, and cooperative life. A person becomes more able to care, collaborate, and remain steady in practice.",
    purposeLink:
      "Community is especially strong here. It teaches us how to support one another and build a life where spiritual culture can breathe.",
  },
  {
    id: "self-development",
    title: "Self-development",
    color: "hsl(15 43% 60%)",
    softColor: "hsl(15 43% 60% / 0.14)",
    keywords: ["Learning", "Applying", "Sharing"],
    description:
      "Here the person becomes more conscious, intentional, and teachable. Knowledge is received, practiced, and then offered outward for the benefit of others.",
    purposeLink:
      "Accessing, Learning, Applying, and Sharing cultivate the adhikaris needed for spiritual life to become stable and fruitful.",
  },
  {
    id: "self-realization",
    title: "Self-realization",
    color: "hsl(0 0% 9%)",
    softColor: "hsl(0 0% 9% / 0.12)",
    keywords: ["Submissively surrender", "Sincerely inquire", "Selflessly serve"],
    description:
      "This stage opens the doorway to real spiritual depth. The person is no longer only improving life, but consciously orienting life toward transcendence and relationship with Krishna.",
    purposeLink:
      "Holy Place, Community, and the whole supportive ecology of the 7 Purposes create the right environment for this stage to deepen.",
  },
];

const sideThemes = [
  {
    title: "Identity",
    text: "The left axis shows growth from living-being to devotee. The journey is not denial of life, but purification and redirection.",
  },
  {
    title: "Duty",
    text: "The right axis holds both sva-dharma and sanatana-dharma. Like Arjuna, we are called to do our duty while remembering Krishna.",
  },
  {
    title: "Bhakti-yoga",
    text: "The black line is the life of devotion. Some souls can begin there very quickly, but for most of us the lower stages need to be purified and integrated first.",
  },
];

export default function Vision() {
  const [activeStage, setActiveStage] = useState(stages[0].id);
  const selectedStage = stages.find((stage) => stage.id === activeStage) ?? stages[0];

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
          An interactive map of the journey: from the grey human starting point, through the different stages of life,
          toward the black line of bhakti-yoga and sankirtan.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-5">
        <div
          className="rounded-3xl px-5 py-5 shadow-sm mb-5"
          style={{ background: "hsl(40 30% 96%)", border: "1px solid hsl(14 25% 72% / 0.35)" }}
        >
          <p className="font-serif italic leading-relaxed" style={{ fontSize: "1.02rem", color: "hsl(14 58% 24%)" }}>
            The 7 Purposes live both in the individual and in the community. They support each other, strengthen our duty,
            and help us engage more deeply in bhakti-yoga and revive our eternal relationship with the Lord.
          </p>
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(330px,0.95fr)] items-start">
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
                alt="Interactive vision reference diagram showing stages of life, the 7 Purposes, duty, identity, and the black line of bhakti-yoga"
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
                  Explore the stages
                </h2>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {stages.map((stage) => {
                  const isActive = stage.id === activeStage;

                  return (
                    <button
                      key={stage.id}
                      type="button"
                      onClick={() => setActiveStage(stage.id)}
                      className="text-left rounded-3xl p-4 transition-all"
                      style={{
                        background: isActive ? stage.softColor : "hsl(40 40% 93%)",
                        border: `1.5px solid ${isActive ? stage.color : "hsl(14 25% 72% / 0.35)"}`,
                        boxShadow: isActive ? `0 10px 24px ${stage.color}22` : "none",
                        transform: isActive ? "translateY(-1px)" : "translateY(0)",
                      }}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span
                          className="inline-flex items-center justify-center rounded-full"
                          style={{ width: 12, height: 12, background: stage.color }}
                        />
                        {isActive && <ArrowUpRight className="w-4 h-4" style={{ color: stage.color }} />}
                      </div>
                      <div className="font-serif font-bold leading-tight" style={{ fontSize: "1rem", color: "hsl(14 72% 18%)" }}>
                        {stage.title}
                      </div>
                      <p className="font-sans mt-2" style={{ fontSize: "0.8rem", color: "hsl(14 38% 38%)" }}>
                        {stage.keywords.join(" · ")}
                      </p>
                    </button>
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
              <div className="flex items-center gap-2 mb-3">
                <CircleDot className="w-4 h-4" style={{ color: selectedStage.color }} />
                <p className="font-sans text-xs uppercase tracking-[0.18em]" style={{ color: "hsl(14 35% 50%)" }}>
                  Selected stage
                </p>
              </div>

              <h2 className="font-serif font-bold mb-2" style={{ fontSize: "1.5rem", color: "hsl(14 72% 18%)" }}>
                {selectedStage.title}
              </h2>

              <div className="flex flex-wrap gap-2 mb-4">
                {selectedStage.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full px-3 py-1 font-sans text-xs font-semibold"
                    style={{ background: selectedStage.softColor, color: selectedStage.color }}
                  >
                    {keyword}
                  </span>
                ))}
              </div>

              <p className="font-sans leading-relaxed mb-3" style={{ fontSize: "0.92rem", color: "hsl(14 40% 35%)" }}>
                {selectedStage.description}
              </p>
              <p className="font-sans leading-relaxed" style={{ fontSize: "0.92rem", color: "hsl(14 58% 24%)" }}>
                {selectedStage.purposeLink}
              </p>
            </div>

            <div
              className="rounded-3xl p-5 shadow-sm"
              style={{ background: "hsl(40 30% 96%)", border: "1px solid hsl(14 25% 72% / 0.35)" }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="rounded-2xl flex items-center justify-center shrink-0"
                  style={{ width: 42, height: 42, background: "hsl(0 0% 62% / 0.12)" }}
                >
                  <CircleDot className="w-4 h-4" style={{ color: "hsl(0 0% 40%)" }} />
                </div>
                <div>
                  <h3 className="font-serif font-bold mb-1.5" style={{ fontSize: "1rem", color: "hsl(14 72% 18%)" }}>
                    Most people begin at the grey spot
                  </h3>
                  <p className="font-sans leading-relaxed" style={{ fontSize: "0.9rem", color: "hsl(14 40% 35%)" }}>
                    The majority of us begin in the lower human condition. We grow gradually through formation, responsibility,
                    relationship, and self-development before we can remain properly established in the black line of bhakti-yoga.
                  </p>
                </div>
              </div>
            </div>

            <div
              className="rounded-3xl p-5 shadow-sm"
              style={{ background: "hsl(0 0% 9% / 0.05)", border: "1px solid hsl(0 0% 9% / 0.18)" }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="rounded-2xl flex items-center justify-center shrink-0"
                  style={{ width: 42, height: 42, background: "hsl(0 0% 9% / 0.12)" }}
                >
                  <CircleDot className="w-4 h-4" style={{ color: "hsl(0 0% 9%)" }} />
                </div>
                <div>
                  <h3 className="font-serif font-bold mb-1.5" style={{ fontSize: "1rem", color: "hsl(14 72% 18%)" }}>
                    Some souls can begin near the black dot
                  </h3>
                  <p className="font-sans leading-relaxed" style={{ fontSize: "0.9rem", color: "hsl(14 40% 35%)" }}>
                    Some are especially fortunate and can engage very quickly in the higher current of bhakti. Even then, the
                    supporting purposes remain essential because they help that devotion flourish in a healthy and sustainable way.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {sideThemes.map((theme) => (
                <div
                  key={theme.title}
                  className="rounded-3xl p-5 shadow-sm"
                  style={{ background: "hsl(40 30% 96%)", border: "1px solid hsl(14 25% 72% / 0.35)" }}
                >
                  <h3 className="font-serif font-bold mb-1.5" style={{ fontSize: "1rem", color: "hsl(14 72% 18%)" }}>
                    {theme.title}
                  </h3>
                  <p className="font-sans leading-relaxed" style={{ fontSize: "0.9rem", color: "hsl(14 40% 35%)" }}>
                    {theme.text}
                  </p>
                </div>
              ))}
            </div>

            <div
              className="rounded-3xl px-5 py-5 shadow-sm"
              style={{ background: "hsl(26 68% 42% / 0.08)", border: "1px solid hsl(26 68% 42% / 0.2)" }}
            >
              <p className="font-serif font-semibold leading-relaxed" style={{ fontSize: "1rem", color: "hsl(14 62% 22%)" }}>
                The whole movement is meant to support a person in doing one’s duty, remembering Krishna, engaging in bhakti-yoga,
                and gradually moving toward sankirtan with maturity, clarity, and devotion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
