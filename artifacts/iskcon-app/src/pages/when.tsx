import { Link } from "wouter";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

type CalEvent = {
  day: number;
  label: string;
  color: string;
};

const EVENTS_BY_MONTH: Record<number, CalEvent[]> = {
  // April 2026
  3: [
    { day: 1,  label: "Accessing — Online study session",   color: "hsl(14 55% 38%)" },
    { day: 6,  label: "Community — Sunday feast",           color: "hsl(220 55% 45%)" },
    { day: 8,  label: "Learning — Gītā class",              color: "hsl(14 55% 38%)" },
    { day: 13, label: "Holy Place — Temple service",        color: "hsl(14 55% 38%)" },
    { day: 13, label: "Applying — Cooking workshop",        color: "hsl(12 44% 40%)" },
    { day: 20, label: "Community — Sunday feast",           color: "hsl(220 55% 45%)" },
    { day: 23, label: "Simple Living — Farm day",           color: "hsl(145 45% 35%)" },
    { day: 27, label: "Community — Sunday feast",           color: "hsl(220 55% 45%)" },
    { day: 29, label: "Sharing — Book distribution",        color: "hsl(14 55% 38%)" },
  ],
};

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  const d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1; // Monday = 0
}

export default function When() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const events = EVENTS_BY_MONTH[month] ?? [];

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const eventsByDay: Record<number, CalEvent[]> = {};
  events.forEach(e => {
    if (!eventsByDay[e.day]) eventsByDay[e.day] = [];
    eventsByDay[e.day].push(e);
  });

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
            const dayEvents = day ? (eventsByDay[day] ?? []) : [];
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
                        background: isToday(day) ? "hsl(12 44% 40%)" : "transparent",
                        color: isToday(day) ? "white" : "hsl(14 55% 25%)",
                      }}
                    >
                      {day}
                    </span>
                    {dayEvents.slice(0, 2).map((e, ei) => (
                      <div
                        key={ei}
                        className="w-full mt-0.5 rounded-sm px-1"
                        style={{ background: `${e.color}22`, borderLeft: `2px solid ${e.color}` }}
                        title={e.label}
                      >
                        <span className="font-sans block truncate" style={{ fontSize: "0.55rem", color: e.color, lineHeight: 1.4 }}>
                          {e.label.split("—")[0].trim()}
                        </span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend / upcoming events */}
        {events.length > 0 && (
          <div className="mt-6">
            <h3 className="font-serif font-semibold text-foreground mb-3" style={{ fontSize: "1rem" }}>
              Events this month
            </h3>
            <div className="space-y-2">
              {events.sort((a, b) => a.day - b.day).map((e, i) => (
                <div key={i} className="flex items-start gap-3 py-2 border-b border-border/40">
                  <div
                    className="shrink-0 font-sans font-bold text-center rounded-lg"
                    style={{ width: 36, paddingTop: 4, paddingBottom: 4, background: `${e.color}18`, color: e.color, fontSize: "0.8rem" }}
                  >
                    {e.day}
                  </div>
                  <div>
                    <p className="font-sans text-sm text-foreground leading-snug">{e.label}</p>
                    <p className="font-sans text-xs text-muted-foreground mt-0.5">{MONTH_NAMES[month]} {e.day}, {year}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {events.length === 0 && (
          <p className="text-center font-sans text-muted-foreground text-sm mt-6 italic">
            No events planned for this month yet.
          </p>
        )}
      </div>
    </div>
  );
}
