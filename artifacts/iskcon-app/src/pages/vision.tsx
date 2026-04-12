import { Link } from "wouter";
import { ArrowLeft, Eye, HeartHandshake, Leaf, BookOpen, Target } from "lucide-react";
import visionDiagram from "@assets/7p_Vision_Deploy.png";

const visionNotes = [
  {
    icon: Leaf,
    title: "Foundation",
    accent: "hsl(163 40% 36%)",
    softAccent: "hsl(163 40% 36% / 0.12)",
    text: "Simple Living, Community, and Holy Place create the environment in which spiritual life can be practiced with steadiness, support, and sacred atmosphere.",
  },
  {
    icon: BookOpen,
    title: "Cultivation",
    accent: "hsl(26 68% 42%)",
    softAccent: "hsl(26 68% 42% / 0.12)",
    text: "Accessing, Learning, Applying, and Sharing help form the right adhikaris by opening the path, deepening understanding, and turning realization into service.",
  },
  {
    icon: Target,
    title: "Duty",
    accent: "hsl(220 60% 44%)",
    softAccent: "hsl(220 60% 44% / 0.12)",
    text: "Like Arjuna, we are called to engage both sva-dharma and sanatana-dharma: offering our contribution in the world while always remembering Krishna.",
  },
  {
    icon: HeartHandshake,
    title: "Direction",
    accent: "hsl(14 40% 30%)",
    softAccent: "hsl(14 40% 30% / 0.12)",
    text: "All these movements support bhakti-yoga. Together they help each person and each community revive their eternal relationship with the Lord.",
  },
];

export default function Vision() {
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
        <p className="font-sans max-w-2xl" style={{ color: "hsl(14 55% 28%)", fontSize: "0.92rem" }}>
          A map of how the 7 Purposes support the individual, strengthen the community, and guide us toward deeper bhakti-yoga.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-5">
        <div
          className="rounded-3xl px-5 py-5 shadow-sm mb-5"
          style={{ background: "hsl(40 30% 96%)", border: "1px solid hsl(14 25% 72% / 0.35)" }}
        >
          <p className="font-serif italic leading-relaxed" style={{ fontSize: "1.02rem", color: "hsl(14 58% 24%)" }}>
            The vision is not a set of separate themes. It is one living movement in which every purpose supports the others,
            every person has a place, and every sincere contribution can be offered in service to Krishna.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.85fr)] items-start">
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
              alt="Vision diagram showing the 7 Purposes supporting identity, duty, community contribution, and spiritual development"
              className="w-full h-auto block rounded-[1.4rem]"
            />
          </div>

          <div className="space-y-4 lg:sticky lg:top-5">
            {visionNotes.map(({ icon: Icon, title, text, accent, softAccent }) => (
              <div
                key={title}
                className="rounded-3xl p-5 shadow-sm"
                style={{ background: "hsl(40 30% 96%)", border: "1px solid hsl(14 25% 72% / 0.35)" }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="shrink-0 rounded-2xl flex items-center justify-center mt-0.5"
                    style={{ width: 44, height: 44, background: softAccent }}
                  >
                    <Icon className="w-4 h-4" style={{ color: accent }} />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold mb-1.5" style={{ fontSize: "1rem", color: "hsl(14 72% 18%)" }}>
                      {title}
                    </h3>
                    <p className="font-sans leading-relaxed" style={{ fontSize: "0.9rem", color: "hsl(14 40% 35%)" }}>
                      {text}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <div
              className="rounded-3xl px-5 py-5 shadow-sm"
              style={{ background: "hsl(26 68% 42% / 0.08)", border: "1px solid hsl(26 68% 42% / 0.2)" }}
            >
              <p className="font-serif font-semibold leading-relaxed" style={{ fontSize: "1rem", color: "hsl(14 62% 22%)" }}>
                The 7 Purposes are part of each of us, part of each community, and part of the path that helps us remember Krishna while offering our lives in service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
