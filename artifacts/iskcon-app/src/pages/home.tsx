import { useState, useEffect } from "react";
import { Link } from "wouter";
import { HelpCircle, Clock, ChevronLeft, ChevronRight, ChevronDown, UserCircle } from "lucide-react";
import prabhupadaPhoto from "@assets/image_1774931191461.png";
import radhadeshLogo from "@assets/image_1774938925316.png";
import sevenPLogo from "@assets/7p_Colours_1774938784527.png";
import logoSimpleLiving from "@assets/7p_LogoNoTitle_SimpleLiving_1774931916885.png";
import logoCommunity from "@assets/7p_LogoNoTitle_Community_1774931916884.png";
import logoHolyPlace from "@assets/7p_LogoNoTitle_HolyPlace_1774931916884.png";
import logoAccessing from "@assets/7p_LogoNoTitle_Accessing_1774931916882.png";
import logoLearning from "@assets/7p_LogoNoTitle_Learning_1774931916883.png";
import logoApplying from "@assets/7p_LogoNoTitle_Applying_1774931916883.png";
import logoSharing from "@assets/7p_LogoNoTitle_Sharing_1774931916884.png";

const quotes = [
  {
    text: "The Krishna consciousness movement is meant to teach people how to love God. This is the sum and substance of all our purposes.",
    context: "On ISKCON's essence",
    ref: "Srila Prabhupada · Letter to Hamsaduta, 1969",
    vanipedia: "https://vanipedia.org/wiki/The_Purpose_of_ISKCON",
  },
  {
    text: "Simple living and high thinking is the solution to economic problems. We only need to produce food and live peacefully.",
    context: "On Simple Living",
    ref: "Srila Prabhupada · Lecture, Los Angeles, 1970",
    vanipedia: "https://vanipedia.org/wiki/Simple_Living_High_Thinking",
  },
  {
    text: "We want to create a community of devotees who live together, work together, and worship together. This is the ideal of Krishna consciousness.",
    context: "On Community",
    ref: "Srila Prabhupada · Letter to Kirtanananda, 1968",
    vanipedia: "https://vanipedia.org/wiki/Community",
  },
  {
    text: "Every town and every village should have a temple where people can come to learn the science of God. This is our mission.",
    context: "On Holy Place",
    ref: "Srila Prabhupada · Bhāgavatam lecture, 1972",
    vanipedia: "https://vanipedia.org/wiki/Temple",
  },
  {
    text: "We are distributing this knowledge freely. Anyone who reads our books, who hears our philosophy, will be benefited.",
    context: "On Accessing",
    ref: "Srila Prabhupada · Press interview, 1975",
    vanipedia: "https://vanipedia.org/wiki/Book_Distribution",
  },
  {
    text: "You must learn the Bhagavad-gītā thoroughly. This is not ordinary knowledge — it is transcendental knowledge that liberates the soul.",
    context: "On Learning",
    ref: "Srila Prabhupada · Introduction to Bhagavad-gītā As It Is",
    vanipedia: "https://vanipedia.org/wiki/Bhagavad-gita_As_It_Is",
  },
  {
    text: "Whatever you do, do it for Krishna. When everything is applied in Krishna's service, that is perfection.",
    context: "On Applying",
    ref: "Srila Prabhupada · Lecture on BG 9.27, New York, 1966",
    vanipedia: "https://vanipedia.org/wiki/Everything_for_Krishna",
  },
  {
    text: "Go and preach. The greatest act of compassion is to share Krishna consciousness with those who are suffering in ignorance.",
    context: "On Sharing",
    ref: "Srila Prabhupada · Śrīmad-Bhāgavatam lecture, 1974",
    vanipedia: "https://vanipedia.org/wiki/Preaching_is_the_Essence",
  },
];

const purposes = [
  { id: 4, title: "Accessing",     shortDescription: "Open the doors to spiritual knowledge for everyone.",        logo: logoAccessing },
  { id: 5, title: "Learning",      shortDescription: "Deepen understanding through study and devotional hearing.", logo: logoLearning },
  { id: 2, title: "Community",     shortDescription: "Build a loving spiritual family on the path together.",      logo: logoCommunity },
  { id: 6, title: "Applying",      shortDescription: "Put spiritual principles into practice in daily life.",      logo: logoApplying },
  { id: 3, title: "Holy Place",    shortDescription: "Create and maintain sacred spaces for transcendence.",      logo: logoHolyPlace },
  { id: 1, title: "Simple Living", shortDescription: "Embrace a natural way of life rooted in spiritual values.", logo: logoSimpleLiving },
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
    const timer = setInterval(() => goTo(current + 1), 7000);
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

        {/* Radhadesh logo */}
        <a
          href="https://www.radhadesh.com"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-3 right-3 z-20 rounded-lg overflow-hidden"
          style={{ boxShadow: "0 1px 8px hsl(14 35% 6% / 0.5)" }}
        >
          <img
            src={radhadeshLogo}
            alt="Domaine de Radhadesh"
            style={{ height: 38, width: "auto", display: "block" }}
          />
        </a>

        {/* Content layer */}
        <div className="relative z-10 flex flex-col h-full">

          {/* Title */}
          <div className="px-6 pt-10">
            <h1 className="font-serif font-bold" style={{ fontSize: "clamp(1.6rem, 6vw, 2.8rem)", color: "hsl(40 80% 94%)", lineHeight: 0.95 }}>
              The{" "}
              <img
                src={sevenPLogo}
                alt="7"
                style={{ height: "1.5em", width: "auto", display: "inline-block", verticalAlign: "middle", mixBlendMode: "screen", marginBottom: "0.12em" }}
              />{" "}Purposes<br />of ISKCON
            </h1>
            <div
              className="inline-block mt-2 px-4 py-1 rounded-full font-serif italic font-semibold"
              style={{ background: "hsl(26 68% 42%)", color: "hsl(40 80% 96%)", fontSize: "clamp(0.75rem, 2.5vw, 0.9rem)" }}
            >
              &amp; Community Building
            </div>
            <div className="mt-3">
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-sans font-semibold border focus:outline-none"
                style={{ borderColor: "hsl(40 70% 90% / 0.4)", color: "hsl(40 80% 96%)", background: "hsl(40 70% 94% / 0.12)", fontSize: "0.85rem" }}
              >
                <UserCircle className="w-4 h-4" /> You
              </Link>
            </div>
          </div>

          <div className="flex-1" />

          {/* Quote */}
          <div className="px-6 pb-2">
            <a
              href={quotes[current].vanipedia}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
              style={{ opacity: fading ? 0 : 1, transform: fading ? "translateY(6px)" : "translateY(0)", transition: "opacity 0.3s ease, transform 0.3s ease", textDecoration: "none" }}
            >
              <div className="font-serif font-bold mb-1" style={{ fontSize: "3rem", color: "hsl(26 68% 52% / 0.7)", lineHeight: 1 }}>"</div>
              <p className="font-serif italic leading-relaxed" style={{ fontSize: "clamp(1rem, 3.5vw, 1.2rem)", color: "hsl(40 70% 94%)" }}>
                {quotes[current].text}
              </p>
              <p className="font-sans mt-2" style={{ fontSize: "0.72rem", color: "hsl(26 60% 70%)", letterSpacing: "0.04em" }}>
                {quotes[current].ref}
              </p>
            </a>

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
          <div className="px-6 pt-4 pb-5 flex gap-2 flex-wrap">
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
        {/* Subtle spacer */}
        <div className="pt-8" />

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
