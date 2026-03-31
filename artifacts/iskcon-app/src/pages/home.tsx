import { useState, useEffect } from "react";
import { Link } from "wouter";
import { HelpCircle, Clock, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import prabhupadaPhoto from "@assets/image_1774931191461.png";
import logoSimpleLiving from "@assets/7p_LogoNoTitle_SimpleLiving_1774931916885.png";
import logoCommunity from "@assets/7p_LogoNoTitle_Community_1774931916884.png";
import logoHolyPlace from "@assets/7p_LogoNoTitle_HolyPlace_1774931916884.png";
import logoAccessing from "@assets/7p_LogoNoTitle_Accessing_1774931916882.png";
import logoLearning from "@assets/7p_LogoNoTitle_Learning_1774931916883.png";
import logoApplying from "@assets/7p_LogoNoTitle_Applying_1774931916883.png";
import logoSharing from "@assets/7p_LogoNoTitle_Sharing_1774931916884.png";

const quotes = [
  { text: "The Krishna consciousness movement is meant to teach people how to love God. This is the sum and substance of all our purposes.", context: "On ISKCON's essence" },
  { text: "Simple living and high thinking is the solution to economic problems. We only need to produce food and live peacefully.", context: "On Simple Living" },
  { text: "We want to create a community of devotees who live together, work together, and worship together. This is the ideal of Krishna consciousness.", context: "On Community" },
  { text: "Every town and every village should have a temple where people can come to learn the science of God. This is our mission.", context: "On Holy Place" },
  { text: "We are distributing this knowledge freely. Anyone who reads our books, who hears our philosophy, will be benefited.", context: "On Accessing" },
  { text: "You must learn the Bhagavad-gītā thoroughly. This is not ordinary knowledge — it is transcendental knowledge that liberates the soul.", context: "On Learning" },
  { text: "Whatever you do, do it for Krishna. When everything is applied in Krishna's service, that is perfection.", context: "On Applying" },
  { text: "Go and preach. The greatest act of compassion is to share Krishna consciousness with those who are suffering in ignorance.", context: "On Sharing" },
];

const purposes = [
  { id: 1, title: "Accessing",     shortDescription: "Open the doors to spiritual knowledge for everyone.",         logo: logoAccessing },
  { id: 2, title: "Learning",      shortDescription: "Deepen understanding through study and devotional hearing.",  logo: logoLearning },
  { id: 3, title: "Community",     shortDescription: "Build a loving spiritual family on the path together.",      logo: logoCommunity },
  { id: 4, title: "Applying",      shortDescription: "Put spiritual principles into practice in daily life.",      logo: logoApplying },
  { id: 5, title: "Holy Place",    shortDescription: "Create and maintain sacred spaces for transcendence.",      logo: logoHolyPlace },
  { id: 6, title: "Simple Living", shortDescription: "Embrace a natural way of life rooted in spiritual values.", logo: logoSimpleLiving },
  { id: 7, title: "Sharing",       shortDescription: "Spread Krishna consciousness with open hands and heart.",    logo: logoSharing },
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
    <div className="bg-background">

      {/* ═══════════════════════════════════════════════════════════
          HERO — exactly one screen tall
      ═══════════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden" style={{ height: "100dvh" }}>

        {/* Photo */}
        <img
          src={prabhupadaPhoto}
          alt="Srila Prabhupada"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "60% 8%" }}
        />

        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: [
              "linear-gradient(to bottom, hsl(14 35% 10% / 0.5) 0%, transparent 30%, transparent 45%, hsl(14 35% 10% / 0.88) 100%)",
              "linear-gradient(to right, hsl(14 35% 10% / 0.15) 0%, transparent 55%)",
            ].join(", "),
          }}
        />

        {/* Radhadesh badge — top right */}
        <a
          href="https://www.radhadesh.com"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-sm"
          style={{ background: "hsl(14 35% 10% / 0.45)", border: "1px solid hsl(40 70% 90% / 0.25)" }}
        >
          <span className="font-serif font-semibold" style={{ color: "hsl(40 80% 94%)", fontSize: "0.78rem", letterSpacing: "0.02em" }}>
            Radhadesh
          </span>
        </a>

        {/* Content layer */}
        <div className="relative z-10 flex flex-col h-full">

          {/* Title */}
          <div className="px-6 pt-10">
            <h1 className="font-serif font-bold leading-tight" style={{ fontSize: "clamp(1.6rem, 6vw, 2.8rem)", color: "hsl(40 80% 94%)" }}>
              The 7 Purposes<br />of ISKCON
            </h1>
            <div
              className="inline-block mt-2 px-4 py-1 rounded-full font-serif italic font-semibold"
              style={{ background: "hsl(26 68% 42%)", color: "hsl(40 80% 96%)", fontSize: "clamp(0.75rem, 2.5vw, 0.9rem)" }}
            >
              &amp; Community Building
            </div>
          </div>

          <div className="flex-1" />

          {/* Quote */}
          <div className="px-6 pb-2">
            <div style={{ opacity: fading ? 0 : 1, transform: fading ? "translateY(6px)" : "translateY(0)", transition: "opacity 0.3s ease, transform 0.3s ease" }}>
              <div className="font-serif font-bold mb-1" style={{ fontSize: "3rem", color: "hsl(26 68% 52% / 0.7)", lineHeight: 1 }}>"</div>
              <p className="font-serif italic leading-relaxed" style={{ fontSize: "clamp(1rem, 3.5vw, 1.2rem)", color: "hsl(40 70% 94%)" }}>
                {quotes[current].text}
              </p>
              <p className="font-sans mt-2" style={{ fontSize: "0.75rem", color: "hsl(26 60% 70%)", letterSpacing: "0.04em" }}>
                — Srila Prabhupada · {quotes[current].context}
              </p>
            </div>

            {/* Dot nav */}
            <div className="flex items-center gap-3 mt-4">
              <button onClick={() => goTo(current - 1)} className="rounded-full p-1.5" style={{ background: "hsl(40 70% 94% / 0.12)" }} aria-label="Previous">
                <ChevronLeft className="w-4 h-4" style={{ color: "hsl(40 70% 90%)" }} />
              </button>
              <div className="flex gap-1.5 flex-1 justify-center">
                {quotes.map((_, i) => (
                  <button key={i} onClick={() => goTo(i)} className="rounded-full transition-all" style={{ width: i === current ? 20 : 7, height: 7, background: i === current ? "hsl(26 68% 52%)" : "hsl(40 70% 94% / 0.35)" }} aria-label={`Quote ${i + 1}`} />
                ))}
              </div>
              <button onClick={() => goTo(current + 1)} className="rounded-full p-1.5" style={{ background: "hsl(40 70% 94% / 0.12)" }} aria-label="Next">
                <ChevronRight className="w-4 h-4" style={{ color: "hsl(40 70% 90%)" }} />
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="px-6 pt-4 pb-5 flex gap-2">
            <Link href="/why" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-sans font-semibold border focus:outline-none" style={{ borderColor: "hsl(40 70% 90% / 0.4)", color: "hsl(40 80% 96%)", background: "hsl(40 70% 94% / 0.12)", fontSize: "0.85rem" }}>
              <HelpCircle className="w-4 h-4" /> Why?
            </Link>
            <Link href="/when" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-sans font-semibold border focus:outline-none" style={{ borderColor: "hsl(40 70% 90% / 0.4)", color: "hsl(40 80% 96%)", background: "hsl(40 70% 94% / 0.12)", fontSize: "0.85rem" }}>
              <Clock className="w-4 h-4" /> When?
            </Link>
          </div>

          {/* Scroll hint */}
          <div className="pb-4 flex justify-center animate-bounce">
            <ChevronDown className="w-5 h-5" style={{ color: "hsl(40 70% 90% / 0.5)" }} />
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          WHAT — 7 Purposes list, revealed on scroll
      ═══════════════════════════════════════════════════════════ */}
      <div className="pb-20">
        {/* Section label */}
        <div className="px-5 pt-8 pb-4 max-w-lg mx-auto flex items-center gap-3">
          <span className="font-serif text-xl italic font-semibold" style={{ color: "hsl(14 72% 18%)" }}>What?</span>
          <div className="flex-1 h-px" style={{ background: "hsl(14 72% 18% / 0.15)" }} />
          <span className="font-sans text-xs" style={{ color: "hsl(14 55% 38%)" }}>The 7 Purposes</span>
        </div>

        <div className="max-w-lg mx-auto px-5">
          <ul className="divide-y divide-border/50">
            {purposes.map((purpose) => (
              <li key={purpose.id}>
                <Link href={`/purpose/${purpose.id}`} className="flex items-center gap-4 py-4 group focus:outline-none">
                  <img src={purpose.logo} alt={purpose.title} className="shrink-0 object-contain" style={{ width: 60, height: 60 }} />
                  <div className="flex-1 min-w-0">
                    <h2 className="font-serif text-xl font-semibold text-foreground leading-tight">{purpose.title}</h2>
                    <p className="text-muted-foreground text-sm leading-snug mt-0.5 font-sans line-clamp-1">{purpose.shortDescription}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 shrink-0 transition-transform group-hover:translate-x-0.5" style={{ color: "hsl(26 68% 42% / 0.6)" }} />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 px-6 max-w-lg mx-auto text-center">
          <p className="font-serif text-foreground/40 text-sm italic">"Big fruits only grow from strong roots"</p>
        </div>
      </div>
    </div>
  );
}
