import { useState, useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetActivities,
  useGetMessages,
  useCreateActivity,
  useCreateMessage,
  getGetActivitiesQueryKey,
  getGetMessagesQueryKey,
} from "@workspace/api-client-react";
import {
  CalendarDays, MessageCircle, Loader2, Lock,
  ChevronDown, ChevronUp, CheckCircle2, Clock, MessageSquare, Send,
  MapPin, Users, XCircle,
} from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/context/AuthContext";
import radhadeshRLogo from "@assets/image_1774956193985.png";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";

const activitySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  authorName: z.string().min(1, "Your name is required"),
  scheduledAt: z.string().min(1, "Please set a date and time"),
  place: z.string().min(1, "Place is required"),
  minParticipants: z.coerce.number().min(3, "Minimum is 3"),
  maxParticipants: z.preprocess(v => v === "" || v === undefined ? undefined : Number(v), z.number().min(3, "Must be at least 3").optional()),
});

const messageSchema = z.object({
  content: z.string().min(1, "Message cannot be empty"),
  authorName: z.string().min(1, "Your name is required"),
});

const accentById: Record<number, string> = {
  1: "hsl(150 42% 36%)",
  2: "hsl(213 55% 42%)",
  3: "hsl(265 38% 44%)",
  4: "hsl(26 68% 42%)",
  5: "hsl(40 62% 38%)",
  6: "hsl(178 48% 34%)",
  7: "hsl(358 52% 42%)",
};


interface AnyComment {
  id: number;
  authorName: string;
  content: string;
  createdAt: string;
}

interface PurposePanelProps {
  purposeId: number;
  title: string;
  officialText: string;
  description: string;
}

const API_BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

function PendingBanner({ count, label }: { count: number; label: string }) {
  return (
    <div className="flex items-center gap-2 px-1 mb-1">
      <Clock className="w-3.5 h-3.5" style={{ color: "hsl(35 80% 45%)" }} />
      <span className="font-sans text-xs font-semibold uppercase tracking-wider" style={{ color: "hsl(35 70% 40%)" }}>
        {label} awaiting validation ({count})
      </span>
    </div>
  );
}

function PublishedDivider() {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex-1 h-px" style={{ background: "hsl(14 25% 72% / 0.4)" }} />
      <span className="font-sans text-xs uppercase tracking-widest" style={{ color: "hsl(14 35% 55%)" }}>Published</span>
      <div className="flex-1 h-px" style={{ background: "hsl(14 25% 72% / 0.4)" }} />
    </div>
  );
}

