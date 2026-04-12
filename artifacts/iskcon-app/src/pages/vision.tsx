import { Link } from "wouter";
import { ArrowLeft, Eye, Heart, Globe, Sprout, BookOpen, Star } from "lucide-react";

const VISION_PILLARS = [
  {
    icon: Heart,
    title: "A Sanctuary of Bhakti",
    accent: "hsl(26 68% 42%)",
    softAccent: "hsl(26 68% 42% / 0.12)",
    text: "Radhadesh aspires to be a living example of a Vaishnava community where devotion to Radha and Krishna permeates every aspect of daily life — from morning ārati to evening kirtan, from the kitchen to the fields.",
  },
  {
    icon: Sprout,
    title: "Simple, Sustainable Living",
    accent: "hsl(168 42% 33%)",
    softAccent: "hsl(168 42% 33% / 0.12)",
    text: "Inspired by Śrīla Prabhupāda's vision, we cultivate a lifestyle rooted in the land, producing our own food, reducing our footprint, and demonstrating that happiness does not depend on material complexity.",
  },
  {
    icon: BookOpen,
    title: "Wisdom for the World",
    accent: "hsl(220 60% 44%)",
    softAccent: "hsl(220 60% 44% / 0.12)",
    text: "We are committed to making the timeless teachings of the Bhagavad-gītā and Śrīmad-Bhāgavatam accessible to all — through courses, books, retreats, and personal guidance — bridging the ancient and the contemporary.",
  },
  {
    icon: Globe,
    title: "A European Hub of Inspiration",
    accent: "hsl(14 52% 38%)",
    softAccent: "hsl(14 52% 38% / 0.12)",
    text: "Located in the heart of Europe, Radhadesh serves as a beacon for seekers from across the continent and beyond — welcoming pilgrims, practitioners, and curious souls into an environment of beauty, peace, and spiritual depth.",
  },
  {
    icon: Star,
    title: "Community as Spiritual Practice",
    accent: "hsl(14 40% 30%)",
    softAccent: "hsl(14 40% 30% / 0.12)",
    text: "We envision a community where relationships are purified through service, cooperation, and shared devotion — where each person's gifts are offered in the spirit of the 7 Purposes, building something greater than any individual.",
  },
];

export default function Vision() {
  return (
    <div className="min-h-[100dvh] bg-background pb-16">

      {/* Header */}
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
        <p className="font-sans" style={{ color: "hsl(14 55% 28%)", fontSize: "0.9rem" }}>
          Where we are going — together
        </p>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-4">

        {/* Opening statement */}
        <div className="rounded-3xl px-5 py-5 shadow-sm" style={{ background: "hsl(40 30% 96%)", border: "1px solid hsl(14 25% 72% / 0.35)" }}>
          <p className="font-serif italic leading-relaxed" style={{ fontSize: "1.05rem", color: "hsl(14 62% 22%)" }}>
            "Make this world a better place to live, and prepare all people for going back to Godhead."
          </p>
          <p className="font-sans text-xs mt-2 tracking-wide" style={{ color: "hsl(14 40% 48%)" }}>
            — ŚRĪLA PRABHUPĀDA
          </p>
        </div>

        {/* Vision pillars */}
        {VISION_PILLARS.map(({ icon: Icon, title, text, accent, softAccent }, i) => (
          <div
            key={i}
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
                <p className="font-sans leading-relaxed" style={{ fontSize: "0.88rem", color: "hsl(14 40% 35%)" }}>
                  {text}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Closing CTA */}
        <div className="rounded-3xl px-5 py-5 text-center shadow-sm" style={{ background: "hsl(26 68% 42% / 0.08)", border: "1px solid hsl(26 68% 42% / 0.2)" }}>
          <p className="font-serif font-semibold mb-3" style={{ fontSize: "1rem", color: "hsl(14 62% 22%)" }}>
            This vision is built one purpose at a time — by each of us.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-sans font-semibold text-sm"
            style={{ background: "hsl(26 68% 42%)", color: "white" }}
          >
            Explore the 7 Purposes
          </Link>
        </div>

      </div>
    </div>
  );
}
