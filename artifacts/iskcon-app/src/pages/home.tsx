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
      <div
        className="flex w-full overflow-hidden"
        style={{ minHeight: 300, background: "hsl(40 56% 83%)" }}
      >
        {/* Left: text — same flex height as the image column */}
        <div
          className="flex flex-col justify-center px-6 py-8 shrink-0"
          style={{ width: "54%", background: "linear-gradient(to right, hsl(40 58% 84%) 85%, transparent 100%)" }}
        >
          <h1
            className="font-serif font-bold leading-tight"
            style={{ fontSize: "clamp(1.5rem, 5.5vw, 2.6rem)", color: "hsl(14 72% 18%)" }}
          >
            The 7 Purposes<br />of ISKCON
          </h1>

          <div
            className="inline-block mt-3 px-4 py-1.5 rounded-full font-serif italic font-semibold self-start"
            style={{ background: "hsl(26 68% 42%)", color: "hsl(40 80% 96%)", fontSize: "clamp(0.75rem, 2.5vw, 0.95rem)" }}
          >
            &amp; Community Building
          </div>

          <p
            className="font-sans mt-3 leading-snug"
            style={{ color: "hsl(14 55% 28%)", fontSize: "clamp(0.7rem, 2vw, 0.82rem)" }}
          >
            Applying ISKCON's purposes<br />in daily life &amp; community
          </p>

          {/* Why? button */}
          <Link
            href="/why"
            className="inline-flex items-center gap-1.5 mt-4 self-start px-4 py-2 rounded-full font-sans font-semibold border transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
            style={{
              borderColor: "hsl(14 72% 18% / 0.3)",
              color: "hsl(14 72% 18%)",
              background: "transparent",
              fontSize: "0.82rem",
            }}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Why?
          </Link>
        </div>

        {/* Right: photo — flush against the text column, fills remaining space */}
        <div className="relative flex-1 overflow-hidden">
          {/* Micro-blend at the seam only */}
          <div
            className="absolute inset-y-0 left-0 z-10"
            style={{ width: 32, background: "linear-gradient(to right, hsl(40 58% 84%), transparent)" }}
          />
          <img
            src={prabhupadaPhoto}
            alt="Srila Prabhupada"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 10%",
            }}
          />
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
