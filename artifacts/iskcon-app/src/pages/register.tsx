import { useState, useRef } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Camera, CheckCircle2, ClipboardList } from "lucide-react";

const ROLES = ["Member", "Devotee", "Volunteer", "Sevaka", "Coordinator", "Pujari", "Teacher", "Other"];
const COMMUNITIES = ["Radhadesh", "London", "Paris", "Amsterdam", "Zurich", "Berlin", "Brussels", "Other"];

export default function Register() {
  const [, navigate] = useLocation();
  const [tab, setTab] = useState<"register" | "signin">("register");
  const [photo, setPhoto] = useState<string | null>(null);
  const [surveyDone, setSurveyDone] = useState(() => sessionStorage.getItem("survey_done") === "1");
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    fullName: "", email: "", dob: "", community: "", role: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => setPhoto(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const canSubmit = form.fullName && form.email && form.dob && form.community && form.role && surveyDone;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center px-6 gap-4">
        <CheckCircle2 className="w-16 h-16" style={{ color: "hsl(26 68% 42%)" }} />
        <h2 className="font-serif font-bold text-2xl text-foreground text-center">Welcome, {form.fullName.split(" ")[0]}!</h2>
        <p className="font-sans text-muted-foreground text-center text-sm">Your profile has been created. You are now part of the Radhadesh community.</p>
        <Link href="/" className="mt-4 px-6 py-3 rounded-full font-sans font-semibold text-sm" style={{ background: "hsl(26 68% 42%)", color: "hsl(40 80% 96%)" }}>
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-background pb-16">

      {/* Header */}
      <div className="px-5 pt-10 pb-6" style={{ background: "linear-gradient(110deg, hsl(40 58% 84%) 0%, hsl(37 50% 80%) 100%)" }}>
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-sans mb-5 opacity-60 hover:opacity-100 transition-opacity" style={{ color: "hsl(14 72% 18%)" }}>
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <h1 className="font-serif font-bold" style={{ fontSize: "2.2rem", color: "hsl(14 72% 18%)" }}>You</h1>
        <p className="font-sans mt-1" style={{ color: "hsl(14 55% 28%)", fontSize: "0.9rem" }}>Your profile in the community</p>

        {/* Tab switcher */}
        <div className="flex gap-1 mt-5 p-1 rounded-full" style={{ background: "hsl(14 30% 70% / 0.2)", width: "fit-content" }}>
          {(["register", "signin"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-5 py-1.5 rounded-full font-sans font-semibold text-sm transition-all"
              style={{
                background: tab === t ? "hsl(26 68% 42%)" : "transparent",
                color: tab === t ? "hsl(40 80% 96%)" : "hsl(14 55% 28%)",
              }}
            >
              {t === "register" ? "Register" : "Sign in"}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 py-6">

        {tab === "signin" ? (
          /* ── SIGN IN ─────────────────────────── */
          <form className="space-y-4" onSubmit={e => { e.preventDefault(); setSubmitted(true); }}>
            <div>
              <label className="block font-sans text-sm font-semibold mb-1.5" style={{ color: "hsl(14 55% 28%)" }}>Email</label>
              <input type="email" required placeholder="your@email.com" className="w-full px-4 py-3 rounded-xl font-sans text-sm border bg-card focus:outline-none focus:ring-2 focus:ring-primary/40" style={{ borderColor: "hsl(14 30% 70% / 0.4)", color: "hsl(14 72% 18%)" }} />
            </div>
            <div>
              <label className="block font-sans text-sm font-semibold mb-1.5" style={{ color: "hsl(14 55% 28%)" }}>Password</label>
              <input type="password" required placeholder="••••••••" className="w-full px-4 py-3 rounded-xl font-sans text-sm border bg-card focus:outline-none focus:ring-2 focus:ring-primary/40" style={{ borderColor: "hsl(14 30% 70% / 0.4)", color: "hsl(14 72% 18%)" }} />
            </div>
            <button type="submit" className="w-full py-3 rounded-full font-sans font-semibold text-sm mt-2" style={{ background: "hsl(26 68% 42%)", color: "hsl(40 80% 96%)" }}>
              Sign in
            </button>
          </form>
        ) : (
          /* ── REGISTER ────────────────────────── */
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Profile photo */}
            <div className="flex flex-col items-center gap-3 pb-2">
              <button type="button" onClick={() => fileRef.current?.click()} className="relative rounded-full overflow-hidden border-2 flex items-center justify-center" style={{ width: 88, height: 88, borderColor: "hsl(26 68% 42% / 0.4)", background: "hsl(40 40% 88%)" }}>
                {photo
                  ? <img src={photo} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <Camera className="w-8 h-8" style={{ color: "hsl(14 40% 55%)" }} />
                }
                <div className="absolute bottom-0 inset-x-0 py-1 flex justify-center" style={{ background: "hsl(14 35% 10% / 0.45)" }}>
                  <span className="font-sans text-xs" style={{ color: "white" }}>optional</span>
                </div>
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
            </div>

            {/* Full name */}
            <Field label="Full name" required>
              <input type="text" required placeholder="Hari das" value={form.fullName} onChange={set("fullName")} className="w-full px-4 py-3 rounded-xl font-sans text-sm border bg-card focus:outline-none focus:ring-2 focus:ring-primary/40" style={{ borderColor: "hsl(14 30% 70% / 0.4)", color: "hsl(14 72% 18%)" }} />
            </Field>

            {/* Email */}
            <Field label="Email" required>
              <input type="email" required placeholder="your@email.com" value={form.email} onChange={set("email")} className="w-full px-4 py-3 rounded-xl font-sans text-sm border bg-card focus:outline-none focus:ring-2 focus:ring-primary/40" style={{ borderColor: "hsl(14 30% 70% / 0.4)", color: "hsl(14 72% 18%)" }} />
            </Field>

            {/* Date of birth */}
            <Field label="Date of birth" required>
              <input type="date" required value={form.dob} onChange={set("dob")} className="w-full px-4 py-3 rounded-xl font-sans text-sm border bg-card focus:outline-none focus:ring-2 focus:ring-primary/40" style={{ borderColor: "hsl(14 30% 70% / 0.4)", color: "hsl(14 72% 18%)" }} />
            </Field>

            {/* Community */}
            <Field label="Community" required>
              <select required value={form.community} onChange={set("community")} className="w-full px-4 py-3 rounded-xl font-sans text-sm border bg-card focus:outline-none focus:ring-2 focus:ring-primary/40" style={{ borderColor: "hsl(14 30% 70% / 0.4)", color: form.community ? "hsl(14 72% 18%)" : "hsl(14 30% 55%)" }}>
                <option value="" disabled>Select your community</option>
                {COMMUNITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>

            {/* Role */}
            <Field label="Role" required>
              <select required value={form.role} onChange={set("role")} className="w-full px-4 py-3 rounded-xl font-sans text-sm border bg-card focus:outline-none focus:ring-2 focus:ring-primary/40" style={{ borderColor: "hsl(14 30% 70% / 0.4)", color: form.role ? "hsl(14 72% 18%)" : "hsl(14 30% 55%)" }}>
                <option value="" disabled>Select your role</option>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </Field>

            {/* Survey — mandatory */}
            <div>
              <label className="block font-sans text-sm font-semibold mb-1.5" style={{ color: "hsl(14 55% 28%)" }}>
                Survey <span style={{ color: "hsl(14 72% 38%)" }}>*</span>
                <span className="font-normal text-xs ml-2" style={{ color: "hsl(14 40% 50%)" }}>(required to register)</span>
              </label>
              {surveyDone ? (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl" style={{ background: "hsl(145 45% 35% / 0.1)", border: "1px solid hsl(145 45% 35% / 0.3)" }}>
                  <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: "hsl(145 45% 35%)" }} />
                  <span className="font-sans text-sm" style={{ color: "hsl(145 45% 25%)" }}>Survey completed — thank you!</span>
                </div>
              ) : (
                <Link
                  href="/survey"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl font-sans font-semibold text-sm border transition-colors"
                  style={{ borderColor: "hsl(26 68% 42% / 0.5)", color: "hsl(26 68% 32%)", background: "hsl(26 68% 42% / 0.06)" }}
                >
                  <ClipboardList className="w-5 h-5" />
                  Take the survey
                  <span className="ml-auto text-xs font-normal" style={{ color: "hsl(14 40% 50%)" }}>required →</span>
                </Link>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full py-3.5 rounded-full font-sans font-semibold text-sm mt-2 transition-opacity"
              style={{
                background: canSubmit ? "hsl(26 68% 42%)" : "hsl(14 20% 70%)",
                color: canSubmit ? "hsl(40 80% 96%)" : "hsl(14 20% 50%)",
                cursor: canSubmit ? "pointer" : "not-allowed",
              }}
            >
              {canSubmit ? "Create my profile" : "Complete all fields + survey"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block font-sans text-sm font-semibold mb-1.5" style={{ color: "hsl(14 55% 28%)" }}>
        {label} {required && <span style={{ color: "hsl(14 72% 38%)" }}>*</span>}
      </label>
      {children}
    </div>
  );
}
