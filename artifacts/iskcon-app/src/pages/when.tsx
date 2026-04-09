import { Link } from "wouter";
import { ArrowLeft, ChevronLeft, ChevronRight, CalendarDays, MapPin, Users, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getCalendarActivities, subscribeToLocalData } from "@/lib/local-data";
import { format } from "date-fns";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const accentByPurposeId: Record<number, string> = {
  1: "hsl(163 40% 36%)",
  2: "hsl(222 72% 40%)",
  3: "hsl(0 0% 10%)",
  4: "hsl(10 54% 35%)",
  5: "hsl(10 54% 35%)",
  6: "hsl(10 54% 35%)",
  7: "hsl(10 54% 35%)",
};

const purposeNames: Record<number, string> = {
  1: "Simple Living",
  2: "Community",
  3: "Holy Place",
  4: "Accessing",
  5: "Learning",
  6: "Applying",
  7: "Sharing",
};

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  const d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1;
}

export default function When() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const { currentUser } = useAuth();

  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const refresh = () => {
      setLoading(true);
      try {
        setActivities(getCalendarActivities(currentUser));
      } finally {
        setLoading(false);
      }
    };
    refresh();
    return subscribeToLocalData(refresh);
  }, [currentUser]);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // Filter activities for the current month
  const monthActivities = activities.filter(a => {
    if (!a.scheduledAt) return false;
    const d = new Date(a.scheduledAt);
    return d.getFullYear() === year && d.getMonth() === month;
  });

  const eventsByDay: Record<number, any[]> = {};
  monthActivities.forEach(a => {
    const day = new Date(a.scheduledAt).getDate();
    if (!eventsByDay[day]) eventsByDay[day] = [];
    eventsByDay[day].push(a);
  });

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const isToday = (d: number | null) =>
    d !== null && d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  return (
    <div className="min-h-[100dvh] bg-background pb-16">

      {/* Header */}
      <div
        className="px-5 pt-10 pb-6"
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
        <h1 className="font-serif font-bold" style={{ fontSize: "2.2rem", color: "hsl(14 72% 18%)" }}>
          When?
        </h1>
        <p className="font-sans mt-1" style={{ color: "hsl(14 55% 28%)", fontSize: "0.9rem" }}>
          Community calendar — living the 7 Purposes
        </p>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5">

        {/* Month navigation */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-2 rounded-full hover:bg-border/40 transition-colors" aria-label="Previous month">
            <ChevronLeft className="w-5 h-5 text-foreground/60" />
          </button>
          <h2 className="font-serif font-semibold text-foreground" style={{ fontSize: "1.2rem" }}>
            {MONTH_NAMES[month]} {year}
          </h2>
          <button onClick={nextMonth} className="p-2 rounded-full hover:bg-border/40 transition-colors" aria-label="Next month">
            <ChevronRight className="w-5 h-5 text-foreground/60" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: "hsl(14 40% 52%)" }} />
          </div>
        ) : (
          <>
            {/* Day headers */}
            <div className="grid grid-cols-7 mb-1">
              {DAYS.map(d => (
                <div key={d} className="text-center font-sans font-semibold py-1" style={{ fontSize: "0.7rem", color: "hsl(14 45% 45%)" }}>
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-px rounded-xl overflow-hidden" style={{ background: "hsl(14 20% 82%)" }}>
              {cells.map((day, idx) => {
                const dayActivities = day ? (eventsByDay[day] ?? []) : [];
                return (
                  <div
                    key={idx}
                    className="flex flex-col items-center"
                    style={{
                      background: day ? "hsl(40 55% 90%)" : "hsl(40 40% 87%)",
                      minHeight: 52,
                      padding: "4px 2px",
                    }}
                  >
                    {day && (
                      <>
                        <span
                          className="font-sans text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full"
                          style={{
                            background: isToday(day) ? "hsl(26 68% 42%)" : "transparent",
                            color: isToday(day) ? "white" : "hsl(14 55% 25%)",
                          }}
                        >
                          {day}
                        </span>
                        {dayActivities.slice(0, 2).map((a: any, ei: number) => {
                          const color = accentByPurposeId[a.purposeId] ?? "hsl(26 68% 42%)";
                          return (
                            <div
                              key={ei}
                              className="w-full mt-0.5 rounded-sm px-1"
                              style={{ background: `${color}22`, borderLeft: `2px solid ${color}` }}
                              title={`${purposeNames[a.purposeId] ?? ""} — ${a.title}`}
                            >
                              <span className="font-sans block truncate" style={{ fontSize: "0.55rem", color, lineHeight: 1.4 }}>
                                {purposeNames[a.purposeId] ?? ""}
                              </span>
                            </div>
                          );
                        })}
                        {dayActivities.length > 2 && (
                          <span className="font-sans text-xs" style={{ fontSize: "0.5rem", color: "hsl(14 40% 50%)" }}>+{dayActivities.length - 2}</span>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Event list for this month */}
            {monthActivities.length > 0 ? (
              <div className="mt-6 space-y-3">
                <h3 className="font-serif font-semibold text-foreground mb-3" style={{ fontSize: "1rem" }}>
                  Activities this month
                </h3>
                {monthActivities
                  .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
                  .map((activity: any) => {
                    const color = accentByPurposeId[activity.purposeId] ?? "hsl(26 68% 42%)";
                    const isFull = activity.maxParticipants && activity.participantCount >= activity.maxParticipants;
                    return (
                      <div
                        key={activity.id}
                        className="rounded-2xl overflow-hidden shadow-sm"
                        style={{ background: "hsl(40 28% 97%)", border: "1px solid hsl(14 25% 72% / 0.35)" }}
                      >
                        <div style={{ height: 3, background: color }} />
                        <div className="p-4">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <p className="font-serif font-bold leading-snug" style={{ fontSize: "0.95rem", color: "hsl(14 72% 18%)" }}>
                              {activity.title}
                            </p>
                            <span className="font-sans text-xs font-semibold shrink-0 px-2 py-0.5 rounded-full" style={{ background: `${color}18`, color }}>
                              {purposeNames[activity.purposeId] ?? ""}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-3 mt-1.5 mb-2 font-sans text-xs" style={{ color: "hsl(14 40% 45%)" }}>
                            <span className="flex items-center gap-1">
                              <CalendarDays className="w-3 h-3" />
                              {format(new Date(activity.scheduledAt), "EEE d MMM, HH:mm")}
                            </span>
                            {activity.place && (
                              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{activity.place}</span>
                            )}
                            {activity.maxParticipants && (
                              <span className="flex items-center gap-1" style={{ color: isFull ? "hsl(358 52% 40%)" : "hsl(14 40% 45%)" }}>
                                <Users className="w-3 h-3" />
                                {activity.participantCount}/{activity.maxParticipants}
                                {isFull && " · Full"}
                              </span>
                            )}
                          </div>
                          <p className="font-sans text-sm leading-relaxed" style={{ color: "hsl(14 40% 35%)" }}>
                            {activity.description}
                          </p>
                          <p className="font-sans text-xs mt-2" style={{ color: "hsl(14 35% 55%)" }}>
                            Proposed by {activity.authorName}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <p className="text-center font-sans text-muted-foreground text-sm mt-6 italic">
                No activities planned for this month yet.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
