import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "wouter";
import PurposePanel from "./PurposePanel";
import { HelpCircle, Clock, ChevronLeft, ChevronRight, ChevronDown, UserCircle, Eye, Bell } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getBadges, getNotifications, markNotificationsReadAll, subscribeToLocalData } from "@/lib/local-data";
import prabhupadaPhoto from "@assets/image_1774931191461.png";
import radhadeshLogo from "@assets/Radhadesh Logo.png";
import logoSimpleLiving from "@assets/7p_Radhadesh_SimpleLiving.png";
import logoCommunity    from "@assets/7p_Radhadesh_Community.png";
import logoHolyPlace    from "@assets/7p_Radhadesh_HolyPlace.png";
import logoAccessing    from "@assets/7p_Radhadesh_Accessing.png";
import logoLearning     from "@assets/7p_Radhadesh_Learning.png";
import logoApplying     from "@assets/7p_Radhadesh_Applying.png";
import logoSharing      from "@assets/7p_Radhadesh_Sharing.png";
import { brandTheme, purposeColorByTitle } from "@/lib/brand";

const quotes = [
  {
    text: "The Krishna consciousness movement is meant to teach people how to love God. This is the sum and substance of all our purposes.",
    context: "On ISKCON's essence",
    ref: "Śrīla Prabhupāda · Letter to Hamsaduta, New York, 16 September 1969",
    vanipedia: "https://vanipedia.org/wiki/The_Purpose_of_ISKCON",
  },
  {
    text: "Simple living and high thinking is the solution to economic problems. We only need to produce food and live peacefully.",
    context: "On Simple Living",
    ref: "Śrīla Prabhupāda · Lecture on SB 1.2.6, Los Angeles, 17 August 1972",
    vanipedia: "https://vanipedia.org/wiki/Simple_Living_High_Thinking",
  },
  {
    text: "We want to create a community of devotees who live together, work together, and worship together. This is the ideal of Krishna consciousness.",
    context: "On Community",
    ref: "Śrīla Prabhupāda · Letter to Kirtanananda, New York, 20 June 1968",
    vanipedia: "https://vanipedia.org/wiki/Community",
  },
  {
    text: "Every town and every village should have a temple where people can come to learn the science of God. This is our mission.",
    context: "On Holy Place",
    ref: "Śrīla Prabhupāda · Lecture on SB 1.7.6, Vṛndāvana, 5 September 1976",
    vanipedia: "https://vanipedia.org/wiki/Temple",
  },
  {
    text: "We are distributing this knowledge freely. Anyone who reads our books, who hears our philosophy, will be benefited.",
    context: "On Accessing",
    ref: "Śrīla Prabhupāda · Press conference, Miami, 28 February 1975",
    vanipedia: "https://vanipedia.org/wiki/Book_Distribution",
  },
  {
    text: "You must learn the Bhagavad-gītā thoroughly. This is not ordinary knowledge — it is transcendental knowledge that liberates the soul.",
    context: "On Learning",
    ref: "Śrīla Prabhupāda · Introduction to Bhagavad-gītā As It Is, 1st edition, 1968",
    vanipedia: "https://vanipedia.org/wiki/Bhagavad-gita_As_It_Is",
  },
  {
    text: "Whatever you do, do it for Krishna. When everything is applied in Krishna's service, that is perfection.",
    context: "On Applying",
    ref: "Śrīla Prabhupāda · Lecture on BG 9.27, New York, 25 November 1966",
    vanipedia: "https://vanipedia.org/wiki/Everything_for_Krishna",
  },
  {
    text: "Go and preach. The greatest act of compassion is to share Krishna consciousness with those who are suffering in ignorance.",
    context: "On Sharing",
    ref: "Śrīla Prabhupāda · Lecture on SB 5.5.2, Hyderabad, 12 April 1975",
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

function getSeenIds(key: string): Set<number> {
  try { return new Set(JSON.parse(localStorage.getItem(key) ?? "[]") as number[]); }
  catch { return new Set(); }
}
function countNew(ids: number[], seenKey: string): number {
  const seen = getSeenIds(seenKey);
  return ids.filter(id => !seen.has(id)).length;
}

export default function Home() {
  const { currentUser } = useAuth();
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);
  const [activePurpose, setActivePurpose] = useState<number | null>(null);
  const [purposeBadges, setPurposeBadges] = useState<Record<number, number>>({});
  const [notifCount, setNotifCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const lastNotifData = useRef<any>(null);
  const purposeSectionRef = useRef<HTMLDivElement>(null);
  const [initialPurposeTab, setInitialPurposeTab] = useState<"activities" | "messages">("activities");

  const isAdmin = !!currentUser?.isAdmin;

  const computeBadges = useCallback((data: Record<number, { activityIds: number[]; messageIds: number[] }> | null, admin: boolean) => {
    if (!data) return;
    const actsPrefix = admin ? "iskcon_admin_acts_" : "iskcon_seen_acts_";
    const msgsPrefix = admin ? "iskcon_admin_msgs_" : "iskcon_seen_msgs_";
    const counts: Record<number, number> = {};
    for (const [pid, { activityIds, messageIds }] of Object.entries(data)) {
      const n = Number(pid);
      counts[n] = countNew(activityIds, `${actsPrefix}${n}`) + countNew(messageIds, `${msgsPrefix}${n}`);
    }
    setPurposeBadges(counts);
  }, []);

  // Fetch badge data every 4s — re-run when user changes role (login/logout)
  useEffect(() => {
    let lastData: Record<number, { activityIds: number[]; messageIds: number[] }> | null = null;
    const refresh = () => {
      lastData = getBadges(currentUser);
      computeBadges(lastData, isAdmin);
    };
    refresh();
    // Re-compute when PurposePanel marks items as seen
    const onStorage = () => { if (lastData) computeBadges(lastData, isAdmin); };
    window.addEventListener("storage", onStorage);
    const unsubscribe = subscribeToLocalData(refresh);
    return () => {
      unsubscribe();
      window.removeEventListener("storage", onStorage);
    };
  }, [computeBadges, currentUser?.id, isAdmin]);

  // Notification polling — only when logged in
  useEffect(() => {
    if (!currentUser) { setNotifCount(0); setNotifications([]); return; }
    const refresh = () => {
      const data = getNotifications();
      lastNotifData.current = data;
      setNotifCount(data.unreadCount);
      setNotifications(data.notifications);
    };
    refresh();
    return subscribeToLocalData(refresh);
  }, [currentUser]);

  const openNotifs = () => {
    setShowNotifs(true);
    if (notifCount > 0) {
      markNotificationsReadAll();
      setNotifCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  };

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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const purposeId = Number(params.get("purpose"));
    const tabParam = params.get("tab");

    if (!purposeId) return;

    const purposeIndex = purposes.findIndex((purpose) => purpose.id === purposeId);
    if (purposeIndex === -1) return;

    const nextTab = tabParam === "messages" ? "messages" : "activities";
    setInitialPurposeTab(nextTab);
    setActivePurpose(purposeIndex);

    window.setTimeout(() => {
      purposeSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  }, []);

  return (
    <div style={{ background: brandTheme.burgundy }}>

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
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(0, 0, 0, 0.52) 0%, rgba(0, 0, 0, 0.34) 34%, rgba(0, 0, 0, 0.42) 100%)",
          }}
        />

        {/* Content layer */}
        <div className="relative z-10 flex flex-col h-full">

          {/* Top bar — you left, logo right */}
          <div className="px-6 pt-10 flex items-start justify-between gap-4">

            {/* You pill + bell — top left */}
            <div className="flex items-center gap-2 shrink-0 mt-1">
              <Link href="/register" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-sans font-semibold border focus:outline-none backdrop-blur-sm" style={{ borderColor: "hsl(43 100% 90% / 0.28)", color: brandTheme.creamSoft, background: "hsl(344 34% 22% / 0.38)", fontSize: "0.85rem" }}>
                {currentUser ? (
                  currentUser.photoDataUrl
                    ? <img src={currentUser.photoDataUrl} alt={currentUser.fullName} className="rounded-full object-cover" style={{ width: 18, height: 18 }} />
                    : <div className="rounded-full flex items-center justify-center font-serif font-bold" style={{ width: 18, height: 18, background: brandTheme.burgundy, color: brandTheme.creamSoft, fontSize: "0.6rem" }}>{currentUser.fullName[0]}</div>
                ) : (
                  <UserCircle className="w-4 h-4" />
                )}
                {currentUser ? currentUser.fullName.split(" ")[0] : "You"}
              </Link>

              {currentUser && (
                <button
                  onClick={openNotifs}
                  className="relative inline-flex items-center justify-center rounded-full focus:outline-none"
                  style={{ width: 36, height: 36, background: "hsl(344 34% 22% / 0.38)", border: "1px solid hsl(43 100% 90% / 0.28)", backdropFilter: "blur(10px)" }}
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4" style={{ color: brandTheme.creamSoft }} />
                  {notifCount > 0 && (
                    <span
                      className="absolute -top-1 -right-1 min-w-[17px] h-[17px] flex items-center justify-center font-bold text-white rounded-full px-0.5"
                      style={{ fontSize: "0.62rem", background: "hsl(0 80% 48%)", lineHeight: 1 }}
                    >
                      {notifCount > 9 ? "9+" : notifCount}
                    </span>
                  )}
                </button>
              )}
            </div>

          </div>

          <div className="flex-1 flex items-start justify-end px-8 pt-0 md:pt-1">
            <div className="max-w-[34rem] text-right -mt-8 md:-mt-12">
              <div className="flex justify-end mb-3">
                <img
                  src={radhadeshLogo}
                  alt="Radhadesh logo"
                  style={{ width: 92, height: 92, objectFit: "contain", filter: "drop-shadow(0 0 10px rgba(255, 245, 215, 0.12))" }}
                />
              </div>
              <h1 className="font-serif font-semibold" style={{ fontSize: "clamp(2.2rem, 7vw, 4.35rem)", lineHeight: 1.14, color: brandTheme.creamSoft, textShadow: "0 3px 18px rgba(28, 12, 8, 0.16)" }}>
                The 7 Purposes
                <br />
                of ISKCON
              </h1>
              <div className="mt-5 flex justify-end">
                <div
                  className="inline-block px-6 py-2 rounded-full font-serif italic font-semibold"
                  style={{ background: brandTheme.mauveDark, color: brandTheme.creamSoft, fontSize: "clamp(1rem, 3vw, 1.2rem)" }}
                >
                  &amp; Community Building
                </div>
              </div>
            </div>
          </div>
          {/* Quote */}
          <div className="px-6 pb-2">
            <a
              href={quotes[current].vanipedia}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
              style={{ opacity: fading ? 0 : 1, transform: fading ? "translateY(6px)" : "translateY(0)", transition: "opacity 0.3s ease, transform 0.3s ease", textDecoration: "none" }}
            >
              <p className="font-serif italic leading-relaxed text-center" style={{ fontSize: "clamp(1.12rem, 4vw, 1.38rem)", color: "hsl(40 92% 94%)", textShadow: "0 3px 14px rgba(0,0,0,0.62)" }}>
                <span style={{ color: brandTheme.gold }}>"</span>{quotes[current].text}<span style={{ color: brandTheme.gold }}>"</span>
              </p>
              <p className="font-sans mt-2 text-center" style={{ fontSize: "0.82rem", color: "hsl(43 100% 92%)", letterSpacing: "0.04em", textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
                {quotes[current].ref}
              </p>
            </a>

            {/* Dot nav */}
            <div className="flex items-center gap-3 mt-4">
              <button onClick={() => goTo(current - 1)} className="rounded-full p-1.5" style={{ background: "hsl(344 34% 22% / 0.34)" }} aria-label="Previous">
                <ChevronLeft className="w-4 h-4" style={{ color: brandTheme.creamSoft }} />
              </button>
              <div className="flex gap-1.5 flex-1 justify-center">
                {quotes.map((_, i) => (
                  <button key={i} onClick={() => goTo(i)} className="rounded-full transition-all" style={{ width: 7, height: 7, background: i === current ? brandTheme.creamSoft : "hsl(43 100% 90% / 0.28)" }} aria-label={`Quote ${i + 1}`} />
                ))}
              </div>
              <button onClick={() => goTo(current + 1)} className="rounded-full p-1.5" style={{ background: "hsl(344 34% 22% / 0.34)" }} aria-label="Next">
                <ChevronRight className="w-4 h-4" style={{ color: brandTheme.creamSoft }} />
              </button>
            </div>
          </div>

          {/* Buttons — Why / When / Vision centred row */}
          <div className="px-6 pt-4 pb-5 flex items-center justify-center gap-3">
            <Link href="/why" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-sans font-semibold border focus:outline-none" style={{ borderColor: "hsl(40 70% 90% / 0.4)", color: "hsl(40 80% 96%)", background: "hsl(40 70% 94% / 0.12)", fontSize: "0.85rem" }}>
              <HelpCircle className="w-4 h-4" /> Why?
            </Link>
            <Link href="/when" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-sans font-semibold border focus:outline-none" style={{ borderColor: "hsl(40 70% 90% / 0.4)", color: "hsl(40 80% 96%)", background: "hsl(40 70% 94% / 0.12)", fontSize: "0.85rem" }}>
              <Clock className="w-4 h-4" /> When?
            </Link>
            <Link href="/vision" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-sans font-semibold border focus:outline-none" style={{ borderColor: "hsl(40 70% 90% / 0.4)", color: "hsl(40 80% 96%)", background: "hsl(40 70% 94% / 0.12)", fontSize: "0.85rem" }}>
              <Eye className="w-4 h-4" /> Vision
            </Link>
          </div>

          {/* Scroll hint */}
          <div className="pb-4 flex justify-center animate-bounce">
            <ChevronDown className="w-5 h-5" style={{ color: "hsl(43 100% 90% / 0.62)" }} />
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          WHAT — 7 Purposes logo row + expandable official text
      ═══════════════════════════════════════════════════════════ */}
      <div className="pb-20" ref={purposeSectionRef} style={{ background: brandTheme.burgundy }}>
        <div className="pt-16" />

        {/* Logo grid — airy, centered */}
        <div className="mx-auto flex max-w-[1540px] flex-wrap items-start justify-center gap-x-6 gap-y-4 px-4 md:flex-nowrap md:justify-between md:px-8">
          {purposes.map((p, i) => {
            const active = activePurpose === i;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActivePurpose(active ? null : i)}
                className="flex flex-col items-center gap-0 focus:outline-none"
                style={{
                  opacity: activePurpose !== null && !active ? 0.3 : 1,
                  transition: "opacity 0.2s, transform 0.2s",
                  transform: active ? "scale(1.1)" : "scale(1)",
                  width: 172,
                }}
              >
                <div className="relative" style={{ width: 148, height: 148 }}>
                  <img
                    src={p.logo}
                    alt={p.title}
                    style={{ width: 148, height: 148, objectFit: "contain" }}
                  />
                  {(purposeBadges[p.id] ?? 0) > 0 && (
                    <span
                      className="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center text-[10px] font-bold text-white rounded-full px-1 shadow"
                      style={{ background: "hsl(0 80% 48%)", lineHeight: 1 }}
                    >
                      {(purposeBadges[p.id] ?? 0) > 9 ? "9+" : purposeBadges[p.id]}
                    </span>
                  )}
                </div>
                <div
                  className="rounded-full"
                  style={{ width: active ? 20 : 0, height: 2, background: brandTheme.creamSoft, transition: "width 0.2s" }}
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
            initialTab={initialPurposeTab}
          />
        )}

      </div>

      {/* Bottom quote banner */}
      <div className="w-full px-6 pt-4 pb-20 text-center">
        <p className="font-serif italic leading-relaxed" style={{ fontSize: "1rem", color: brandTheme.creamSoft }}>
          "Your love for me will be shown by how much you cooperate with each other after I am gone."
        </p>
        <p className="font-sans mt-2 text-xs tracking-wide" style={{ color: "hsl(43 100% 86% / 0.78)" }}>
          Śrīla Prabhupāda · Conversation with disciples, Vṛndāvana, October 1977
        </p>
      </div>

      {/* Notification panel overlay */}
      {showNotifs && (
        <div
          className="fixed inset-0 z-50"
          style={{ background: "hsl(14 35% 10% / 0.45)" }}
          onClick={() => setShowNotifs(false)}
        >
          <div
            className="mx-4 mt-20 rounded-2xl overflow-hidden shadow-xl"
            style={{ background: "hsl(40 28% 97%)" }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid hsl(38 25% 85%)" }}>
              <h3 className="font-serif font-bold" style={{ color: "hsl(319 34% 18%)", fontSize: "1rem" }}>
                Notifications
              </h3>
              <button onClick={() => setShowNotifs(false)} className="font-sans text-xs" style={{ color: "hsl(14 35% 55%)" }}>
                Close
              </button>
            </div>

            {/* List */}
            <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
              {notifications.length === 0 ? (
                <div className="px-5 py-10 text-center font-sans" style={{ color: "hsl(14 35% 55%)", fontSize: "0.85rem" }}>
                  No notifications yet
                </div>
              ) : (
                notifications.map((n: any) => (
                  <div
                    key={n.id}
                    className="px-5 py-3"
                    style={{
                      borderBottom: "1px solid hsl(38 25% 88%)",
                      background: n.read ? "transparent" : "hsl(38 55% 92%)",
                    }}
                  >
                    <p className="font-sans" style={{ fontSize: "0.85rem", color: "hsl(319 34% 18%)", lineHeight: 1.4 }}>
                      {n.message}
                    </p>
                    <p className="font-sans mt-1" style={{ fontSize: "0.72rem", color: "hsl(14 35% 55%)" }}>
                      {new Date(n.createdAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
