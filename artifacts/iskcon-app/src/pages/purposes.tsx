import { Link } from "wouter";
import { ChevronRight, ArrowLeft } from "lucide-react";
import logoSimpleLiving from "@assets/7p_LogoNoTitle_SimpleLiving_1774931916885.png";
import logoCommunity from "@assets/7p_LogoNoTitle_Community_1774931916884.png";
import logoHolyPlace from "@assets/7p_LogoNoTitle_HolyPlace_1774931916884.png";
import logoAccessing from "@assets/7p_LogoNoTitle_Accessing_1774931916882.png";
import logoLearning from "@assets/7p_LogoNoTitle_Learning_1774931916883.png";
import logoApplying from "@assets/7p_LogoNoTitle_Applying_1774931916883.png";
import logoSharing from "@assets/7p_LogoNoTitle_Sharing_1774931916884.png";

const purposes = [
  { id: 1, title: "Accessing",     shortDescription: "Open the doors to spiritual knowledge for everyone.",         logo: logoAccessing },
  { id: 2, title: "Learning",      shortDescription: "Deepen understanding through study and devotional hearing.",  logo: logoLearning },
  { id: 3, title: "Community",     shortDescription: "Build a loving spiritual family on the path together.",      logo: logoCommunity },
  { id: 4, title: "Applying",      shortDescription: "Put spiritual principles into practice in daily life.",      logo: logoApplying },
  { id: 5, title: "Holy Place",    shortDescription: "Create and maintain sacred spaces for transcendence.",      logo: logoHolyPlace },
  { id: 6, title: "Simple Living", shortDescription: "Embrace a natural way of life rooted in spiritual values.", logo: logoSimpleLiving },
  { id: 7, title: "Sharing",       shortDescription: "Spread Krishna consciousness with open hands and heart.",    logo: logoSharing },
];

export default function Purposes() {
  return (
    <div className="min-h-[100dvh] bg-background pb-20">

      {/* Header */}
      <div
        className="px-5 pt-8 pb-6"
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
        <h1 className="font-serif font-bold" style={{ fontSize: "2rem", color: "hsl(14 72% 18%)" }}>
          The 7 Purposes
        </h1>
        <div
          className="inline-block mt-2 px-4 py-1 rounded-full font-serif italic font-semibold"
          style={{ background: "hsl(26 68% 42%)", color: "hsl(40 80% 96%)", fontSize: "0.9rem" }}
        >
          &amp; Community Building
        </div>
      </div>

      {/* List */}
      <div className="max-w-lg mx-auto px-5 mt-4">
        <ul className="divide-y divide-border/50">
          {purposes.map((purpose) => (
            <li key={purpose.id}>
              <Link
                href={`/purpose/${purpose.id}`}
                className="flex items-center gap-4 py-4 group focus:outline-none"
              >
                <img
                  src={purpose.logo}
                  alt={purpose.title}
                  className="shrink-0 object-contain"
                  style={{ width: 60, height: 60 }}
                />
                <div className="flex-1 min-w-0">
                  <h2 className="font-serif text-xl font-semibold text-foreground leading-tight">
                    {purpose.title}
                  </h2>
                  <p className="text-muted-foreground text-sm leading-snug mt-0.5 font-sans line-clamp-1">
                    {purpose.shortDescription}
                  </p>
                </div>
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
