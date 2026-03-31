import { useState, useRef } from "react";
import { Link, useLocation } from "wouter";
import {
  ArrowLeft, Camera, Eye, EyeOff, LogOut,
  CalendarDays, MapPin, Briefcase, Mail, ShieldCheck, ChevronRight, CheckCircle2,
  Pencil, X, Check,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

import logoAccessing    from "@assets/7p_LogoNoTitle_Accessing_1774931916882.png";
import logoLearning     from "@assets/7p_LogoNoTitle_Learning_1774931916883.png";
import logoApplying     from "@assets/7p_LogoNoTitle_Applying_1774931916883.png";
import logoCommunity    from "@assets/7p_LogoNoTitle_Community_1774931916884.png";
import logoHolyPlace    from "@assets/7p_LogoNoTitle_HolyPlace_1774931916884.png";
import logoSharing      from "@assets/7p_LogoNoTitle_Sharing_1774931916884.png";
import logoSimpleLiving from "@assets/7p_LogoNoTitle_SimpleLiving_1774931916885.png";

const COMMUNITIES = ["Domaine de Radhadesh"];
const RADHADESH_DEPTS = [
  "HR & Legal Affairs", "Accounting", "Sankirtana", "Boutique",
  "Govinda's Restaurant", "Communications", "Outreach (Rose)", "Goshala",
  "Deity Worship", "Vaishnava Festivals", "Landscaping", "Forest",
  "Retreat Centre", "Community Kitchen", "Maintenance & Construction",
  "Service Coordinator (ex Temple Commander)", "Permaculture", "Tourism",
  "Devotee Care", "Education", "Ashram", "Radhadesh Mellows", "Other",
];

const surveyPurposes = [
  { id: "accessing",  label: "Accessing",     logo: logoAccessing },
  { id: "learning",   label: "Learning",      logo: logoLearning },
  { id: "community",  label: "Community",     logo: logoCommunity },
  { id: "applying",   label: "Applying",      logo: logoApplying },
  { id: "holy_place", label: "Holy Place",    logo: logoHolyPlace },
  { id: "simple",     label: "Simple Living", logo: logoSimpleLiving },
  { id: "sharing",    label: "Sharing",       logo: logoSharing },
];

type SurveyQuestion = { text: string; min: number; max: number };
const surveySections: { title: string; subtitle?: string; questions: SurveyQuestion[] }[] = [
  {
    title: "Personal",
    questions: [
      { min: 3, max: 3, text: "Which 3 purposes appeal most to you or are most relevant at your current stage of life? Select your top 3 in order of priority." },
      { min: 1, max: 1, text: "Which purpose would you put at the bottom of your list?" },
      { min: 1, max: 1, text: "Which purpose is not so relevant for you right now, but you would like to make more relevant?" },
    ],
  },
  {
    title: "Community perspective",
    questions: [
      { min: 7, max: 7, text: "List the 7 purposes from strongest to weakest, as you perceive our community is linked to them." },
      { min: 1, max: 3, text: "On which purpose should our community focus more? Select 1 to 3." },
    ],
  },
  {
    title: "Your department",
    subtitle: "If you are part of one or more departments, or are a department head",
    questions: [
      { min: 1, max: 3, text: "Which purpose is linked to your department the strongest? Select 1 to 3." },
      { min: 1, max: 3, text: "Which purpose would you like to link more closely to your department? Select 1 to 3." },
    ],
  },
];
const flatQuestions = surveySections.flatMap(s => s.questions);
const totalQuestions = flatQuestions.length;

function surveyHint(q: SurveyQuestion, count: number): string {
  if (q.min === q.max) {
    if (q.max === 1) return count === 1 ? "✓ Selected" : "Select 1";
    if (q.max === 7) return count === 7 ? "✓ All 7 ranked" : `Rank all 7 in order — ${count}/7`;
    return count === q.max ? `✓ ${q.max} selected` : `Select exactly ${q.max} — ${count}/${q.max}`;
  }
  return count >= q.min ? `✓ ${count} selected` : `Select ${q.min} to ${q.max} — ${count}/${q.max}`;
}

function isAnswered(q: SurveyQuestion, count: number) { return count >= q.min; }

const API_BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function Register() {
  const [, navigate] = useLocation();
  const { currentUser, token, login, logout, setUserFromRegistration, updateCurrentUser } = useAuth();
  const profilePhotoRef = useRef<HTMLInputElement>(null);
  const [photoUpdating, setPhotoUpdating] = useState(false);

  const [tab, setTab] = useState<"register" | "signin">("register");
  const [registrationStep, setRegistrationStep] = useState<1 | 2>(1);

  const [photo, setPhoto] = useState<string | null>(null);
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

  const [surveyAnswers, setSurveyAnswers] = useState<Record<number, string[]>>(
    () => Object.fromEntries(Array.from({ length: totalQuestions }, (_, i) => [i, []]))
  );

  const [editing, setEditing] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editForm, setEditForm] = useState({ fullName: "", dob: "", community: "", deptRolesOther: "" });
  const [editDeptRoles, setEditDeptRoles] = useState<string[]>([]);

  const startEditing = () => {
    if (!currentUser) return;
    setEditForm({
      fullName: currentUser.fullName,
      dob: currentUser.dob,
      community: currentUser.community,
      deptRolesOther: "",
    });
    setEditDeptRoles(currentUser.deptRoles.filter(r => RADHADESH_DEPTS.includes(r)));
    setEditing(true);
  };

  const cancelEditing = () => setEditing(false);

  const saveProfile = async () => {
    if (!token || editSaving) return;
    setEditSaving(true);
    try {
      const finalDeptRoles = editDeptRoles.includes("Other") && editForm.deptRolesOther
        ? [...editDeptRoles.filter(r => r !== "Other"), editForm.deptRolesOther]
        : editDeptRoles;
      const res = await fetch(`${API_BASE}/api/auth/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          fullName: editForm.fullName,
          dob: editForm.dob,
          community: editForm.community,
          deptRoles: finalDeptRoles,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to save");
      updateCurrentUser(data);
      setEditing(false);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setEditSaving(false);
    }
  };

  const setEdit = (k: keyof typeof editForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setEditForm(f => ({ ...f, [k]: e.target.value }));

  const toggleEditDeptRole = (item: string) =>
    setEditDeptRoles(prev => prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]);

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

  const surveyToggle = (qi: number, id: string) => {
    const q = flatQuestions[qi];
    setSurveyAnswers(prev => {
      const current = prev[qi];
      if (current.includes(id)) return { ...prev, [qi]: current.filter(x => x !== id) };
      if (q.max === 1) return { ...prev, [qi]: [id] };
      if (current.length >= q.max) return prev;
      return { ...prev, [qi]: [...current, id] };
    });
  };

  const surveyAnswered = flatQuestions.filter((q, i) => isAnswered(q, surveyAnswers[i].length)).length;
  const allSurveyAnswered = surveyAnswered === totalQuestions;

  const passwordsMatch = form.password === form.confirmPassword;
  const canSubmitStep1 = form.fullName && form.email && form.dob && form.community
    && form.password.length >= 6 && passwordsMatch;

  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmitStep1 || submitting) return;
    setSubmitting(true);
    try {
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
          surveyAnswers: [],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Registration failed");
      setUserFromRegistration(data.user, data.token);
      toast.success(`Welcome, ${data.user.fullName.split(" ")[0]}! Now complete the survey.`);
      setRegistrationStep(2);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStep2 = async () => {
    if (!allSurveyAnswered || submitting || !token) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/survey`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          answers: Object.entries(surveyAnswers).map(([qi, ans]) => ({
            questionIndex: Number(qi), answers: ans,
          })),
        }),
      });
      if (!res.ok) throw new Error("Survey submission failed");
      toast.success("Registration complete! Hare Krishna 🙏");
      setRegistrationStep(1);
    } catch {
      toast.error("Failed to submit survey. Please try again.");
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
      navigate("/register");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "w-full px-4 py-3 rounded-xl font-sans text-sm border bg-card focus:outline-none focus:ring-2 focus:ring-primary/40";
  const inputStyle = { borderColor: "hsl(14 30% 70% / 0.4)", color: "hsl(14 72% 18%)" };

  const handleProfilePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;
    setPhotoUpdating(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;
      try {
        const res = await fetch(`${API_BASE}/api/auth/photo`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify({ photoDataUrl: dataUrl }),
        });
        if (!res.ok) throw new Error("Upload failed");
        updateCurrentUser({ photoDataUrl: dataUrl });
        toast.success("Profile photo updated");
      } catch {
        toast.error("Failed to update photo");
      } finally {
        setPhotoUpdating(false);
      }
    };
    reader.readAsDataURL(file);
  };

  if (currentUser && registrationStep === 1) {
    const formattedDob = (() => {
      try { return format(parseISO(currentUser.dob), "d MMMM yyyy"); }
      catch { return currentUser.dob; }
    })();

    const iCls = "w-full px-4 py-3 rounded-xl font-sans text-sm border bg-card focus:outline-none focus:ring-2 focus:ring-primary/40";
    const iSty = { borderColor: "hsl(14 30% 70% / 0.4)", color: "hsl(14 72% 18%)" };

    return (
      <div className="min-h-[100dvh] bg-background pb-16">
        {/* Header */}
        <div className="px-5 pt-10 pb-8 relative overflow-hidden" style={{ background: "linear-gradient(130deg, hsl(40 58% 84%) 0%, hsl(26 55% 78%) 100%)" }}>
          <div className="flex items-center justify-between mb-6">
            <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-sans opacity-60 hover:opacity-100 transition-opacity" style={{ color: "hsl(14 72% 18%)" }}>
              <ArrowLeft className="w-4 h-4" /> Home
            </Link>
            {!editing && (
              <button onClick={startEditing} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-sans text-xs font-semibold transition-colors"
                style={{ background: "hsl(26 68% 42% / 0.15)", color: "hsl(26 55% 28%)", border: "1px solid hsl(26 68% 42% / 0.3)" }}>
                <Pencil className="w-3 h-3" /> Edit profile
              </button>
            )}
          </div>
          <div className="flex flex-col items-center gap-3">
            <button type="button" onClick={() => profilePhotoRef.current?.click()} className="relative rounded-full overflow-hidden group" style={{ width: 100, height: 100, flexShrink: 0 }} title="Change photo">
              {currentUser.photoDataUrl
                ? <img src={currentUser.photoDataUrl} alt={currentUser.fullName} className="rounded-full object-cover w-full h-full" style={{ border: "3px solid hsl(26 68% 42% / 0.4)" }} />
                : <div className="w-full h-full rounded-full flex items-center justify-center font-serif font-bold shadow-lg" style={{ fontSize: "2.2rem", background: "hsl(26 68% 42%)", color: "hsl(40 80% 96%)", border: "3px solid hsl(40 80% 96% / 0.5)" }}>{currentUser.fullName[0]}</div>
              }
              <div className="absolute inset-0 rounded-full flex flex-col items-center justify-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "hsl(14 35% 8% / 0.55)" }}>
                <Camera className="w-5 h-5 text-white" />
                <span className="font-sans text-white" style={{ fontSize: "0.55rem", fontWeight: 600 }}>{photoUpdating ? "…" : "Change"}</span>
              </div>
            </button>
            <input ref={profilePhotoRef} type="file" accept="image/*" className="hidden" onChange={handleProfilePhotoChange} />
            <div className="text-center">
              <h1 className="font-serif font-bold" style={{ fontSize: "1.7rem", color: "hsl(14 72% 18%)" }}>{currentUser.fullName}</h1>
              <span className="inline-flex items-center gap-1 mt-1 px-3 py-0.5 rounded-full font-sans text-xs font-semibold"
                style={{ background: currentUser.isAdmin ? "hsl(26 68% 42%)" : "hsl(14 30% 70% / 0.3)", color: currentUser.isAdmin ? "hsl(40 80% 96%)" : "hsl(14 45% 38%)" }}>
                {currentUser.isAdmin ? <><ShieldCheck className="w-3 h-3" /> Admin</> : "Member"}
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-lg mx-auto px-5 py-6 space-y-3">
          {/* Email — always read-only */}
          <ProfileRow icon={<Mail className="w-4 h-4" />} label="Email" value={currentUser.email} />

          {editing ? (
            <>
              {/* Full name */}
              <div className="rounded-2xl px-4 py-3.5 space-y-1.5" style={{ background: "hsl(40 50% 93%)", border: "1px solid hsl(14 30% 60% / 0.2)" }}>
                <label className="font-sans text-xs font-semibold uppercase tracking-wider" style={{ color: "hsl(14 40% 48%)" }}>Full name</label>
                <input value={editForm.fullName} onChange={setEdit("fullName")} className={iCls} style={iSty} placeholder="Your full name" />
              </div>

              {/* Date of birth */}
              <div className="rounded-2xl px-4 py-3.5 space-y-1.5" style={{ background: "hsl(40 50% 93%)", border: "1px solid hsl(14 30% 60% / 0.2)" }}>
                <label className="font-sans text-xs font-semibold uppercase tracking-wider" style={{ color: "hsl(14 40% 48%)" }}>Date of birth</label>
                <input type="date" value={editForm.dob} onChange={setEdit("dob")} className={iCls} style={iSty} />
              </div>

              {/* Community */}
              <div className="rounded-2xl px-4 py-3.5 space-y-1.5" style={{ background: "hsl(40 50% 93%)", border: "1px solid hsl(14 30% 60% / 0.2)" }}>
                <label className="font-sans text-xs font-semibold uppercase tracking-wider" style={{ color: "hsl(14 40% 48%)" }}>Community</label>
                <select value={editForm.community} onChange={setEdit("community")} className={iCls} style={iSty}>
                  {COMMUNITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Departments */}
              <div className="rounded-2xl px-4 py-3.5" style={{ background: "hsl(40 50% 93%)", border: "1px solid hsl(14 30% 60% / 0.2)" }}>
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase className="w-4 h-4" style={{ color: "hsl(26 68% 42%)" }} />
                  <span className="font-sans text-xs font-semibold uppercase tracking-wider" style={{ color: "hsl(14 40% 48%)" }}>Department / Role</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {RADHADESH_DEPTS.map(dept => {
                    const active = editDeptRoles.includes(dept);
                    return (
                      <button key={dept} type="button" onClick={() => toggleEditDeptRole(dept)}
                        className="px-3 py-1.5 rounded-full font-sans text-xs font-semibold transition-all"
                        style={{ background: active ? "hsl(26 68% 42%)" : "hsl(26 68% 42% / 0.08)", color: active ? "hsl(40 80% 96%)" : "hsl(26 55% 32%)", border: `1px solid ${active ? "hsl(26 68% 42%)" : "hsl(26 68% 42% / 0.25)"}` }}>
                        {active && <Check className="w-3 h-3 inline mr-1" />}{dept}
                      </button>
                    );
                  })}
                </div>
                {editDeptRoles.includes("Other") && (
                  <input value={editForm.deptRolesOther} onChange={setEdit("deptRolesOther")} className={`${iCls} mt-3`} style={iSty} placeholder="Specify your department / role" />
                )}
              </div>

              {/* Save / Cancel */}
              <button onClick={saveProfile} disabled={!editForm.fullName || editSaving}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full font-sans font-semibold text-sm transition-opacity"
                style={{ background: "hsl(26 68% 42%)", color: "hsl(40 80% 96%)", opacity: editSaving ? 0.6 : 1 }}>
                {editSaving ? "Saving…" : <><Check className="w-4 h-4" /> Save changes</>}
              </button>
              <button onClick={cancelEditing} className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full font-sans font-semibold text-sm border transition-colors"
                style={{ borderColor: "hsl(14 30% 70% / 0.4)", color: "hsl(14 55% 28%)", background: "transparent" }}>
                <X className="w-4 h-4" /> Cancel
              </button>
            </>
          ) : (
            <>
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
              <button onClick={logout} className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full font-sans font-semibold text-sm mt-2 border transition-colors"
                style={{ borderColor: "hsl(14 30% 70% / 0.4)", color: "hsl(14 55% 28%)", background: "transparent" }}>
                <LogOut className="w-4 h-4" /> Sign out
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  if (registrationStep === 2) {
    let globalIndex = 0;
    return (
      <div className="min-h-[100dvh] pb-16" style={{ background: "hsl(40 30% 96%)" }}>
        <div className="px-5 pt-10 pb-6" style={{ background: "linear-gradient(110deg, hsl(40 58% 84%) 0%, hsl(37 50% 80%) 100%)", borderBottom: "1px solid hsl(14 20% 78%)" }}>
          <h1 className="font-serif font-bold" style={{ fontSize: "1.8rem", color: "hsl(14 72% 18%)" }}>Community Survey</h1>
          <p className="font-sans mt-1 mb-3" style={{ color: "hsl(14 45% 38%)", fontSize: "0.88rem" }}>
            {surveyAnswered} / {totalQuestions} answered
          </p>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "hsl(14 30% 70% / 0.25)" }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${(surveyAnswered / totalQuestions) * 100}%`, background: "hsl(26 68% 42%)" }} />
          </div>
        </div>

        <div className="max-w-lg mx-auto px-5 py-6 space-y-8">
          {surveySections.map((section) => (
            <div key={section.title}>
              <div className="mb-4">
                <h2 className="font-serif font-bold" style={{ fontSize: "1.1rem", color: "hsl(14 72% 18%)" }}>{section.title}</h2>
                {section.subtitle && (
                  <p className="font-sans text-xs mt-0.5 italic" style={{ color: "hsl(14 40% 48%)" }}>{section.subtitle}</p>
                )}
                <div className="mt-2 h-px" style={{ background: "hsl(14 25% 72%)" }} />
              </div>
              <div className="space-y-4">
                {section.questions.map((q) => {
                  const qi = globalIndex++;
                  const count = surveyAnswers[qi].length;
                  const maxReached = count >= q.max;
                  const done = isAnswered(q, count);
                  return (
                    <div key={qi} className="rounded-2xl p-4"
                      style={{ background: "hsl(40 40% 93%)", border: `1px solid ${done ? "hsl(26 68% 42% / 0.4)" : "hsl(14 20% 80%)"}` }}>
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="font-sans font-bold text-xs shrink-0" style={{ color: "hsl(26 68% 42%)" }}>
                          {String(qi + 1).padStart(2, "0")}
                        </span>
                        <p className="font-serif font-semibold leading-snug" style={{ fontSize: "0.92rem", color: "hsl(14 72% 18%)" }}>{q.text}</p>
                      </div>
                      <div className="grid grid-cols-7 gap-1 w-full">
                        {surveyPurposes.map(p => {
                          const rank = surveyAnswers[qi].indexOf(p.id);
                          const active = rank !== -1;
                          const blocked = !active && maxReached;
                          return (
                            <button key={p.id} type="button" onClick={() => surveyToggle(qi, p.id)}
                              className="relative flex flex-col items-center gap-1 py-1.5 rounded-lg transition-all"
                              style={{ background: active ? "hsl(26 68% 42% / 0.1)" : "transparent", border: "none", outline: active ? "2px solid hsl(26 68% 42%)" : "2px solid transparent", outlineOffset: 0, opacity: active ? 1 : blocked ? 0.2 : 0.38, cursor: blocked ? "not-allowed" : "pointer" }}>
                              {active && (
                                <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center rounded-full font-sans font-bold"
                                  style={{ width: 15, height: 15, fontSize: "0.48rem", background: "hsl(26 68% 42%)", color: "hsl(40 90% 96%)", lineHeight: 1, zIndex: 1 }}>
                                  {rank + 1}
                                </span>
                              )}
                              <img src={p.logo} alt={p.label} style={{ width: 36, height: 36, objectFit: "contain", filter: active ? "none" : "grayscale(70%)" }} />
                              <span className="font-sans text-center leading-tight px-0.5"
                                style={{ fontSize: "0.48rem", color: active ? "hsl(26 55% 28%)" : "hsl(14 30% 50%)", fontWeight: active ? 700 : 400 }}>
                                {p.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      <p className="font-sans text-xs mt-2" style={{ color: done ? "hsl(145 45% 32%)" : "hsl(14 40% 50%)" }}>
                        {surveyHint(q, count)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <button onClick={handleStep2} disabled={!allSurveyAnswered || submitting}
            className="w-full py-3.5 rounded-full font-sans font-semibold text-sm transition-all"
            style={{ background: allSurveyAnswered && !submitting ? "hsl(26 68% 42%)" : "hsl(14 20% 75%)", color: allSurveyAnswered ? "hsl(40 80% 96%)" : "hsl(14 20% 52%)", cursor: allSurveyAnswered ? "pointer" : "not-allowed" }}>
            {submitting ? "Saving…" : allSurveyAnswered ? "Complete Registration →" : `${totalQuestions - surveyAnswered} question${totalQuestions - surveyAnswered > 1 ? "s" : ""} remaining`}
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
          <>
              <form onSubmit={handleStep1} className="space-y-5">
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

              <button type="submit" disabled={!canSubmitStep1 || submitting} className="w-full py-3.5 rounded-full font-sans font-semibold text-sm mt-2 transition-opacity inline-flex items-center justify-center gap-2"
                style={{ background: canSubmitStep1 && !submitting ? "hsl(26 68% 42%)" : "hsl(14 20% 70%)", color: canSubmitStep1 ? "hsl(40 80% 96%)" : "hsl(14 20% 50%)", cursor: canSubmitStep1 ? "pointer" : "not-allowed" }}>
                {submitting ? "Saving…" : <><span>Save & Continue to Survey</span><ChevronRight className="w-4 h-4" /></>}
              </button>
            </form>
          </>
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
