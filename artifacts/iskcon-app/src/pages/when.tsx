import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function When() {
  return (
    <div className="min-h-[100dvh] bg-background pb-16">
      {/* Header */}
      <div
        className="px-5 pt-10 pb-8 relative"
        style={{ background: "linear-gradient(110deg, hsl(40 58% 84%) 0%, hsl(37 50% 80%) 100%)" }}
      >
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-sans mb-6 opacity-70 hover:opacity-100 transition-opacity"
          style={{ color: "hsl(14 72% 18%)" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <h1 className="font-serif font-bold" style={{ fontSize: "2.2rem", color: "hsl(14 72% 18%)" }}>
          When to apply?
        </h1>
        <p className="font-sans mt-2 leading-relaxed" style={{ color: "hsl(14 55% 28%)", fontSize: "0.95rem" }}>
          Moments and rhythms for living the 7 Purposes
        </p>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-6 py-8 space-y-6">
        <p className="font-serif text-foreground leading-relaxed text-lg">
          The 7 Purposes are not reserved for special occasions — they are meant to permeate every dimension of daily life, from the first moments of the morning to the conversations we share in the evening.
        </p>

        <div className="space-y-4">
          {[
            { time: "Morning", desc: "Begin with simple living — rise early, take prasadam, chant or read before the day's demands take over." },
            { time: "At work or study", desc: "Apply the purposes of learning and applying — bring spiritual inquiry into everything you do." },
            { time: "With others", desc: "Every gathering is an opportunity for community and sharing — offer what you know with warmth and humility." },
            { time: "In your home", desc: "Make your home a holy place — a space of peace, beauty, and remembrance of Krishna." },
            { time: "In the community", desc: "Festivals, study circles, service projects — regular rhythms that make the purposes visible and alive." },
          ].map(({ time, desc }) => (
            <div
              key={time}
              className="flex gap-4 items-start"
            >
              <div
                className="shrink-0 mt-1 px-3 py-0.5 rounded-full font-sans font-semibold text-xs"
                style={{ background: "hsl(26 68% 42% / 0.15)", color: "hsl(26 68% 35%)" }}
              >
                {time}
              </div>
              <p className="font-sans text-muted-foreground leading-relaxed text-sm">{desc}</p>
            </div>
          ))}
        </div>

        <div
          className="border-l-4 pl-5 py-2 font-serif italic text-foreground/80 leading-relaxed"
          style={{ borderColor: "hsl(26 68% 42%)" }}
        >
          "One who is not disturbed in mind even amidst the threefold miseries or elated when there is happiness, and who is free from attachment, fear and anger, is called a sage of steady mind."
          <span className="block mt-2 not-italic font-sans text-sm text-muted-foreground">— Bhagavad-gītā 2.56</span>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 mt-4 px-6 py-3 rounded-full font-sans font-semibold text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
          style={{ background: "hsl(26 68% 42%)", color: "hsl(40 80% 96%)" }}
        >
          Explore the 7 Purposes
        </Link>
      </div>
    </div>
  );
}
