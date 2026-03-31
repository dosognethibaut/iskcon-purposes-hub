import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function Why() {
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
          Why 7 Purposes?
        </h1>
        <p className="font-sans mt-2 leading-relaxed" style={{ color: "hsl(14 55% 28%)", fontSize: "0.95rem" }}>
          The vision behind ISKCON's founding principles
        </p>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-6 py-8 space-y-6">
        <p className="font-serif text-foreground leading-relaxed text-lg">
          In 1966, Srila Prabhupada founded the International Society for Krishna Consciousness with seven stated purposes — a roadmap for how a spiritual community could serve both its members and the wider world.
        </p>

        <p className="font-sans text-muted-foreground leading-relaxed">
          These purposes are not just institutional goals. They describe a complete way of life: how we access spiritual knowledge, how we learn and apply it, how we build community, how we create sacred spaces, how we live simply, and how we share what we have found.
        </p>

        <div
          className="border-l-4 pl-5 py-2 font-serif italic text-foreground/80 leading-relaxed"
          style={{ borderColor: "hsl(26 68% 42%)" }}
        >
          "The Krishna consciousness movement is not a manufactured thing. It is authorised by Vedic scriptures and by the great ācāryas... The purpose is to serve mankind in the highest capacity."
          <span className="block mt-2 not-italic font-sans text-sm text-muted-foreground">— Srila Prabhupada</span>
        </div>

        <p className="font-sans text-muted-foreground leading-relaxed">
          This app explores how each of the 7 purposes can be lived and practiced in our daily lives and within our local communities — turning principles into action.
        </p>

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
