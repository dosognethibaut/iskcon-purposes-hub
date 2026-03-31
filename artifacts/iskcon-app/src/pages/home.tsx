import { useState, useEffect } from "react";
import { Link } from "wouter";
import PurposePanel from "./PurposePanel";
import { HelpCircle, Clock, ChevronLeft, ChevronRight, ChevronDown, UserCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import prabhupadaPhoto from "@assets/image_1774931191461.png";
import radhadeshLogo from "@assets/image_1774938925316.png";
import sevenPLogo from "@assets/7p_Colours_1774938784527.png";
import logoSimpleLiving from "@assets/7p_SimpleLiving3_1774940060432.png";
import logoCommunity    from "@assets/7p_Community3.png_1774940060432.png";
import logoHolyPlace    from "@assets/7p_HolyPlace3_1774940060432.png";
import logoAccessing    from "@assets/7p_Accessing3_1774940060433.png";
import logoLearning     from "@assets/7p_Learning3_1774940060433.png";
import logoApplying     from "@assets/7p_Applying3_1774940060433.png";
import logoSharing      from "@assets/7p_Sharing3_1774940060433.png";

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
  {
    id: 4, title: "Accessing", logo: logoAccessing,
    officialText: "To systematically propagate spiritual knowledge to society at large and to educate all peoples in the techniques of spiritual life in order to check the imbalance of values in life and to achieve real unity and peace in the world.",
    description: "ISKCON is committed to making the eternal wisdom of the Vedas accessible to all people, regardless of background or belief. Through books, digital media, educational programs, and personal outreach, we provide everyone the opportunity to encounter the teachings of the Bhagavad-gita and Srimad-Bhagavatam. Accessing is the first step on the path of spiritual awakening.",
  },
  {
    id: 5, title: "Learning", logo: logoLearning,
    officialText: "To propagate a consciousness of Krishna as it is revealed in the Bhagavad-gita and Srimad-Bhagavatam.",
    description: "Study and hearing are at the heart of spiritual progress. ISKCON encourages every devotee to deepen their understanding through regular reading of sacred texts, attending classes, and listening to lectures by qualified teachers. Learning transforms information into wisdom, and wisdom into liberation.",
  },
  {
    id: 2, title: "Community", logo: logoCommunity,
    officialText: "To bring the members of the Society together with each other and nearer to Krishna, the prime entity, and thus to develop the idea within the members, and humanity at large, that each soul is part and parcel of the quality of Godhead (Krishna).",
    description: "Community is at the heart of ISKCON life. We are called to create environments where devotees encourage one another, share the journey, and practice devotional service together. A strong community reflects the joy of unity in diversity, where every member feels welcomed, valued, and nourished.",
  },
  {
    id: 6, title: "Applying", logo: logoApplying,
    officialText: "To teach and encourage the sankirtan movement, congregational chanting of the holy names of God, as revealed in the teachings of Lord Sri Chaitanya Mahaprabhu.",
    description: "Spiritual knowledge has its full value only when applied. Through sankirtan, service, and daily practice, devotees bring Krishna consciousness into every aspect of life — work, family, and relationships. Applying the teachings is the bridge between hearing and transformation.",
  },
  {
    id: 3, title: "Holy Place", logo: logoHolyPlace,
    officialText: "To erect for the members and for society at large, a holy place of transcendental pastimes, dedicated to the personality of Krishna.",
    description: "ISKCON temples and centers are holy places where the divine presence of Krishna is felt. They are sanctuaries where devotees come to worship, hear and chant the holy names, take prasadam, and be spiritually uplifted. Every home of a devotee can also become a holy place — a small temple filled with love and remembrance of God.",
  },
  {
    id: 1, title: "Simple Living", logo: logoSimpleLiving,
    officialText: "To bring the members closer together for the purpose of teaching a simpler and more natural way of life.",
    description: "One of the foundations of ISKCON is the principle of simple living and high thinking. By choosing a lifestyle free from unnecessary complexity and consumption, we create space for spiritual growth. Simple living means caring for our basic needs without exploitation, living in harmony with nature, and dedicating our time to what truly matters: our relationship with Krishna.",
  },
  {
    id: 7, title: "Sharing", logo: logoSharing,
    officialText: "To, with a view towards achieving the aforementioned purposes, publish and distribute periodicals, magazines, books and other writings.",
    description: "The greatest act of compassion is to share Krishna consciousness with those who are searching. Through books, media, conversations, and outreach, every devotee becomes a messenger of hope. Sharing is not just an activity — it is an expression of love for all living beings.",
  },
];

