import { useState, useRef } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Camera, CheckCircle2, ClipboardList, Eye, EyeOff, LogOut, CalendarDays, MapPin, Briefcase, Mail, ShieldCheck } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const COMMUNITIES = ["Domaine de Radhadesh"];
const RADHADESH_DEPTS = [
  "HR & Legal Affairs", "Accounting", "Sankirtana", "Boutique",
  "Govinda's Restaurant", "Communications", "Outreach (Rose)", "Goshala",
  "Deity Worship", "Vaishnava Festivals", "Landscaping", "Forest",
  "Retreat Centre", "Community Kitchen", "Maintenance & Construction",
  "Service Coordinator (ex Temple Commander)", "Permaculture", "Tourism",
  "Devotee Care", "Education", "Ashram", "Radhadesh Mellows", "Other",
];

const API_BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function Register() {
  const [, navigate] = useLocation();
  const { currentUser, login, logout, setUserFromRegistration } = useAuth();
  const [tab, setTab] = useState<"register" | "signin">(currentUser ? "signin" : "register");
  const [photo, setPhoto] = useState<string | null>(null);
  const [surveyDone, setSurveyDone] = useState(() => sessionStorage.getItem("survey_done") === "1");
  const [submitting, setSubmitting] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    fullName: "", email: "", dob: "", community: "", deptRolesOther: "",
    password: "", confirmPassword: "",
  });
  const [deptRoles, setDeptRoles] = useState<string[]>([]);

  const [signInForm, setSignInForm] = useState({ email: "", password: "" });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const setSI = (k: keyof typeof signInForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setSignInForm(f => ({ ...f, [k]: e.target.value }));

  const toggleDeptRole = (item: string) =>
    setDeptRoles(prev => prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setPhoto(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const passwordsMatch = form.password === form.confirmPassword;
  const canSubmit = form.fullName && form.email && form.dob && form.community && surveyDone
    && form.password.length >= 6 && passwordsMatch;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    try {
      const surveyAnswers = (() => {
        try { return JSON.parse(sessionStorage.getItem("survey_answers") ?? "[]"); }
        catch { return []; }
      })();

      const finalDeptRoles = deptRoles.includes("Other") && form.deptRolesOther
        ? [...deptRoles.filter(r => r !== "Other"), form.deptRolesOther]
        : deptRoles;

      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          dob: form.dob,
          community: form.community,
          deptRoles: finalDeptRoles,
          photoDataUrl: photo ?? undefined,
          surveyAnswers,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Registration failed");
      setUserFromRegistration(data.user, data.token);
      sessionStorage.removeItem("survey_done");
      sessionStorage.removeItem("survey_answers");
      toast.success(`Welcome, ${data.user.fullName.split(" ")[0]}!`);
      navigate("/register");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await login(signInForm.email, signInForm.password);
      toast.success("Welcome back!");
      navigate("/");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "w-full px-4 py-3 rounded-xl font-sans text-sm border bg-card focus:outline-none focus:ring-2 focus:ring-primary/40";
  const inputStyle = { borderColor: "hsl(14 30% 70% / 0.4)", color: "hsl(14 72% 18%)" };

  if (currentUser) {
    const formattedDob = (() => {
      try { return format(parseISO(currentUser.dob), "d MMMM yyyy"); }
      catch { return currentUser.dob; }
    })();

    return (
      <div className="min-h-[100dvh] bg-background pb-16">
        {/* Header */}
        <div className="px-5 pt-10 pb-8 relative overflow-hidden" style={{ background: "linear-gradient(130deg, hsl(40 58% 84%) 0%, hsl(26 55% 78%) 100%)" }}>
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-sans mb-6 opacity-60 hover:opacity-100 transition-opacity" style={{ color: "hsl(14 72% 18%)" }}>
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>

          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            {currentUser.photoDataUrl
              ? <img src={currentUser.photoDataUrl} alt={currentUser.fullName} className="rounded-full object-cover shadow-lg" style={{ width: 100, height: 100, border: "3px solid hsl(26 68% 42% / 0.4)" }} />
              : <div className="rounded-full flex items-center justify-center font-serif font-bold shadow-lg" style={{ width: 100, height: 100, fontSize: "2.2rem", background: "hsl(26 68% 42%)", color: "hsl(40 80% 96%)", border: "3px solid hsl(40 80% 96% / 0.5)" }}>{currentUser.fullName[0]}</div>
            }
            <div className="text-center">
              <h1 className="font-serif font-bold" style={{ fontSize: "1.7rem", color: "hsl(14 72% 18%)" }}>{currentUser.fullName}</h1>
              {currentUser.isAdmin && (
                <span className="inline-flex items-center gap-1 mt-1 px-3 py-0.5 rounded-full font-sans text-xs font-semibold" style={{ background: "hsl(26 68% 42%)", color: "hsl(40 80% 96%)" }}>
                  <ShieldCheck className="w-3 h-3" /> Admin
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Info cards */}
        <div className="max-w-lg mx-auto px-5 py-6 space-y-3">

          <ProfileRow icon={<Mail className="w-4 h-4" />} label="Email" value={currentUser.email} />
          <ProfileRow icon={<CalendarDays className="w-4 h-4" />} label="Date of birth" value={formattedDob} />
          <ProfileRow icon={<MapPin className="w-4 h-4" />} label="Community" value={currentUser.community} />

          {currentUser.deptRoles.length > 0 && (
            <div className="rounded-2xl px-4 py-3.5" style={{ background: "hsl(40 50% 93%)", border: "1px solid hsl(14 30% 60% / 0.2)" }}>
              <div className="flex items-center gap-2 mb-2.5">
                <Briefcase className="w-4 h-4" style={{ color: "hsl(26 68% 42%)" }} />
                <span className="font-sans text-xs font-semibold uppercase tracking-wider" style={{ color: "hsl(14 40% 48%)" }}>Department / Role</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentUser.deptRoles.map(r => (
                  <span key={r} className="px-3 py-1 rounded-full font-sans text-xs font-semibold" style={{ background: "hsl(26 68% 42% / 0.12)", color: "hsl(26 55% 28%)", border: "1px solid hsl(26 68% 42% / 0.3)" }}>{r}</span>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={logout}
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full font-sans font-semibold text-sm mt-2 border transition-colors"
            style={{ borderColor: "hsl(14 30% 70% / 0.4)", color: "hsl(14 55% 28%)", background: "transparent" }}
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-background pb-16">

      <div className="px-5 pt-10 pb-6" style={{ background: "linear-gradient(110deg, hsl(40 58% 84%) 0%, hsl(37 50% 80%) 100%)" }}>
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-sans mb-5 opacity-60 hover:opacity-100 transition-opacity" style={{ color: "hsl(14 72% 18%)" }}>
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <h1 className="font-serif font-bold" style={{ fontSize: "2.2rem", color: "hsl(14 72% 18%)" }}>Your Profile</h1>
        <p className="font-sans mt-1" style={{ color: "hsl(14 55% 28%)", fontSize: "0.9rem" }}>Your profile in the community</p>

        <div className="flex gap-1 mt-5 p-1 rounded-full" style={{ background: "hsl(14 30% 70% / 0.2)", width: "fit-content" }}>
          {(["register", "signin"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className="px-5 py-1.5 rounded-full font-sans font-semibold text-sm transition-all"
              style={{ background: tab === t ? "hsl(26 68% 42%)" : "transparent", color: tab === t ? "hsl(40 80% 96%)" : "hsl(14 55% 28%)" }}>
              {t === "register" ? "Register" : "Sign in"}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 py-6">

        {tab === "signin" ? (
          <form className="space-y-4" onSubmit={handleSignIn}>
            <Field label="Email" required>
              <input type="email" required placeholder="your@email.com" value={signInForm.email} onChange={setSI("email")} className={inputCls} style={inputStyle} />
            </Field>
            <Field label="Password" required>
              <div className="relative">
                <input type={showPass ? "text" : "password"} required placeholder="••••••••" value={signInForm.password} onChange={setSI("password")} className={inputCls + " pr-12"} style={inputStyle} />
                <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100" style={{ color: "hsl(14 40% 40%)" }}>
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </Field>
            <button type="submit" disabled={submitting} className="w-full py-3 rounded-full font-sans font-semibold text-sm mt-2 transition-opacity" style={{ background: "hsl(26 68% 42%)", color: "hsl(40 80% 96%)", opacity: submitting ? 0.6 : 1 }}>
              {submitting ? "Signing in…" : "Sign in"}
            </button>
            <p className="text-center font-sans text-xs" style={{ color: "hsl(14 40% 50%)" }}>
              No account yet?{" "}
              <button type="button" onClick={() => setTab("register")} className="underline font-semibold" style={{ color: "hsl(26 68% 38%)" }}>Register here</button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-5">

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

            <Field label="Full name" required>
              <input type="text" required placeholder="Hari das" value={form.fullName} onChange={set("fullName")} className={inputCls} style={inputStyle} />
            </Field>

            <Field label="Email" required>
              <input type="email" required placeholder="your@email.com" value={form.email} onChange={set("email")} className={inputCls} style={inputStyle} />
            </Field>

            <Field label="Date of birth" required>
              <input type="date" required value={form.dob} onChange={set("dob")} className={inputCls} style={inputStyle} />
            </Field>

            <Field label="Password" required>
              <div className="relative">
                <input type={showPass ? "text" : "password"} required minLength={6} placeholder="At least 6 characters" value={form.password} onChange={set("password")} className={inputCls + " pr-12"} style={inputStyle} />
                <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100" style={{ color: "hsl(14 40% 40%)" }}>
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </Field>

            <Field label="Repeat password" required>
              <div className="relative">
                <input type={showConfirm ? "text" : "password"} required placeholder="Repeat your password" value={form.confirmPassword} onChange={set("confirmPassword")} className={inputCls + " pr-12"} style={{ ...inputStyle, borderColor: form.confirmPassword && !passwordsMatch ? "hsl(0 70% 55%)" : "hsl(14 30% 70% / 0.4)" }} />
                <button type="button" onClick={() => setShowConfirm(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100" style={{ color: "hsl(14 40% 40%)" }}>
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.confirmPassword && !passwordsMatch && (
                <p className="font-sans text-xs mt-1" style={{ color: "hsl(0 70% 50%)" }}>Passwords do not match</p>
              )}
            </Field>

            <Field label="Community" required>
              <select required value={form.community} onChange={set("community")} className={inputCls} style={{ ...inputStyle, color: form.community ? "hsl(14 72% 18%)" : "hsl(14 30% 55%)" }}>
                <option value="" disabled>Select your community</option>
                {COMMUNITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>

            {form.community && (
              <div>
                <label className="block font-sans text-sm font-semibold mb-1.5" style={{ color: "hsl(14 55% 28%)" }}>
                  Department / Role
                  <span className="font-normal text-xs ml-2" style={{ color: "hsl(14 40% 50%)" }}>select all that apply</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {RADHADESH_DEPTS.map(item => {
                    const active = deptRoles.includes(item);
                    return (
                      <button key={item} type="button" onClick={() => toggleDeptRole(item)} className="px-3 py-1.5 rounded-full font-sans text-xs font-semibold transition-all"
                        style={{ background: active ? "hsl(26 68% 42%)" : "hsl(40 40% 88%)", color: active ? "hsl(40 80% 96%)" : "hsl(14 45% 38%)", border: active ? "1.5px solid hsl(26 68% 42%)" : "1.5px solid hsl(14 25% 72%)" }}>
                        {item}
                      </button>
                    );
                  })}
                </div>
                {deptRoles.includes("Other") && (
                  <input type="text" placeholder="Please specify…" value={form.deptRolesOther} onChange={set("deptRolesOther")} className={"mt-3 " + inputCls} style={inputStyle} />
                )}
              </div>
            )}

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
                <Link href="/survey" className="flex items-center gap-3 px-4 py-3 rounded-xl font-sans font-semibold text-sm border transition-colors" style={{ borderColor: "hsl(26 68% 42% / 0.5)", color: "hsl(26 68% 32%)", background: "hsl(26 68% 42% / 0.06)" }}>
                  <ClipboardList className="w-5 h-5" />
                  Take the survey
                  <span className="ml-auto text-xs font-normal" style={{ color: "hsl(14 40% 50%)" }}>required →</span>
                </Link>
              )}
            </div>

            <button type="submit" disabled={!canSubmit || submitting} className="w-full py-3.5 rounded-full font-sans font-semibold text-sm mt-2 transition-opacity"
              style={{ background: canSubmit && !submitting ? "hsl(26 68% 42%)" : "hsl(14 20% 70%)", color: canSubmit ? "hsl(40 80% 96%)" : "hsl(14 20% 50%)", cursor: canSubmit ? "pointer" : "not-allowed" }}>
              {submitting ? "Creating profile…" : canSubmit ? "Create my profile" : "Complete all fields + survey"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function ProfileRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl px-4 py-3.5" style={{ background: "hsl(40 50% 93%)", border: "1px solid hsl(14 30% 60% / 0.2)" }}>
      <span style={{ color: "hsl(26 68% 42%)" }}>{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="font-sans text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: "hsl(14 40% 48%)" }}>{label}</p>
        <p className="font-sans text-sm font-medium truncate" style={{ color: "hsl(14 72% 18%)" }}>{value}</p>
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
