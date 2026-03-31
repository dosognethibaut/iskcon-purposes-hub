import { useState, useEffect } from "react";
import { Link } from "wouter";
import { BookOpen, HelpCircle, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import prabhupadaPhoto from "@assets/image_1774931191461.png";

const quotes = [
  {
    text: "The Krishna consciousness movement is meant to teach people how to love God. This is the sum and substance of all our purposes.",
    context: "On the essence of ISKCON's mission",
  },
  {
    text: "Simple living and high thinking is the solution to economic problems. We do not need to work so hard. We only need to produce food and live peacefully.",
    context: "On Simple Living",
  },
  {
    text: "We want to create a community of devotees who live together, work together, and worship together. This is the ideal of Krishna consciousness.",
    context: "On Community",
  },
  {
    text: "Every town and every village should have a temple where people can come to learn the science of God. This is our mission — to create holy places all over the world.",
    context: "On Holy Place",
  },
  {
    text: "We are distributing this knowledge freely. Anyone who reads our books, who hears our philosophy, will be benefited. This is our purpose — accessing the truth.",
    context: "On Accessing",
  },
  {
    text: "You must learn the Bhagavad-gītā thoroughly. This is not ordinary knowledge — it is transcendental knowledge that liberates the soul.",
    context: "On Learning",
  },
  {
    text: "Whatever you do, do it for Krishna. Eat for Krishna, sleep for Krishna, work for Krishna. When everything is applied in Krishna's service, that is perfection.",
    context: "On Applying",
  },
  {
    text: "Go and preach. Give this knowledge to others. The greatest act of compassion is to share Krishna consciousness with those who are suffering in ignorance.",
    context: "On Sharing",
  },
];

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  const goTo = (index: number) => {
    setFading(true);
    setTimeout(() => {
      setCurrent((index + quotes.length) % quotes.length);
      setFading(false);
    }, 300);
  };

  useEffect(() => {
    const timer = setInterval(() => goTo(current + 1), 6000);
    return () => clearInterval(timer);
  }, [current]);

  return (
    <div className="min-h-[100dvh] flex flex-col overflow-hidden" style={{ background: "hsl(14 35% 12%)" }}>

      {/* ── FULL-SCREEN PHOTO BACKGROUND ─────────────────────────── */}
      <div className="absolute inset-0">
        <img
          src={prabhupadaPhoto}
          alt="Srila Prabhupada"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "60% 8%",
          }}
        />
        {/* Subtle dark vignette — preserves photo visibility */}
        <div
          className="absolute inset-0"
          style={{
            background: [
              "linear-gradient(to bottom, hsl(14 35% 10% / 0.55) 0%, transparent 35%, transparent 50%, hsl(14 35% 10% / 0.85) 100%)",
              "linear-gradient(to right, hsl(14 35% 10% / 0.2) 0%, transparent 50%)",
            ].join(", "),
          }}
        />
      </div>

      {/* ── CONTENT ──────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col min-h-[100dvh]">

        {/* Top title */}
        <div className="px-6 pt-10">
          <h1
            className="font-serif font-bold leading-tight"
            style={{ fontSize: "clamp(1.6rem, 6vw, 2.8rem)", color: "hsl(40 80% 94%)" }}
          >
            The 7 Purposes<br />of ISKCON
          </h1>
          <div
            className="inline-block mt-2 px-4 py-1 rounded-full font-serif italic font-semibold"
            style={{ background: "hsl(26 68% 42%)", color: "hsl(40 80% 96%)", fontSize: "clamp(0.75rem, 2.5vw, 0.95rem)" }}
          >
            &amp; Community Building
          </div>
        </div>

        {/* Spacer to push quote to lower half */}
        <div className="flex-1" />

        {/* Quote carousel */}
        <div className="px-6 pb-2">
          <div
            style={{
              opacity: fading ? 0 : 1,
              transform: fading ? "translateY(6px)" : "translateY(0)",
              transition: "opacity 0.3s ease, transform 0.3s ease",
            }}
          >
            {/* Quote mark */}
            <div
              className="font-serif font-bold mb-2 leading-none"
              style={{ fontSize: "3.5rem", color: "hsl(26 68% 52% / 0.7)", lineHeight: 1 }}
            >
              "
            </div>

            <p
              className="font-serif italic leading-relaxed"
              style={{ fontSize: "clamp(1rem, 3.5vw, 1.25rem)", color: "hsl(40 70% 94%)" }}
            >
              {quotes[current].text}
            </p>

            <p
              className="font-sans mt-3"
              style={{ fontSize: "0.78rem", color: "hsl(26 60% 70%)", letterSpacing: "0.04em" }}
            >
              — Srila Prabhupada · {quotes[current].context}
            </p>
          </div>

          {/* Dot / arrow navigation */}
          <div className="flex items-center gap-3 mt-5">
            <button
              onClick={() => goTo(current - 1)}
              className="rounded-full p-1.5 transition-colors"
              style={{ background: "hsl(40 70% 94% / 0.12)" }}
              aria-label="Previous quote"
            >
              <ChevronLeft className="w-4 h-4" style={{ color: "hsl(40 70% 90%)" }} />
            </button>

            <div className="flex gap-1.5 flex-1 justify-center">
              {quotes.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className="rounded-full transition-all"
                  style={{
                    width: i === current ? 20 : 7,
                    height: 7,
                    background: i === current ? "hsl(26 68% 52%)" : "hsl(40 70% 94% / 0.35)",
                  }}
                  aria-label={`Quote ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => goTo(current + 1)}
              className="rounded-full p-1.5 transition-colors"
              style={{ background: "hsl(40 70% 94% / 0.12)" }}
              aria-label="Next quote"
            >
              <ChevronRight className="w-4 h-4" style={{ color: "hsl(40 70% 90%)" }} />
            </button>
          </div>
        </div>

        {/* Bottom buttons */}
        <div className="px-6 pt-5 pb-10 flex gap-2 flex-wrap">
          <Link
            href="/purposes"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-sans font-semibold border transition-colors focus:outline-none"
            style={{
              borderColor: "hsl(40 70% 90% / 0.4)",
              color: "hsl(40 80% 96%)",
              background: "hsl(40 70% 94% / 0.12)",
              fontSize: "0.85rem",
            }}
          >
            <BookOpen className="w-4 h-4" />
            What?
          </Link>
          <Link
            href="/why"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-sans font-semibold border transition-colors focus:outline-none"
            style={{
              borderColor: "hsl(40 70% 90% / 0.4)",
              color: "hsl(40 80% 96%)",
              background: "hsl(40 70% 94% / 0.12)",
              fontSize: "0.85rem",
            }}
          >
            <HelpCircle className="w-4 h-4" />
            Why?
          </Link>
          <Link
            href="/when"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-sans font-semibold border transition-colors focus:outline-none"
            style={{
              borderColor: "hsl(40 70% 90% / 0.4)",
              color: "hsl(40 80% 96%)",
              background: "hsl(40 70% 94% / 0.12)",
              fontSize: "0.85rem",
            }}
          >
            <Clock className="w-4 h-4" />
            When?
          </Link>
        </div>
      </div>
    </div>
  );
}