function CommentSection({
  itemId,
  itemType,
  purposeId,
  token,
  currentUser,
}: {
  itemId: number;
  itemType: "activity" | "message";
  purposeId: number;
  token: string | null;
  currentUser: { fullName: string } | null;
}) {
  const [comments, setComments] = useState<AnyComment[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [input, setInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const endpoint = itemType === "activity"
    ? `${API_BASE}/api/purposes/${purposeId}/activities/${itemId}/comments`
    : `${API_BASE}/api/purposes/${purposeId}/messages/${itemId}/comments`;

  const load = useCallback(async () => {
    if (loaded) return;
    try {
      const res = await fetch(endpoint);
      if (res.ok) setComments(await res.json());
    } catch { /* silent */ }
    setLoaded(true);
  }, [endpoint, loaded]);

  const refresh = async () => {
    try {
      const res = await fetch(endpoint);
      if (res.ok) setComments(await res.json());
    } catch { /* silent */ }
  };

  const submit = async () => {
    if (!input.trim() || !token) return;
    setSubmitting(true);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ content: input.trim() }),
      });
      if (!res.ok) throw new Error();
      setInput("");
      await refresh();
      toast.success("Comment added");
    } catch {
      toast.error("Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  // Load comments when this component mounts
  useState(() => { load(); });

  return (
    <div className="px-4 pb-4 pt-2" style={{ borderTop: "1px solid hsl(14 25% 72% / 0.2)" }}>
      {!loaded ? (
        <div className="flex justify-center py-3"><Loader2 className="w-4 h-4 animate-spin" style={{ color: "hsl(14 40% 52%)" }} /></div>
      ) : comments.length === 0 ? (
        <p className="font-sans text-xs text-center py-3" style={{ color: "hsl(14 30% 58%)" }}>No comments yet. Be the first!</p>
      ) : (
        <div className="space-y-2 mb-3">
          {comments.map(c => (
            <div key={c.id} className="flex gap-2.5 items-start">
              <div className="rounded-full shrink-0 flex items-center justify-center font-serif font-bold"
                style={{ width: 28, height: 28, fontSize: "0.75rem", background: "hsl(14 18% 88%)", color: "hsl(14 55% 32%)" }}>
                {c.authorName[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-0.5">
                  <span className="font-sans font-semibold" style={{ fontSize: "0.75rem", color: "hsl(14 55% 28%)" }}>{c.authorName}</span>
                  <span className="font-sans" style={{ fontSize: "0.68rem", color: "hsl(14 25% 58%)" }}>{format(new Date(c.createdAt), "MMM d")}</span>
                </div>
                <p className="font-sans leading-snug" style={{ fontSize: "0.82rem", color: "hsl(14 45% 28%)" }}>{c.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {currentUser ? (
        <div className="flex gap-2 items-end mt-2">
          <div className="rounded-full shrink-0 flex items-center justify-center font-serif font-bold"
            style={{ width: 28, height: 28, fontSize: "0.75rem", background: "hsl(14 18% 88%)", color: "hsl(14 55% 32%)" }}>
            {currentUser.fullName[0]}
          </div>
          <div className="flex-1 flex items-end gap-2 rounded-2xl px-3 py-2"
            style={{ background: "hsl(40 40% 88%)", border: "1px solid hsl(14 25% 68% / 0.3)" }}>
            <textarea
              rows={1}
              placeholder="Write a comment…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }}
              className="flex-1 resize-none bg-transparent font-sans text-sm outline-none"
              style={{ color: "hsl(14 55% 22%)", minHeight: 24, maxHeight: 80 }}
            />
            <button onClick={submit} disabled={!input.trim() || submitting}
              className="shrink-0 rounded-full flex items-center justify-center transition-opacity"
              style={{ width: 28, height: 28, background: "hsl(14 45% 38%)", opacity: !input.trim() ? 0.35 : 1 }}>
              {submitting
                ? <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                : <Send className="w-3.5 h-3.5 text-white" />}
            </button>
          </div>
        </div>
      ) : (
        <p className="font-sans text-xs text-center pt-2" style={{ color: "hsl(14 35% 52%)" }}>
          <Link href="/register" className="font-semibold underline" style={{ color: "hsl(14 55% 32%)" }}>Sign in</Link> to leave a comment
        </p>
      )}
    </div>
  );
}

export default function PurposePanel({ purposeId, title, officialText, description }: PurposePanelProps) {
  const queryClient = useQueryClient();
  const { currentUser, token } = useAuth();
  const accent = accentById[purposeId] ?? "hsl(26 68% 42%)";
  const cardBg = "hsl(40 28% 97%)";

  const [stats, setStats] = useState<{ connected: number; registered: number } | null>(null);
  useEffect(() => {
    fetch(`${API_BASE}/api/stats`)
      .then(r => r.ok ? r.json() : null)
      .then(d => d && setStats(d))
      .catch(() => {});
  }, []);

  const [openActivities, setOpenActivities] = useState<Set<number>>(new Set());
  const [expandedActivityComments, setExpandedActivityComments] = useState<Set<number>>(new Set());
  const [expandedMessageComments, setExpandedMessageComments] = useState<Set<number>>(new Set());
  const [activityCommentCounts, setActivityCommentCounts] = useState<Record<number, number>>({});
  const [messageCommentCounts, setMessageCommentCounts] = useState<Record<number, number>>({});
  const [approvingActivityId, setApprovingActivityId] = useState<number | null>(null);
  const [approvingMessageId, setApprovingMessageId] = useState<number | null>(null);
  const [disapprovingActivityId, setDisapprovingActivityId] = useState<number | null>(null);
  const [disapprovingMessageId, setDisapprovingMessageId] = useState<number | null>(null);

  const { data: activities, isLoading: isLoadingActivities } = useGetActivities(purposeId, {
    query: { queryKey: getGetActivitiesQueryKey(purposeId) },
  });

  const { data: messages, isLoading: isLoadingMessages } = useGetMessages(purposeId, {
    query: { queryKey: getGetMessagesQueryKey(purposeId) },
  });

  const createActivity = useCreateActivity();
  const createMessage = useCreateMessage();

  const activityForm = useForm<z.infer<typeof activitySchema>>({
    resolver: zodResolver(activitySchema),
    defaultValues: { title: "", description: "", authorName: currentUser?.fullName ?? "", scheduledAt: "", place: "", minParticipants: 3, maxParticipants: undefined },
  });

  const messageForm = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: { content: "", authorName: currentUser?.fullName ?? "" },
  });

  const toggleActivity = (id: number) => {
    if (!currentUser) {
      toast("Sign in to read and interact with activities", {
        action: { label: "Sign in", onClick: () => window.location.href = "/register" },
      });
      return;
    }
    setOpenActivities(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleComments = (id: number, type: "activity" | "message") => {
    const setter = type === "activity" ? setExpandedActivityComments : setExpandedMessageComments;
    setter(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const approveActivity = async (id: number) => {
    if (!token) return;
    setApprovingActivityId(id);
    try {
      const res = await fetch(`${API_BASE}/api/purposes/${purposeId}/activities/${id}/approve`, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      queryClient.invalidateQueries({ queryKey: getGetActivitiesQueryKey(purposeId) });
      toast.success("Activity approved and published");
    } catch {
      toast.error("Failed to approve activity");
    } finally {
      setApprovingActivityId(null);
    }
  };

  const disapproveActivity = async (id: number) => {
    if (!token) return;
    setDisapprovingActivityId(id);
    try {
      const res = await fetch(`${API_BASE}/api/purposes/${purposeId}/activities/${id}/disapprove`, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      queryClient.invalidateQueries({ queryKey: getGetActivitiesQueryKey(purposeId) });
      toast.success("Activity moved back to pending");
    } catch {
      toast.error("Failed to disapprove activity");
    } finally {
      setDisapprovingActivityId(null);
    }
  };

  const approveMessage = async (id: number) => {
    if (!token) return;
    setApprovingMessageId(id);
    try {
      const res = await fetch(`${API_BASE}/api/purposes/${purposeId}/messages/${id}/approve`, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      queryClient.invalidateQueries({ queryKey: getGetMessagesQueryKey(purposeId) });
      toast.success("Message approved and published");
    } catch {
      toast.error("Failed to approve message");
    } finally {
      setApprovingMessageId(null);
    }
  };

  const disapproveMessage = async (id: number) => {
    if (!token) return;
    setDisapprovingMessageId(id);
    try {
      const res = await fetch(`${API_BASE}/api/purposes/${purposeId}/messages/${id}/disapprove`, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      queryClient.invalidateQueries({ queryKey: getGetMessagesQueryKey(purposeId) });
      toast.success("Message moved back to pending");
    } catch {
      toast.error("Failed to disapprove message");
    } finally {
      setDisapprovingMessageId(null);
    }
  };

  const onActivitySubmit = (data: z.infer<typeof activitySchema>) => {
    const payload = {
      ...data,
      scheduledAt: new Date(data.scheduledAt).toISOString(),
    };
    createActivity.mutate({ purposeId, data: payload as any }, {
      onSuccess: () => {
        toast.success("Activity proposed! It will appear once validated.", { duration: 5000 });
        activityForm.reset({ title: "", description: "", authorName: currentUser?.fullName ?? "", scheduledAt: "", place: "", minParticipants: 3, maxParticipants: undefined });
        queryClient.invalidateQueries({ queryKey: getGetActivitiesQueryKey(purposeId) });
      },
      onError: () => toast.error("Failed to propose activity"),
    });
  };

  const onMessageSubmit = (data: z.infer<typeof messageSchema>) => {
    createMessage.mutate({ purposeId, data }, {
      onSuccess: () => {
        toast.success("Message sent for validation. It will appear once approved.", { duration: 5000 });
        messageForm.reset({ content: "", authorName: currentUser?.fullName ?? "" });
        queryClient.invalidateQueries({ queryKey: getGetMessagesQueryKey(purposeId) });
      },
      onError: () => toast.error("Failed to share message"),
    });
  };

  const approvedActivities = (activities ?? []).filter((a: any) => a.approved === true);
  const pendingActivities  = (activities ?? []).filter((a: any) => a.approved === false);
  const approvedMessages   = (messages  ?? []).filter((m: any) => m.approved === true);
  const pendingMessages    = (messages  ?? []).filter((m: any) => m.approved === false);

  return (
    <div className="mt-2">
      {/* Quote block */}
      <div className="relative px-6 py-6">
        <span className="absolute font-serif font-bold select-none" style={{ top: 6, left: 14, fontSize: "3.5rem", lineHeight: 1, color: "hsl(14 30% 45% / 0.35)" }}>"</span>
        <span className="absolute font-serif font-bold select-none" style={{ bottom: 2, right: 14, fontSize: "3.5rem", lineHeight: 1, color: "hsl(14 30% 45% / 0.35)" }}>"</span>
        <div className="text-center">
          <p className="font-serif font-bold leading-relaxed" style={{ fontSize: "0.95rem", color: "hsl(14 52% 18%)" }}>{officialText}</p>
        </div>
        <div className="my-5 mx-auto w-12 h-px" style={{ background: "hsl(14 25% 68%)" }} />
        <p className="font-sans leading-relaxed text-center" style={{ fontSize: "0.88rem", color: "hsl(14 40% 38%)" }}>{description}</p>
      </div>

      {/* Community section */}
      <div className="px-4">
        {/* R logo circle + stats, centered */}
        <div className="flex items-center justify-center gap-3 pt-5 pb-4">
          <img
            src={radhadeshRLogo}
            alt="Radhadesh"
            style={{
              width: 48, height: 48,
              borderRadius: "50%",
              objectFit: "cover",
              objectPosition: "center",
              flexShrink: 0,
              boxShadow: "0 1px 6px hsl(14 40% 20% / 0.25)",
            }}
          />
          {stats ? (
            <span className="font-sans text-sm" style={{ color: "hsl(14 40% 48%)" }}>
              {stats.connected}/{stats.registered}
            </span>
          ) : null}
        </div>

        {/* Domaine de Radhadesh divider */}
        <div className="flex items-center gap-3 pb-4">
          <div className="flex-1 h-px" style={{ background: "hsl(14 30% 60% / 0.25)" }} />
          <span className="font-sans text-xs uppercase tracking-widest whitespace-nowrap" style={{ color: "hsl(14 40% 50%)" }}>Domaine de Radhadesh</span>
          <div className="flex-1 h-px" style={{ background: "hsl(14 30% 60% / 0.25)" }} />
        </div>

        <Tabs defaultValue="activities" className="w-full">
          <TabsList className="w-full grid grid-cols-2 h-12 rounded-2xl p-1 mb-6"
            style={{ background: "hsl(38 40% 80%)", border: "1px solid hsl(14 30% 60% / 0.2)" }}>
            <TabsTrigger value="activities" className="rounded-xl font-semibold font-sans text-sm transition-all data-[state=active]:shadow-sm" style={{ color: "hsl(14 55% 30%)" }}>
              <CalendarDays className="w-4 h-4 mr-1.5" /> Activities
            </TabsTrigger>
            <TabsTrigger value="messages" className="rounded-xl font-semibold font-sans text-sm transition-all data-[state=active]:shadow-sm" style={{ color: "hsl(14 55% 30%)" }}>
              <MessageCircle className="w-4 h-4 mr-1.5" /> Messages
            </TabsTrigger>
          </TabsList>

          {/* ── ACTIVITIES TAB ── */}
          <TabsContent value="activities" className="space-y-3">

            {/* Admin: pending activities */}
            {currentUser?.isAdmin && pendingActivities.length > 0 && (
              <div className="space-y-2">
                <PendingBanner count={pendingActivities.length} label="Activities" />
                {pendingActivities.map((activity: any) => (
                  <div key={activity.id} className="rounded-2xl overflow-hidden shadow-sm"
                    style={{ background: cardBg, border: "1px solid hsl(14 25% 72% / 0.35)" }}>
                    <div style={{ height: 3, background: accent }} />
                    <div className="p-4">
                      <p className="font-serif font-bold leading-snug mb-1" style={{ fontSize: "0.95rem", color: "hsl(14 72% 18%)" }}>{activity.title}</p>
                      <p className="font-sans text-sm leading-relaxed mb-2" style={{ color: "hsl(14 50% 30%)" }}>{activity.description}</p>
                      {(activity.scheduledAt || activity.place) && (
                        <div className="flex flex-wrap gap-3 mb-3 text-xs font-sans" style={{ color: "hsl(14 40% 45%)" }}>
                          {activity.scheduledAt && <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" />{format(new Date(activity.scheduledAt), "EEE d MMM yyyy, HH:mm")}</span>}
                          {activity.place && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{activity.place}</span>}
                          {activity.minParticipants && <span className="flex items-center gap-1"><Users className="w-3 h-3" />{activity.minParticipants}{activity.maxParticipants ? `–${activity.maxParticipants}` : "+"} participants</span>}
                        </div>
                      )}
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="font-sans text-xs font-semibold" style={{ color: "hsl(14 45% 38%)" }}>By {activity.authorName}</span>
                          <span className="font-sans text-xs" style={{ color: "hsl(14 30% 55%)" }}>{format(new Date(activity.createdAt), "MMM d, yyyy")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => disapproveActivity(activity.id)} disabled={disapprovingActivityId === activity.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-sans font-semibold text-xs border transition-opacity"
                            style={{ borderColor: "hsl(358 48% 50%)", color: "hsl(358 52% 40%)", background: "transparent", opacity: disapprovingActivityId === activity.id ? 0.5 : 1 }}>
                            {disapprovingActivityId === activity.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}
                            Reject
                          </button>
                          <button onClick={() => approveActivity(activity.id)} disabled={approvingActivityId === activity.id}
                            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full font-sans font-semibold text-xs transition-opacity"
                            style={{ background: "hsl(150 42% 36%)", color: "hsl(150 40% 96%)", opacity: approvingActivityId === activity.id ? 0.6 : 1 }}>
                            {approvingActivityId === activity.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                            {approvingActivityId === activity.id ? "Approving…" : "Approve"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {approvedActivities.length > 0 && <PublishedDivider />}
              </div>
            )}

            {/* Approved activities */}
            {isLoadingActivities ? (
              <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin" style={{ color: "hsl(14 40% 52%)" }} /></div>
            ) : approvedActivities.length === 0 ? (
              <div className="rounded-2xl p-8 text-center border border-dashed"
                style={{ background: "hsl(40 40% 90% / 0.5)", borderColor: "hsl(14 30% 60% / 0.3)" }}>
                <CalendarDays className="w-8 h-8 mx-auto mb-3" style={{ color: "hsl(14 30% 60% / 0.5)" }} />
                <p className="font-sans text-sm" style={{ color: "hsl(14 40% 48%)" }}>No activities yet.</p>
              </div>
            ) : (
              <div className="space-y-3 mb-3">
                {approvedActivities.map((activity: any, i: number) => {
                  const isOpen = openActivities.has(activity.id);
                  const commentsOpen = expandedActivityComments.has(activity.id);
                  return (
                    <div key={activity.id} className="rounded-2xl overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-2"
                      style={{ background: cardBg, border: "1px solid hsl(14 25% 72% / 0.35)", animationDelay: `${i * 50}ms`, animationFillMode: "both" }}>
                      <div style={{ height: 3, background: accent }} />

                      {/* Title row — always visible */}
                      <button type="button" onClick={() => toggleActivity(activity.id)}
                        className="w-full flex items-center gap-3 px-4 py-3.5 text-left">
                        <CalendarDays className="w-4 h-4 shrink-0" style={{ color: "hsl(14 40% 50%)" }} />
                        <div className="flex-1 min-w-0">
                          <span className="font-serif font-bold leading-snug block" style={{ fontSize: "0.95rem", color: "hsl(14 72% 18%)" }}>
                            {activity.title}
                          </span>
                          {activity.scheduledAt && (
                            <span className="font-sans text-xs flex items-center gap-1 mt-0.5" style={{ color: "hsl(14 40% 48%)" }}>
                              <CalendarDays className="w-3 h-3" />{format(new Date(activity.scheduledAt), "EEE d MMM, HH:mm")}
                              {activity.place && <><MapPin className="w-3 h-3 ml-1" />{activity.place}</>}
                            </span>
                          )}
                        </div>
                        {currentUser
                          ? isOpen ? <ChevronUp className="w-4 h-4 shrink-0" style={{ color: "hsl(14 40% 50%)" }} />
                                   : <ChevronDown className="w-4 h-4 shrink-0" style={{ color: "hsl(14 40% 50%)" }} />
                          : <Lock className="w-3.5 h-3.5 shrink-0" style={{ color: "hsl(14 40% 55%)", opacity: 0.55 }} />}
                      </button>

                      {/* Expanded content */}
                      {isOpen && currentUser && (
                        <div className="px-4 pb-2" style={{ borderTop: "1px solid hsl(14 25% 72% / 0.25)" }}>
                          <p className="font-sans text-sm leading-relaxed mt-3 mb-2" style={{ color: "hsl(14 50% 28%)" }}>
                            {activity.description}
                          </p>
                          {activity.minParticipants && (
                            <div className="flex items-center gap-1 mb-3 font-sans text-xs" style={{ color: "hsl(14 40% 45%)" }}>
                              <Users className="w-3 h-3" />
                              {activity.minParticipants} – {activity.maxParticipants ?? "?"} participants
                            </div>
                          )}
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3 text-xs" style={{ color: "hsl(14 35% 48%)" }}>
                              <span className="font-semibold" style={{ color: "hsl(14 45% 38%)" }}>By {activity.authorName}</span>
                              <span>{format(new Date(activity.createdAt), "MMM d, yyyy")}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {currentUser.isAdmin && (
                                <button onClick={() => disapproveActivity(activity.id)} disabled={disapprovingActivityId === activity.id}
                                  className="inline-flex items-center gap-1 font-sans text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors"
                                  style={{ borderColor: "hsl(358 48% 50%)", color: "hsl(358 52% 40%)", background: "transparent" }}>
                                  {disapprovingActivityId === activity.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}
                                  Unpublish
                                </button>
                              )}
                              <button onClick={() => toggleComments(activity.id, "activity")}
                                className="inline-flex items-center gap-1 font-sans text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
                                style={{ background: commentsOpen ? "hsl(14 18% 88%)" : "transparent", color: "hsl(14 42% 42%)", border: "1px solid hsl(14 25% 68% / 0.45)" }}>
                                <MessageSquare className="w-3 h-3" />
                                {commentsOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Comments */}
                      {isOpen && commentsOpen && currentUser && (
                        <CommentSection
                          key={`act-${activity.id}`}
                          itemId={activity.id}
                          itemType="activity"
                          purposeId={purposeId}
                          token={token}
                          currentUser={currentUser}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Propose an Activity — all signed-in users */}
            {currentUser ? (
              <div className="rounded-2xl p-5 shadow relative overflow-hidden"
                style={{ background: cardBg, border: "1px solid hsl(14 25% 72% / 0.35)" }}>
                <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl" style={{ background: accent }} />
                <h3 className="font-serif text-lg font-bold mb-1" style={{ color: "hsl(14 72% 18%)" }}>Propose an Activity</h3>
                <p className="font-sans text-xs mb-4" style={{ color: "hsl(14 38% 50%)" }}>Your proposal will appear once validated</p>
                <Form {...activityForm}>
                  <form onSubmit={activityForm.handleSubmit(onActivitySubmit)} className="space-y-4">
                    <FormField control={activityForm.control} name="title" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-sans text-sm" style={{ color: "hsl(14 55% 30%)" }}>Activity Title</FormLabel>
                        <FormControl>
                          <input placeholder="E.g., Sunday Feast Program"
                            className="w-full h-11 px-4 rounded-xl font-sans text-sm border focus:outline-none focus:ring-2 focus:ring-primary/30"
                            style={{ background: "hsl(40 40% 96%)", borderColor: "hsl(14 30% 65% / 0.4)", color: "hsl(14 72% 18%)" }}
                            {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={activityForm.control} name="description" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-sans text-sm" style={{ color: "hsl(14 55% 30%)" }}>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="What will happen during this activity?"
                            className="resize-none min-h-[90px] rounded-xl font-sans"
                            style={{ background: "hsl(40 40% 96%)", borderColor: "hsl(14 30% 65% / 0.4)" }}
                            {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={activityForm.control} name="scheduledAt" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-sans text-sm flex items-center gap-1" style={{ color: "hsl(14 55% 30%)" }}>
                          <CalendarDays className="w-3.5 h-3.5" /> Date &amp; Time
                        </FormLabel>
                        <FormControl>
                          <input type="datetime-local"
                            className="w-full h-11 px-4 rounded-xl font-sans text-sm border focus:outline-none focus:ring-2 focus:ring-primary/30"
                            style={{ background: "hsl(40 40% 96%)", borderColor: "hsl(14 30% 65% / 0.4)", color: "hsl(14 72% 18%)" }}
                            {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={activityForm.control} name="place" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-sans text-sm flex items-center gap-1" style={{ color: "hsl(14 55% 30%)" }}>
                          <MapPin className="w-3.5 h-3.5" /> Place
                        </FormLabel>
                        <FormControl>
                          <input placeholder="E.g., Temple room, Radhadesh"
                            className="w-full h-11 px-4 rounded-xl font-sans text-sm border focus:outline-none focus:ring-2 focus:ring-primary/30"
                            style={{ background: "hsl(40 40% 96%)", borderColor: "hsl(14 30% 65% / 0.4)", color: "hsl(14 72% 18%)" }}
                            {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <div className="grid grid-cols-2 gap-3">
                      <FormField control={activityForm.control} name="minParticipants" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-sans text-sm flex items-center gap-1" style={{ color: "hsl(14 55% 30%)" }}>
                            <Users className="w-3.5 h-3.5" /> Min participants
                          </FormLabel>
                          <FormControl>
                            <input type="number" min={3} placeholder="3"
                              className="w-full h-11 px-4 rounded-xl font-sans text-sm border focus:outline-none focus:ring-2 focus:ring-primary/30"
                              style={{ background: "hsl(40 40% 96%)", borderColor: "hsl(14 30% 65% / 0.4)", color: "hsl(14 72% 18%)" }}
                              {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={activityForm.control} name="maxParticipants" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-sans text-sm" style={{ color: "hsl(14 55% 30%)" }}>Max participants</FormLabel>
                          <FormControl>
                            <input type="number" min={3} placeholder="Optional"
                              className="w-full h-11 px-4 rounded-xl font-sans text-sm border focus:outline-none focus:ring-2 focus:ring-primary/30"
                              style={{ background: "hsl(40 40% 96%)", borderColor: "hsl(14 30% 65% / 0.4)", color: "hsl(14 72% 18%)" }}
                              {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "hsl(40 40% 88%)" }}>
                      <span className="font-sans text-xs" style={{ color: "hsl(14 40% 48%)" }}>Posting as</span>
                      <span className="font-sans text-sm font-semibold" style={{ color: "hsl(14 72% 18%)" }}>{currentUser.fullName}</span>
                    </div>
                    <Button type="submit" className="w-full h-11 rounded-xl font-bold font-sans tracking-wide shadow-sm"
                      disabled={createActivity.isPending} style={{ background: accent, color: "hsl(40 80% 96%)" }}>
                      {createActivity.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                      Send for Validation
                    </Button>
                  </form>
                </Form>
              </div>
            ) : (
              <SignInPrompt action="propose an activity" />
            )}
          </TabsContent>

          {/* ── MESSAGES TAB ── */}
          <TabsContent value="messages" className="space-y-4">

            {/* Admin: pending messages */}
            {currentUser?.isAdmin && pendingMessages.length > 0 && (
              <div className="space-y-2">
                <PendingBanner count={pendingMessages.length} label="Messages" />
                {pendingMessages.map((message: any) => (
                  <div key={message.id} className="rounded-2xl overflow-hidden shadow-sm"
                    style={{ background: cardBg, border: "1px solid hsl(14 25% 72% / 0.35)" }}>
                    <div style={{ height: 3, background: accent }} />
                    <div className="p-4">
                      <p className="font-serif italic leading-relaxed mb-3" style={{ fontSize: "0.92rem", color: "hsl(14 65% 22%)" }}>
                        "{message.content}"
                      </p>
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="font-sans text-xs font-semibold" style={{ color: "hsl(14 45% 38%)" }}>— {message.authorName}</span>
                          <span className="font-sans text-xs" style={{ color: "hsl(14 30% 55%)" }}>{format(new Date(message.createdAt), "MMM d, yyyy")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => disapproveMessage(message.id)} disabled={disapprovingMessageId === message.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-sans font-semibold text-xs border transition-opacity"
                            style={{ borderColor: "hsl(358 48% 50%)", color: "hsl(358 52% 40%)", background: "transparent", opacity: disapprovingMessageId === message.id ? 0.5 : 1 }}>
                            {disapprovingMessageId === message.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}
                            Reject
                          </button>
                          <button onClick={() => approveMessage(message.id)} disabled={approvingMessageId === message.id}
                            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full font-sans font-semibold text-xs transition-opacity"
                            style={{ background: "hsl(150 42% 36%)", color: "hsl(150 40% 96%)", opacity: approvingMessageId === message.id ? 0.6 : 1 }}>
                            {approvingMessageId === message.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                            {approvingMessageId === message.id ? "Approving…" : "Approve"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {approvedMessages.length > 0 && <PublishedDivider />}
              </div>
            )}

            {/* Approved messages */}
            {isLoadingMessages ? (
              <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin" style={{ color: "hsl(14 40% 52%)" }} /></div>
            ) : approvedMessages.length === 0 ? (
              <div className="rounded-2xl p-8 text-center border border-dashed"
                style={{ background: "hsl(40 40% 90% / 0.5)", borderColor: "hsl(14 30% 60% / 0.3)" }}>
                <MessageCircle className="w-8 h-8 mx-auto mb-3" style={{ color: "hsl(14 30% 60% / 0.5)" }} />
                <p className="font-sans text-sm" style={{ color: "hsl(14 40% 48%)" }}>No messages yet. Share your reflections!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {approvedMessages.map((message: any, i: number) => {
                  const commentsOpen = expandedMessageComments.has(message.id);
                  return (
                    <div key={message.id} className="rounded-2xl overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-2"
                      style={{ background: cardBg, border: "1px solid hsl(14 25% 72% / 0.35)", animationDelay: `${i * 50}ms`, animationFillMode: "both" }}>
                      <div style={{ height: 3, background: accent }} />
                      <div className="p-5 pb-3">
                        <p className="font-serif italic text-base leading-relaxed mb-4" style={{ color: "hsl(14 65% 22%)" }}>
                          "{message.content}"
                        </p>
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-3 text-xs" style={{ color: "hsl(14 40% 50%)" }}>
                            <span className="font-bold" style={{ color: "hsl(14 45% 38%)" }}>— {message.authorName}</span>
                            <span>{format(new Date(message.createdAt), "MMM d, yyyy")}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {currentUser?.isAdmin && (
                              <button onClick={() => disapproveMessage(message.id)} disabled={disapprovingMessageId === message.id}
                                className="inline-flex items-center gap-1 font-sans text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors"
                                style={{ borderColor: "hsl(358 48% 50%)", color: "hsl(358 52% 40%)", background: "transparent" }}>
                                {disapprovingMessageId === message.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}
                                Unpublish
                              </button>
                            )}
                            <button onClick={() => toggleComments(message.id, "message")}
                              className="inline-flex items-center gap-1 font-sans text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
                              style={{ background: commentsOpen ? "hsl(14 18% 88%)" : "transparent", color: "hsl(14 42% 42%)", border: "1px solid hsl(14 25% 68% / 0.45)" }}>
                              <MessageSquare className="w-3 h-3" />
                              {commentsOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      {commentsOpen && (
                        <CommentSection
                          key={`msg-${message.id}`}
                          itemId={message.id}
                          itemType="message"
                          purposeId={purposeId}
                          token={token}
                          currentUser={currentUser}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Share a message */}
            <div className="rounded-2xl p-5 shadow relative overflow-hidden"
              style={{ background: cardBg, border: "1px solid hsl(14 25% 72% / 0.35)" }}>
              <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl" style={{ background: accent }} />
              <h3 className="font-serif text-lg font-bold mb-1" style={{ color: "hsl(14 72% 18%)" }}>Share a Message</h3>
              <p className="font-sans text-xs mb-4" style={{ color: "hsl(14 38% 50%)" }}>Your message will appear once validated</p>
              {!currentUser ? (
                <SignInPrompt action="share a message" />
              ) : (
                <Form {...messageForm}>
                  <form onSubmit={messageForm.handleSubmit(onMessageSubmit)} className="space-y-4">
                    <FormField control={messageForm.control} name="content" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-sans text-sm" style={{ color: "hsl(14 55% 30%)" }}>Your Message</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Share your realizations or thoughts…"
                            className="resize-none min-h-[110px] rounded-xl font-sans"
                            style={{ background: "hsl(40 40% 96%)", borderColor: "hsl(14 30% 65% / 0.4)" }}
                            {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "hsl(40 40% 88%)" }}>
                      <span className="font-sans text-xs" style={{ color: "hsl(14 40% 48%)" }}>Posting as</span>
                      <span className="font-sans text-sm font-semibold" style={{ color: "hsl(14 72% 18%)" }}>{currentUser.fullName}</span>
                    </div>
                    <Button type="submit" className="w-full h-11 rounded-xl font-bold font-sans tracking-wide shadow-sm"
                      disabled={createMessage.isPending} style={{ background: accent, color: "hsl(40 80% 96%)" }}>
                      {createMessage.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                      Send for Validation
                    </Button>
                  </form>
                </Form>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function SignInPrompt({ action }: { action: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-5 text-center">
      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "hsl(26 68% 42% / 0.12)" }}>
        <Lock className="w-5 h-5" style={{ color: "hsl(26 68% 42%)" }} />
      </div>
      <p className="font-sans text-sm" style={{ color: "hsl(14 40% 42%)" }}>Sign in to {action}</p>
      <Link href="/register" className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full font-sans font-semibold text-sm"
        style={{ background: "hsl(26 68% 42%)", color: "hsl(40 80% 96%)" }}>
        Sign in / Register
      </Link>
    </div>
  );
}