export default function Home() {
  const { currentUser } = useAuth();
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);
  const [activePurpose, setActivePurpose] = useState<number | null>(null);

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

        {/* Radhadesh logo — top left */}
        <a
          href="https://www.radhadesh.com"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-3 left-3 z-20 rounded-lg overflow-hidden"
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

          {/* Title — right-aligned */}
          <div className="px-6 pt-10 flex flex-col items-end text-right">
            <img
              src={sevenPLogo}
              alt="7 Purposes"
              style={{ height: 72, width: "auto", mixBlendMode: "screen", marginBottom: "0.5rem" }}
            />
            <h1 className="font-serif font-bold leading-tight" style={{ fontSize: "clamp(1.6rem, 6vw, 2.8rem)", color: "hsl(40 80% 94%)" }}>
              The 7 Purposes<br />of ISKCON
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
                {currentUser ? (
                  currentUser.photoDataUrl
                    ? <img src={currentUser.photoDataUrl} alt={currentUser.fullName} className="rounded-full object-cover" style={{ width: 22, height: 22 }} />
                    : <div className="rounded-full flex items-center justify-center font-serif font-bold" style={{ width: 22, height: 22, background: "hsl(26 68% 52%)", color: "hsl(40 80% 96%)", fontSize: "0.65rem" }}>{currentUser.fullName[0]}</div>
                ) : (
                  <UserCircle className="w-4 h-4" />
                )}
                {currentUser ? `Welcome, ${currentUser.fullName.split(" ")[0]}` : "You"}
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
          WHAT — 7 Purposes logo row + expandable official text
      ═══════════════════════════════════════════════════════════ */}
      <div className="pb-20">
        <div className="pt-8" />

        {/* Logo grid — wrapped, big, centered */}
        <div className="flex flex-wrap justify-center gap-4 px-4">
          {purposes.map((p, i) => {
            const active = activePurpose === i;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActivePurpose(active ? null : i)}
                className="flex flex-col items-center gap-1 focus:outline-none"
                style={{
                  opacity: activePurpose !== null && !active ? 0.3 : 1,
                  transition: "opacity 0.2s, transform 0.2s",
                  transform: active ? "scale(1.1)" : "scale(1)",
                  width: 80,
                }}
              >
                <img
                  src={p.logo}
                  alt={p.title}
                  style={{ width: 80, height: 80, objectFit: "contain" }}
                />
                <div
                  className="rounded-full"
                  style={{ width: active ? 20 : 0, height: 2, background: "hsl(26 68% 42%)", transition: "width 0.2s" }}
                />
              </button>
            );
          })}
        </div>

        {/* Purpose panel — quote + description + activities + messages */}
        {activePurpose !== null && (
          <PurposePanel
            purposeId={purposes[activePurpose].id}
            title={purposes[activePurpose].title}
            officialText={purposes[activePurpose].officialText}
            description={purposes[activePurpose].description}
          />
        )}

      </div>

      {/* Bottom quote banner */}
      <div className="w-full px-6 pt-4 pb-20 text-center">
        <p className="font-serif italic leading-relaxed" style={{ fontSize: "1rem", color: "hsl(14 52% 28%)" }}>
          "Your love for me will be shown by how much you cooperate with each other after I am gone."
        </p>
        <p className="font-sans mt-2 text-xs tracking-wide" style={{ color: "hsl(14 35% 50%)" }}>
          Srila Prabhupada · 1977
        </p>
      </div>
    </div>
  );
}
