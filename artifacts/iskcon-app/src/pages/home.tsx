import { Link } from "wouter";
import { Leaf, Users, Building2, Globe, BookOpen, Lightbulb, Share2, ChevronRight } from "lucide-react";
import slideHeader from "@assets/Slide1_1774929889490.png";

const purposes = [
  {
    id: 1,
    title: "Simple Living",
    shortDescription: "Embrace a simpler, more natural way of life rooted in spiritual values.",
    icon: Leaf,
    iconBg: "bg-emerald-600",
    category: "Roots",
  },
  {
    id: 2,
    title: "Community",
    shortDescription: "Build a loving spiritual family that supports each other on the path.",
    icon: Users,
    iconBg: "bg-blue-700",
    category: "Roots",
  },
  {
    id: 3,
    title: "Holy Place",
    shortDescription: "Create and maintain sacred spaces for transcendental experience.",
    icon: Building2,
    iconBg: "bg-stone-600",
    category: "Roots",
  },
  {
    id: 4,
    title: "Accessing",
    shortDescription: "Open the doors to spiritual knowledge for everyone, everywhere.",
    icon: Globe,
    iconBg: "bg-amber-700",
    category: "Fruits",
  },
  {
    id: 5,
    title: "Learning",
    shortDescription: "Deepen understanding through study, inquiry, and devotional hearing.",
    icon: BookOpen,
    iconBg: "bg-amber-800",
    category: "Fruits",
  },
  {
    id: 6,
    title: "Applying",
    shortDescription: "Put spiritual principles into practice in every aspect of daily life.",
    icon: Lightbulb,
    iconBg: "bg-orange-700",
    category: "Fruits",
  },
  {
    id: 7,
    title: "Sharing",
    shortDescription: "Spread the nectar of Krishna consciousness with open hands and an open heart.",
    icon: Share2,
    iconBg: "bg-red-800",
    category: "Fruits",
  },
];

export default function Home() {
  return (
    <div className="min-h-[100dvh] bg-background pb-16 overflow-x-hidden relative z-10">

      {/* MOBILE HERO — slide image at natural scale (sharp, never upscaled) */}
      <div className="block sm:hidden w-full shadow-md border-b border-border/40">
        <img
          src={slideHeader}
          alt="The 7 Purposes of ISKCON & Community Building"
          className="w-full h-auto block"
          style={{ maxWidth: "100%", imageRendering: "auto" }}
        />
      </div>

      {/* DESKTOP HERO — crisp CSS-rendered header, no image upscaling */}
      <div
        className="hidden sm:flex items-center shadow-md border-b border-border/40"
        style={{
          background: "linear-gradient(105deg, hsl(40 58% 86%) 0%, hsl(37 50% 80%) 60%, hsl(33 42% 75%) 100%)",
          minHeight: 200,
        }}
      >
        <div className="px-10 py-10 max-w-xl">
          <h1 className="font-serif font-bold leading-tight" style={{ fontSize: "2.8rem", color: "hsl(14 72% 18%)" }}>
            The 7 Purposes<br />of ISKCON
          </h1>
          <div
            className="inline-block mt-3 mb-3 px-5 py-1.5 rounded-full font-serif italic font-semibold"
            style={{ background: "hsl(26 68% 42%)", color: "hsl(40 80% 96%)", fontSize: "1.05rem" }}
          >
            &amp; Community Building
          </div>
          <p className="font-sans" style={{ color: "hsl(14 55% 28%)", fontSize: "0.9rem", lineHeight: 1.5 }}>
            How to apply the 7 Purposes of ISKCON in our daily life &amp; in our community
          </p>
        </div>
      </div>

      {/* Intro divider */}
      <div className="px-5 pt-4 pb-1 max-w-lg mx-auto text-center">
        <div className="w-16 h-px bg-primary/30 mx-auto" />
      </div>

      {/* ROOTS section */}
      <div className="px-5 pt-5 pb-1 max-w-lg mx-auto">
        <div className="flex items-center gap-3">
          <span className="text-blue-700 font-serif text-xl italic font-semibold">Roots</span>
          <div className="flex-1 h-px bg-blue-300/50" />
        </div>
        <p className="text-muted-foreground text-xs mt-0.5 font-sans">The foundation of community life</p>
      </div>

      <div className="px-5 max-w-lg mx-auto space-y-3 mt-2">
        {purposes.slice(0, 3).map((purpose, i) => {
          const Icon = purpose.icon;
          return (
            <Link
              key={purpose.id}
              href={`/purpose/${purpose.id}`}
              data-testid={`purpose-card-${purpose.id}`}
              className="flex items-center gap-4 bg-card rounded-2xl p-4 shadow-sm border border-border/60 hover-elevate active:scale-[0.98] transition-transform animate-in fade-in slide-in-from-bottom-3 focus:outline-none focus:ring-2 focus:ring-primary/40"
              style={{ animationDelay: `${i * 80}ms`, animationFillMode: "both" }}
            >
              <div className={`${purpose.iconBg} w-14 h-14 rounded-full flex items-center justify-center text-white shrink-0 shadow ring-2 ring-white/20`}>
                <Icon className="w-7 h-7" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-primary font-bold text-sm font-sans">{purpose.id}.</span>
                  <h2 className="font-serif text-xl font-bold text-foreground leading-tight">{purpose.title}</h2>
                </div>
                <p className="text-muted-foreground text-sm leading-snug mt-0.5 line-clamp-2 font-sans">{purpose.shortDescription}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-primary/50 shrink-0" />
            </Link>
          );
        })}
      </div>

      {/* FRUITS section */}
      <div className="px-5 pt-6 pb-1 max-w-lg mx-auto">
        <div className="flex items-center gap-3">
          <span className="text-primary font-serif text-xl italic font-semibold">Fruits</span>
          <div className="flex-1 h-px bg-primary/30" />
        </div>
        <p className="text-muted-foreground text-xs mt-0.5 font-sans">Growing through practice and service</p>
      </div>

      <div className="px-5 max-w-lg mx-auto space-y-3 mt-2">
        {purposes.slice(3).map((purpose, i) => {
          const Icon = purpose.icon;
          return (
            <Link
              key={purpose.id}
              href={`/purpose/${purpose.id}`}
              data-testid={`purpose-card-${purpose.id}`}
              className="flex items-center gap-4 bg-card rounded-2xl p-4 shadow-sm border border-border/60 hover-elevate active:scale-[0.98] transition-transform animate-in fade-in slide-in-from-bottom-3 focus:outline-none focus:ring-2 focus:ring-primary/40"
              style={{ animationDelay: `${(i + 3) * 80}ms`, animationFillMode: "both" }}
            >
              <div className={`${purpose.iconBg} w-14 h-14 rounded-full flex items-center justify-center text-white shrink-0 shadow ring-2 ring-white/20`}>
                <Icon className="w-7 h-7" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-primary font-bold text-sm font-sans">{purpose.id}.</span>
                  <h2 className="font-serif text-xl font-bold text-foreground leading-tight">{purpose.title}</h2>
                </div>
                <p className="text-muted-foreground text-sm leading-snug mt-0.5 line-clamp-2 font-sans">{purpose.shortDescription}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-primary/50 shrink-0" />
            </Link>
          );
        })}
      </div>

      {/* Footer quote */}
      <div className="mt-10 px-6 max-w-lg mx-auto text-center">
        <p className="font-serif text-foreground/50 text-sm italic">
          "Big fruits only grow from strong roots"
        </p>
      </div>
    </div>
  );
}
