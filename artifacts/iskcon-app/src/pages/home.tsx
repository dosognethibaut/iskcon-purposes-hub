import { Link } from "wouter";
import { ChevronRight, HelpCircle } from "lucide-react";
import prabhupadaPhoto from "@assets/image_1774931191461.png";
import logoSimpleLiving from "@assets/7p_SimpleLiving3_1774930486395.png";
import logoCommunity from "@assets/7p_Community3.png_1774930486395.png";
import logoHolyPlace from "@assets/7p_HolyPlace3_1774930486395.png";
import logoAccessing from "@assets/7p_Accessing3_1774930527997.png";
import logoLearning from "@assets/7p_Learning3_1774930527997.png";
import logoApplying from "@assets/7p_Applying3_1774930527997.png";
import logoSharing from "@assets/7p_Sharing3_1774930527996.png";

const purposes = [
  { id: 1, title: "Accessing",    shortDescription: "Open the doors to spiritual knowledge for everyone.",          logo: logoAccessing },
  { id: 2, title: "Learning",     shortDescription: "Deepen understanding through study and devotional hearing.",   logo: logoLearning },
  { id: 3, title: "Community",    shortDescription: "Build a loving spiritual family on the path together.",       logo: logoCommunity },
  { id: 4, title: "Applying",     shortDescription: "Put spiritual principles into practice in daily life.",       logo: logoApplying },
  { id: 5, title: "Holy Place",   shortDescription: "Create and maintain sacred spaces for transcendence.",       logo: logoHolyPlace },
  { id: 6, title: "Simple Living",shortDescription: "Embrace a natural way of life rooted in spiritual values.",  logo: logoSimpleLiving },
  { id: 7, title: "Sharing",      shortDescription: "Spread Krishna consciousness with open hands and heart.",     logo: logoSharing },
];

export default function Home() {
  return (
    <div className="min-h-[100dvh] bg-background pb-20">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <div className="relative w-full overflow-hidden" style={{ minHeight: 320 }}>

        {/* Parchment base */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(110deg, hsl(40 58% 84%) 0%, hsl(38 50% 79%) 50%, hsl(35 44% 72%) 100%)" }}
        />

        {/* Prabhupada photo — right-aligned, fade to left */}
        <div className="absolute top-0 right-0 bottom-0" style={{ width: "55%" }}>
          <img
            src={prabhupadaPhoto}
            alt="Srila Prabhupada"
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              height: "115%",
              width: "auto",
              objectFit: "cover",
              objectPosition: "top center",
            }}
          />
          {/* Fade left edge into parchment */}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to right, hsl(40 58% 84%) 0%, hsl(40 58% 84% / 0.6) 25%, transparent 65%)" }}
          />
        </div>

        {/* Text content */}
        <div className="relative z-10 px-6 pt-10 pb-8" style={{ maxWidth: "62%" }}>
          <h1
            className="font-serif font-bold leading-tight"
            style={{ fontSize: "clamp(1.75rem, 6vw, 3rem)", color: "hsl(14 72% 18%)" }}
          >
            The 7 Purposes<br />of ISKCON
          </h1>

          <div
            className="inline-block mt-3 px-4 py-1.5 rounded-full font-serif italic font-semibold"
            style={{ background: "hsl(26 68% 42%)", color: "hsl(40 80% 96%)", fontSize: "clamp(0.8rem, 2.5vw, 1rem)" }}
          >
            &amp; Community Building
          </div>

          <p
            className="font-sans mt-3 leading-snug"
            style={{ color: "hsl(14 55% 28%)", fontSize: "clamp(0.72rem, 2vw, 0.85rem)" }}
          >
            Applying ISKCON's purposes<br />in daily life &amp; community
          </p>

          {/* Why? button */}
          <Link
            href="/why"
            className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-full font-sans font-semibold text-sm border transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
            style={{
              borderColor: "hsl(14 72% 18% / 0.35)",
              color: "hsl(14 72% 18%)",
              background: "hsl(40 58% 84% / 0.6)",
              fontSize: "0.85rem",
            }}
          >
            <HelpCircle className="w-4 h-4" />
            Why?
          </Link>
        </div>
      </div>

      {/* ── PURPOSE LIST ─────────────────────────────────────────── */}
      <div className="max-w-lg mx-auto px-5 mt-6">
        <ul className="divide-y divide-border/50">
          {purposes.map((purpose) => (
            <li key={purpose.id}>
              <Link
                href={`/purpose/${purpose.id}`}
                className="flex items-center gap-4 py-3.5 group focus:outline-none"
              >
                {/* Logo */}
                <img
                  src={purpose.logo}
                  alt={purpose.title}
                  className="w-12 h-12 rounded-full shrink-0 object-cover"
                  style={{ boxShadow: "0 1px 4px hsl(14 72% 18% / 0.12)" }}
                />

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <h2 className="font-serif text-lg font-semibold text-foreground leading-tight">
                    {purpose.title}
                  </h2>
                  <p className="text-muted-foreground text-sm leading-snug mt-0.5 font-sans line-clamp-1">
                    {purpose.shortDescription}
                  </p>
                </div>

                {/* Arrow */}
                <ChevronRight
                  className="w-5 h-5 shrink-0 transition-transform group-hover:translate-x-0.5"
                  style={{ color: "hsl(26 68% 42% / 0.6)" }}
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer quote */}
      <div className="mt-8 px-6 max-w-lg mx-auto text-center">
        <p className="font-serif text-foreground/40 text-sm italic">
          "Big fruits only grow from strong roots"
        </p>
      </div>
    </div>
  );
}
