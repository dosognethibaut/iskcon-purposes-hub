import { useState, useCallback, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetActivities,
  useGetMessages,
  useCreateActivity,
  useCreateMessage,
  getGetActivitiesQueryKey,
  getGetMessagesQueryKey,
} from "@/lib/local-api";
import {
  CalendarDays, MessageCircle, Loader2, Lock,
  ChevronDown, ChevronUp, CheckCircle2, Clock, MessageSquare, Send,
  MapPin, Users, XCircle, Camera, ImagePlus, Trash2,
} from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/context/AuthContext";
import radhadeshRLogo from "@assets/image_1774956916097.png";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  addComment,
  approveActivity as approveActivityLocal,
  approveMessage as approveMessageLocal,
  completeActivity as completeActivityLocal,
  deleteActivity as deleteActivityLocal,
  deleteMessage as deleteMessageLocal,
  disapproveActivity as disapproveActivityLocal,
  disapproveMessage as disapproveMessageLocal,
  getComments,
  getStats,
  joinActivity as joinActivityLocal,
  leaveActivity as leaveActivityLocal,
  subscribeToLocalData,
  uncompleteActivity as uncompleteActivityLocal,
} from "@/lib/local-data";
import { brandTheme, purposeColorById } from "@/lib/brand";

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

// ── Badge helpers (localStorage-based "seen" tracking) ──────────────────────
function getSeenIds(key: string): Set<number> {
  try { return new Set(JSON.parse(localStorage.getItem(key) ?? "[]") as number[]); }
  catch { return new Set(); }
}
function markAllSeen(key: string, ids: number[]) {
  localStorage.setItem(key, JSON.stringify(ids));
  // Notify other tabs / home page
  window.dispatchEvent(new StorageEvent("storage", { key }));
}
function countNew(ids: number[], seenKey: string): number {
  const seen = getSeenIds(seenKey);
  return ids.filter(id => !seen.has(id)).length;
}

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
  initialTab?: "activities" | "messages";
}

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
  currentUser: { fullName: string; photoDataUrl?: string | null } | null;
}) {
  const [comments, setComments] = useState<AnyComment[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [input, setInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    if (loaded) return;
    try {
      setComments(getComments(itemType, itemId));
    } catch { /* silent */ }
    setLoaded(true);
  }, [itemId, itemType, loaded]);

  const refresh = async () => {
    try {
      setComments(getComments(itemType, itemId));
    } catch { /* silent */ }
  };

  const submit = async () => {
    if (!input.trim() || !token) return;
    setSubmitting(true);
    try {
      addComment(itemType, itemId, input.trim());
      setInput("");
      await refresh();
      toast.success("Comment added");
    } catch {
      toast.error("Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    void load();
  }, [load]);
  useEffect(() => subscribeToLocalData(refresh), [refresh]);

  return (
    <div className="px-4 pb-4 pt-2" style={{ borderTop: "1px solid hsl(14 25% 72% / 0.2)" }}>
      {!loaded ? (
        <div className="flex justify-center py-3"><Loader2 className="w-4 h-4 animate-spin" style={{ color: "hsl(14 40% 52%)" }} /></div>
      ) : comments.length === 0 ? (
        <p className="font-sans text-xs text-center py-3" style={{ color: "hsl(14 30% 58%)" }}>No comments yet. Be the first!</p>
      ) : (
        <div className="space-y-2 mb-3">
          {comments.map(c => {
            const isMe = currentUser && c.authorName === currentUser.fullName;
            return (
            <div key={c.id} className="flex gap-2.5 items-start">
              {isMe && currentUser?.photoDataUrl ? (
                <img src={currentUser.photoDataUrl} alt={c.authorName} className="rounded-full shrink-0 object-cover" style={{ width: 28, height: 28 }} />
              ) : (
                <div className="rounded-full shrink-0 flex items-center justify-center font-serif font-bold"
                  style={{ width: 28, height: 28, fontSize: "0.75rem", background: isMe ? "hsl(14 35% 80%)" : "hsl(14 18% 88%)", color: "hsl(14 55% 32%)" }}>
                  {c.authorName[0]}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-0.5">
                  <span className="font-sans font-semibold" style={{ fontSize: "0.75rem", color: "hsl(14 55% 28%)" }}>{c.authorName}</span>
                  <span className="font-sans" style={{ fontSize: "0.68rem", color: "hsl(14 25% 58%)" }}>{format(new Date(c.createdAt), "MMM d")}</span>
                </div>
                <p className="font-sans leading-snug" style={{ fontSize: "0.82rem", color: "hsl(14 45% 28%)" }}>{c.content}</p>
              </div>
            </div>
          );})}  
        </div>
      )}

      {currentUser ? (
        <div className="flex gap-2 items-end mt-2">
          {currentUser.photoDataUrl ? (
            <img src={currentUser.photoDataUrl} alt={currentUser.fullName} className="rounded-full shrink-0 object-cover" style={{ width: 28, height: 28 }} />
          ) : (
            <div className="rounded-full shrink-0 flex items-center justify-center font-serif font-bold"
              style={{ width: 28, height: 28, fontSize: "0.75rem", background: "hsl(14 18% 88%)", color: "hsl(14 55% 32%)" }}>
              {currentUser.fullName[0]}
            </div>
          )}
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
              style={{ width: 28, height: 28, background: "hsl(337 26% 38%)", opacity: !input.trim() ? 0.35 : 1 }}>
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

export default function PurposePanel({ purposeId, title, officialText, description, initialTab = "activities" }: PurposePanelProps) {
  const queryClient = useQueryClient();
  const { currentUser, token } = useAuth();
  const accent = purposeColorById[purposeId] ?? brandTheme.burgundy;
  const cardBg = "hsl(0 0% 100%)";
  const panelText = purposeId === 3 ? "hsl(0 0% 4%)" : accent;
  const accentOn = purposeId === 3 ? "hsl(0 0% 100%)" : "hsl(43 100% 92%)";
  const shellBg = "hsl(43 86% 84%)";
  const shellBgAlt = "hsl(43 40% 60%)";

  const [stats, setStats] = useState<{ connected: number; registered: number } | null>(null);
  useEffect(() => {
    const refresh = () => setStats(getStats());
    refresh();
    return subscribeToLocalData(refresh);
  }, []);

  const [openActivities, setOpenActivities] = useState<Set<number>>(new Set());
  const [expandedActivityComments, setExpandedActivityComments] = useState<Set<number>>(new Set());
  const [expandedMessageComments, setExpandedMessageComments] = useState<Set<number>>(new Set());
  const [approvingActivityId, setApprovingActivityId] = useState<number | null>(null);
  const [approvingMessageId, setApprovingMessageId] = useState<number | null>(null);
  const [disapprovingActivityId, setDisapprovingActivityId] = useState<number | null>(null);
  const [disapprovingMessageId, setDisapprovingMessageId] = useState<number | null>(null);
  const [completingActivityId, setCompletingActivityId] = useState<number | null>(null);
  const [uncompletingActivityId, setUncompletingActivityId] = useState<number | null>(null);
  const [pendingCompleteForActivityId, setPendingCompleteForActivityId] = useState<number | null>(null);
  const [deletingActivityId, setDeletingActivityId] = useState<number | null>(null);
  const [deletingMessageId, setDeletingMessageId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"activities" | "messages">(initialTab);
  const [newActivitiesCount, setNewActivitiesCount] = useState(0);
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const [joiningActivityId, setJoiningActivityId] = useState<number | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const { data: activities, isLoading: isLoadingActivities } = useGetActivities(purposeId, {
    query: { queryKey: [...getGetActivitiesQueryKey(purposeId), currentUser?.id ?? "anon"], refetchInterval: 4000 },
  });

  const { data: messages, isLoading: isLoadingMessages } = useGetMessages(purposeId, {
    query: { queryKey: [...getGetMessagesQueryKey(purposeId), currentUser?.id ?? "anon"], refetchInterval: 4000 },
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

  // ── Comment-badge helpers ────────────────────────────────────────────────────
  // Store the last-seen comment count in localStorage so we can show a badge
  // when new comments appear on an activity or message.
  const cmtSeenKey = (type: "activity" | "message", id: number) =>
    type === "activity" ? `iskcon_seen_cmts_act_${id}` : `iskcon_seen_cmts_msg_${id}`;

  const hasNewComments = (type: "activity" | "message", id: number, currentCount: number): boolean => {
    if (currentCount === 0) return false;
    const seen = parseInt(localStorage.getItem(cmtSeenKey(type, id)) ?? "0", 10);
    return currentCount > seen;
  };

  const markCommentsSeen = (type: "activity" | "message", id: number, currentCount: number) => {
    localStorage.setItem(cmtSeenKey(type, id), String(currentCount));
  };

  const toggleComments = (id: number, type: "activity" | "message", commentCount = 0) => {
    const setter = type === "activity" ? setExpandedActivityComments : setExpandedMessageComments;
    setter(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      // Always mark seen on toggle — clears badge whether opening or closing
      markCommentsSeen(type, id, commentCount);
      return next;
    });
  };

  const approveActivity = async (id: number) => {
    if (!token) return;
    setApprovingActivityId(id);
    try {
      approveActivityLocal(id);
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
      disapproveActivityLocal(id);
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
      approveMessageLocal(id);
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
      disapproveMessageLocal(id);
      queryClient.invalidateQueries({ queryKey: getGetMessagesQueryKey(purposeId) });
      toast.success("Message moved back to pending");
    } catch {
      toast.error("Failed to disapprove message");
    } finally {
      setDisapprovingMessageId(null);
    }
  };

  const completeActivity = async (id: number, completedPhotoDataUrl?: string) => {
    if (!token) return;
    setCompletingActivityId(id);
    try {
      completeActivityLocal(id, completedPhotoDataUrl);
      queryClient.invalidateQueries({ queryKey: getGetActivitiesQueryKey(purposeId) });
      toast.success("Activity marked as done!");
    } catch {
      toast.error("Failed to mark activity as done");
    } finally {
      setCompletingActivityId(null);
    }
  };

  const uncompleteActivity = async (id: number) => {
    if (!token) return;
    setUncompletingActivityId(id);
    try {
      uncompleteActivityLocal(id);
      queryClient.invalidateQueries({ queryKey: getGetActivitiesQueryKey(purposeId) });
      toast.success("Activity unmarked as done");
    } catch {
      toast.error("Failed to unmark activity");
    } finally {
      setUncompletingActivityId(null);
    }
  };

  const joinActivity = async (id: number) => {
    if (!token) return;
    setJoiningActivityId(id);
    try {
      joinActivityLocal(id);
      queryClient.invalidateQueries({ queryKey: getGetActivitiesQueryKey(purposeId) });
      toast.success("You joined this activity!");
    } catch (error) {
      if (error instanceof Error && error.message === "Activity is full") {
        toast.error("Activity is full");
      } else {
        toast.error("Failed to join activity");
      }
    } finally {
      setJoiningActivityId(null);
    }
  };

  const leaveActivity = async (id: number) => {
    if (!token) return;
    setJoiningActivityId(id);
    try {
      leaveActivityLocal(id);
      queryClient.invalidateQueries({ queryKey: getGetActivitiesQueryKey(purposeId) });
      toast.success("You left this activity");
    } catch {
      toast.error("Failed to leave activity");
    } finally {
      setJoiningActivityId(null);
    }
  };

  const handlePhotoInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !pendingCompleteForActivityId) return;
    const reader = new FileReader();
    reader.onload = () => {
      completeActivity(pendingCompleteForActivityId, reader.result as string);
      setPendingCompleteForActivityId(null);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }, [pendingCompleteForActivityId, token]);

  const onActivitySubmit = (data: z.infer<typeof activitySchema>) => {
    const payload = {
      ...data,
      scheduledAt: new Date(data.scheduledAt).toISOString(),
    };
    createActivity.mutate({ purposeId, data: payload as any }, {
      onSuccess: () => {
        toast.success("Thank you! We've received your activity proposal. It will be visible once validated by our team.", { duration: 6000 });
        activityForm.reset({ title: "", description: "", authorName: currentUser?.fullName ?? "", scheduledAt: "", place: "", minParticipants: 3, maxParticipants: undefined });
        queryClient.invalidateQueries({ queryKey: getGetActivitiesQueryKey(purposeId) });
      },
      onError: () => toast.error("Failed to propose activity"),
    });
  };

  const onMessageSubmit = (data: z.infer<typeof messageSchema>) => {
    createMessage.mutate({ purposeId, data }, {
      onSuccess: () => {
        toast.success("Thank you! We've received your message. It will be visible once validated by our team.", { duration: 6000 });
        messageForm.reset({ content: "", authorName: currentUser?.fullName ?? "" });
        queryClient.invalidateQueries({ queryKey: getGetMessagesQueryKey(purposeId) });
      },
      onError: () => toast.error("Failed to share message"),
    });
  };

  const deleteActivity = async (id: number) => {
    if (!token) return;
    setDeletingActivityId(id);
    try {
      deleteActivityLocal(id);
      queryClient.invalidateQueries({ queryKey: [...getGetActivitiesQueryKey(purposeId), currentUser?.id ?? "anon"] });
      toast.success("Activity deleted");
    } catch {
      toast.error("Failed to delete activity");
    } finally {
      setDeletingActivityId(null);
    }
  };

  const deleteMessage = async (id: number) => {
    if (!token) return;
    setDeletingMessageId(id);
    try {
      deleteMessageLocal(id);
      queryClient.invalidateQueries({ queryKey: [...getGetMessagesQueryKey(purposeId), currentUser?.id ?? "anon"] });
      toast.success("Message deleted");
    } catch {
      toast.error("Failed to delete message");
    } finally {
      setDeletingMessageId(null);
    }
  };

  // ── Derived lists ───────────────────────────────────────────────────────────
  const approvedActivities = (activities ?? []).filter((a: any) => a.approved === true);
  const pendingActivities  = (activities ?? []).filter((a: any) => a.approved === false);
  const approvedMessages   = (messages  ?? []).filter((m: any) => m.approved === true);
  const pendingMessages    = (messages  ?? []).filter((m: any) => m.approved === false);

  // ── Badge tracking ──────────────────────────────────────────────────────────
  // Admin sees badges for PENDING items (need validation).
  // Members see badges for APPROVED items (new content to discover).
  const isAdmin = !!currentUser?.isAdmin;
  const seenActsKey = isAdmin ? `iskcon_admin_acts_${purposeId}` : `iskcon_seen_acts_${purposeId}`;
  const seenMsgsKey = isAdmin ? `iskcon_admin_msgs_${purposeId}` : `iskcon_seen_msgs_${purposeId}`;

  // The IDs to track depend on role
  const trackedActivities = isAdmin ? pendingActivities : approvedActivities;
  const trackedMessages   = isAdmin ? pendingMessages   : approvedMessages;
  const trackedActivityIds = trackedActivities.map((a: any) => a.id);
  const trackedMessageIds  = trackedMessages.map((m: any) => m.id);

  // Keep older variable names for backwards compat with markAllSeen calls below
  const approvedActivityIds = trackedActivityIds;
  const approvedMessageIds  = trackedMessageIds;

  // When on activities tab and data updates → mark seen immediately
  useEffect(() => {
    if (activeTab === "activities" && trackedActivityIds.length > 0) {
      markAllSeen(seenActsKey, trackedActivityIds);
      setNewActivitiesCount(0);
    } else if (activeTab !== "activities") {
      setNewActivitiesCount(countNew(trackedActivityIds, seenActsKey));
    }
  }, [JSON.stringify(trackedActivityIds), activeTab]);

  useEffect(() => {
    if (activeTab === "messages" && trackedMessageIds.length > 0) {
      markAllSeen(seenMsgsKey, trackedMessageIds);
      setNewMessagesCount(0);
    } else if (activeTab !== "messages") {
      setNewMessagesCount(countNew(trackedMessageIds, seenMsgsKey));
    }
  }, [JSON.stringify(trackedMessageIds), activeTab]);

  const handleTabChange = (value: string) => {
    setActiveTab(value as "activities" | "messages");
    if (value === "activities") {
      markAllSeen(seenActsKey, trackedActivityIds);
      setNewActivitiesCount(0);
    } else if (value === "messages") {
      markAllSeen(seenMsgsKey, trackedMessageIds);
      setNewMessagesCount(0);
    }
  };

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab, purposeId]);

  return (
    <div className="mt-2">
      {/* Quote block */}
      <div className="px-6 py-6">
        <div className="text-center">
          <p className="font-sans leading-relaxed text-center" style={{ fontSize: "1.12rem", color: brandTheme.creamSoft }}>{officialText}</p>
        </div>
        <div className="my-5 mx-auto w-24 h-px" style={{ background: "hsl(43 100% 90% / 0.9)" }} />
        <p className="font-serif font-semibold leading-relaxed" style={{ fontSize: "0.98rem", color: "hsl(0 0% 4%)" }}>{description}</p>
      </div>

      {/* Community section */}
      <div className="px-4 pt-4 pb-8 rounded-t-[2rem] shadow-[0_-10px_30px_rgba(93,37,49,0.18)]"
        style={{ background: shellBg }}>
        {/* R logo circle + stats, centered */}
        <div className="flex items-center justify-center gap-3 pt-3 pb-4">
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

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="w-full grid grid-cols-2 h-12 rounded-2xl p-1 mb-6"
            style={{ background: shellBgAlt, border: `1px solid ${panelText}22`, boxShadow: "0 8px 20px rgba(94,53,37,0.10)" }}>
            <TabsTrigger value="activities" className="rounded-xl font-semibold font-sans text-sm transition-all data-[state=active]:shadow-sm" style={{ color: "hsl(0 0% 100%)", background: activeTab === "activities" ? accent : "transparent" }}>
              <CalendarDays className="w-4 h-4 mr-1.5" /> Activities
              {newActivitiesCount > 0 && (
                <span className="ml-1.5 min-w-[18px] h-[18px] inline-flex items-center justify-center text-[10px] font-bold text-white rounded-full px-1" style={{ background: "hsl(0 80% 48%)" }}>
                  {newActivitiesCount > 9 ? "9+" : newActivitiesCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="messages" className="rounded-xl font-semibold font-sans text-sm transition-all data-[state=active]:shadow-sm" style={{ color: "hsl(0 0% 100%)", background: activeTab === "messages" ? accent : "transparent" }}>
              <MessageCircle className="w-4 h-4 mr-1.5" /> Messages
              {newMessagesCount > 0 && (
                <span className="ml-1.5 min-w-[18px] h-[18px] inline-flex items-center justify-center text-[10px] font-bold text-white rounded-full px-1" style={{ background: "hsl(0 80% 48%)" }}>
                  {newMessagesCount > 9 ? "9+" : newMessagesCount}
                </span>
              )}
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
                      <p className="font-serif font-bold leading-snug mb-1" style={{ fontSize: "0.95rem", color: panelText }}>{activity.title}</p>
                      <p className="font-sans text-sm leading-relaxed mb-2" style={{ color: "hsl(334 30% 30%)" }}>{activity.description}</p>
                      {(activity.scheduledAt || activity.place) && (
                        <div className="flex flex-wrap gap-3 mb-3 text-xs font-sans" style={{ color: "hsl(14 40% 45%)" }}>
                          {activity.scheduledAt && <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" />{format(new Date(activity.scheduledAt), "EEE d MMM yyyy, HH:mm")}</span>}
                          {activity.place && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{activity.place}</span>}
                          {activity.minParticipants && <span className="flex items-center gap-1"><Users className="w-3 h-3" />{activity.minParticipants}{activity.maxParticipants ? `–${activity.maxParticipants}` : "+"} participants</span>}
                        </div>
                      )}
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="font-sans text-xs font-semibold" style={{ color: panelText }}>By {activity.authorName}</span>
                          <span className="font-sans text-xs" style={{ color: "hsl(14 30% 55%)" }}>{format(new Date(activity.createdAt), "MMM d, yyyy")}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <button onClick={() => deleteActivity(activity.id)} disabled={deletingActivityId === activity.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-sans font-semibold text-xs border transition-opacity"
                            style={{ borderColor: "hsl(14 30% 65% / 0.5)", color: "hsl(14 40% 45%)", background: "transparent", opacity: deletingActivityId === activity.id ? 0.5 : 1 }}>
                            {deletingActivityId === activity.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                            Delete
                          </button>
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
                style={{ background: `${accent}22`, borderColor: `${panelText}33` }}>
                <CalendarDays className="w-8 h-8 mx-auto mb-3" style={{ color: `${panelText}88` }} />
                <p className="font-sans text-sm" style={{ color: panelText }}>No activities yet.</p>
              </div>
            ) : (
              <div className="space-y-3 mb-3">
                {approvedActivities.map((activity: any, i: number) => {
                  const isOpen = openActivities.has(activity.id);
                  const commentsOpen = expandedActivityComments.has(activity.id);
                  const isDone = !!activity.completedAt;
                  return (
                    <div key={activity.id} className="rounded-2xl overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-2"
                      style={{
                        background: isDone ? accent : cardBg,
                        border: isDone ? "none" : "1px solid hsl(14 25% 72% / 0.35)",
                        animationDelay: `${i * 50}ms`,
                        animationFillMode: "both",
                      }}>

                      {/* Completion photo */}
                      {isDone && activity.completedPhotoDataUrl && (
                        <img src={activity.completedPhotoDataUrl} alt="Activity photo"
                          className="w-full object-cover" style={{ maxHeight: 200 }} />
                      )}

                      {/* Top bar — only on non-done cards */}
                      {!isDone && <div style={{ height: 3, background: accent }} />}

                      {/* Title row — always visible */}
                      <button type="button" onClick={() => toggleActivity(activity.id)}
                        className="w-full flex items-center gap-3 px-4 py-3.5 text-left">
                        {isDone
                          ? <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "rgba(255,255,255,0.85)" }} />
                          : <CalendarDays className="w-4 h-4 shrink-0" style={{ color: "hsl(14 40% 50%)" }} />}
                        <div className="flex-1 min-w-0">
                          <span className="font-serif font-bold leading-snug block" style={{ fontSize: "0.95rem", color: isDone ? "rgba(255,255,255,0.97)" : panelText }}>
                            {activity.title}
                          </span>
                          {/* Always-visible meta: date · place · participants */}
                          {(activity.scheduledAt || activity.place || activity.minParticipants || activity.participantCount > 0) && (
                            <span className="font-sans text-xs flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5" style={{ color: isDone ? "rgba(255,255,255,0.7)" : "hsl(14 40% 48%)" }}>
                              {activity.scheduledAt && (
                                <span className="flex items-center gap-0.5">
                                  <CalendarDays className="w-3 h-3" />{format(new Date(activity.scheduledAt), "EEE d MMM, HH:mm")}
                                </span>
                              )}
                              {activity.place && (
                                <span className="flex items-center gap-0.5">
                                  <MapPin className="w-3 h-3" />{activity.place}
                                </span>
                              )}
                              {(activity.minParticipants || activity.maxParticipants) && (
                                <span className="flex items-center gap-0.5">
                                  <Users className="w-3 h-3" />
                                  {activity.participantCount}
                                  {activity.maxParticipants
                                    ? `/${activity.maxParticipants}`
                                    : activity.minParticipants
                                    ? ` (min ${activity.minParticipants})`
                                    : ""}
                                  {" "}joined
                                </span>
                              )}
                            </span>
                          )}
                        </div>
                        {/* Right-side: join button + expand */}
                        <div className="flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                          {/* Full badge — only show when max is set */}
                          {activity.maxParticipants && !isDone && activity.participantCount >= activity.maxParticipants && (
                            <span className="font-sans text-xs px-1.5 py-0.5 rounded-full" style={{
                              background: "hsl(358 52% 42% / 0.12)",
                              color: "hsl(358 52% 40%)",
                            }}>
                              Full
                            </span>
                          )}
                          {/* Join / Leave — signed-in, not done */}
                          {currentUser && !isDone && !currentUser.isAdmin && (
                            activity.isJoined ? (
                              <button
                                onClick={() => leaveActivity(activity.id)}
                                disabled={joiningActivityId === activity.id}
                                className="font-sans text-xs font-semibold px-3 py-1 rounded-full border transition-colors"
                                style={{ borderColor: "hsl(14 30% 65% / 0.5)", color: "hsl(337 26% 38%)", background: "hsl(14 20% 90%)" }}>
                                {joiningActivityId === activity.id ? <Loader2 className="w-3 h-3 animate-spin inline" /> : "Leave"}
                              </button>
                            ) : (
                              <button
                                onClick={() => joinActivity(activity.id)}
                                disabled={joiningActivityId === activity.id || (activity.maxParticipants && activity.participantCount >= activity.maxParticipants)}
                                className="font-sans text-xs font-semibold px-3 py-1 rounded-full transition-colors"
                                style={{
                                  background: (activity.maxParticipants && activity.participantCount >= activity.maxParticipants) ? "hsl(14 20% 80%)" : accent,
                                  color: (activity.maxParticipants && activity.participantCount >= activity.maxParticipants) ? "hsl(14 40% 45%)" : "white",
                                  opacity: joiningActivityId === activity.id ? 0.6 : 1,
                                }}>
                                {joiningActivityId === activity.id ? <Loader2 className="w-3 h-3 animate-spin inline" /> : activity.maxParticipants && activity.participantCount >= activity.maxParticipants ? "Full" : "Join"}
                              </button>
                            )
                          )}
                        </div>
                        {/* Expand/collapse arrow (separate click zone handled by button parent) */}
                        {isDone
                          ? <span className="font-sans text-xs font-bold px-2 py-0.5 rounded-full shrink-0" style={{ background: "rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.9)" }}>Done</span>
                          : currentUser
                            ? isOpen ? <ChevronUp className="w-4 h-4 shrink-0" style={{ color: "hsl(14 40% 50%)" }} />
                                     : <ChevronDown className="w-4 h-4 shrink-0" style={{ color: "hsl(14 40% 50%)" }} />
                            : <Lock className="w-3.5 h-3.5 shrink-0" style={{ color: "hsl(14 40% 55%)", opacity: 0.55 }} />}
                      </button>

                      {/* Expanded content */}
                      {isOpen && currentUser && (
                        <div className="px-4 pb-3" style={{ borderTop: `1px solid ${isDone ? "rgba(255,255,255,0.18)" : "hsl(14 25% 72% / 0.25)"}` }}>
                          <p className="font-sans text-sm leading-relaxed mt-3 mb-2" style={{ color: isDone ? "rgba(255,255,255,0.85)" : "hsl(14 50% 28%)" }}>
                            {activity.description}
                          </p>
                          {activity.minParticipants && (
                            <div className="flex items-center gap-1 mb-3 font-sans text-xs" style={{ color: isDone ? "rgba(255,255,255,0.7)" : "hsl(14 40% 45%)" }}>
                              <Users className="w-3 h-3" />
                              {activity.minParticipants} – {activity.maxParticipants ?? "?"} participants
                            </div>
                          )}
                          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                            <div className="flex items-center gap-3 text-xs" style={{ color: isDone ? "rgba(255,255,255,0.7)" : "hsl(14 35% 48%)" }}>
                              <span className="font-semibold">By {activity.authorName}</span>
                              <span>{format(new Date(activity.createdAt), "MMM d, yyyy")}</span>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              {currentUser.isAdmin && isDone && (
                                <>
                                  <button
                                    onClick={() => { setPendingCompleteForActivityId(activity.id); photoInputRef.current?.click(); }}
                                    disabled={completingActivityId === activity.id}
                                    className="inline-flex items-center gap-1 font-sans text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors"
                                    style={{ borderColor: "rgba(255,255,255,0.5)", color: "rgba(255,255,255,0.9)", background: "rgba(255,255,255,0.12)" }}>
                                    <ImagePlus className="w-3 h-3" />
                                    {activity.completedPhotoDataUrl ? "Update Photo" : "Add Photo"}
                                  </button>
                                  <button onClick={() => uncompleteActivity(activity.id)} disabled={uncompletingActivityId === activity.id}
                                    className="inline-flex items-center gap-1 font-sans text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors"
                                    style={{ borderColor: "rgba(255,255,255,0.5)", color: "rgba(255,255,255,0.9)", background: "rgba(255,255,255,0.12)" }}>
                                    {uncompletingActivityId === activity.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}
                                    Unmark
                                  </button>
                                </>
                              )}
                              {currentUser.isAdmin && !isDone && (
                                <>
                                  <button
                                    onClick={() => completeActivity(activity.id)}
                                    disabled={completingActivityId === activity.id}
                                    className="inline-flex items-center gap-1 font-sans text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
                                    style={{ background: "hsl(150 42% 36%)", color: "white" }}>
                                    {completingActivityId === activity.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                                    Mark as Done
                                  </button>
                                  <button
                                    onClick={() => { setPendingCompleteForActivityId(activity.id); photoInputRef.current?.click(); }}
                                    disabled={completingActivityId === activity.id}
                                    className="inline-flex items-center gap-1 font-sans text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors"
                                    style={{ borderColor: "hsl(14 30% 65% / 0.5)", color: "hsl(14 42% 42%)", background: "transparent" }}>
                                    <Camera className="w-3 h-3" />
                                    Done + Photo
                                  </button>
                                  <button onClick={() => disapproveActivity(activity.id)} disabled={disapprovingActivityId === activity.id}
                                    className="inline-flex items-center gap-1 font-sans text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors"
                                    style={{ borderColor: "hsl(358 48% 50%)", color: "hsl(358 52% 40%)", background: "transparent" }}>
                                    {disapprovingActivityId === activity.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}
                                    Unpublish
                                  </button>
                                  <button onClick={() => deleteActivity(activity.id)} disabled={deletingActivityId === activity.id}
                                    className="inline-flex items-center gap-1 font-sans text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors"
                                    style={{ borderColor: "hsl(14 30% 65% / 0.5)", color: "hsl(14 40% 45%)", background: "transparent" }}>
                                    {deletingActivityId === activity.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                                    Delete
                                  </button>
                                </>
                              )}
                              <button onClick={() => toggleComments(activity.id, "activity", activity.commentCount ?? 0)}
                                className="inline-flex items-center gap-1 font-sans text-xs font-semibold px-3 py-1.5 rounded-full transition-colors relative"
                                style={{
                                  background: isDone ? (commentsOpen ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.12)") : (commentsOpen ? "hsl(14 18% 88%)" : "transparent"),
                                  color: isDone ? "rgba(255,255,255,0.9)" : "hsl(14 42% 42%)",
                                  border: isDone ? "1px solid rgba(255,255,255,0.3)" : "1px solid hsl(14 25% 68% / 0.45)",
                                }}>
                                <MessageSquare className="w-3 h-3" />
                                {(activity.commentCount ?? 0) > 0 && (
                                  <span className="font-sans text-xs">{activity.commentCount}</span>
                                )}
                                {!commentsOpen && hasNewComments("activity", activity.id, activity.commentCount ?? 0) && (
                                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full" style={{ background: "hsl(358 72% 52%)" }} />
                                )}
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
            <div className="rounded-2xl p-5 shadow relative overflow-hidden"
              style={{ background: cardBg, border: "1px solid hsl(14 25% 72% / 0.35)" }}>
              <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl" style={{ background: accent }} />
              <h3 className="font-serif text-lg font-bold mb-1" style={{ color: panelText }}>Propose an Activity</h3>
              <p className="font-sans text-xs mb-4" style={{ color: "hsl(14 38% 50%)" }}>Your proposal will appear once validated</p>
              {!currentUser ? (
                <SignInPrompt action="propose an activity" />
              ) : (
                <Form {...activityForm}>
                  <form onSubmit={activityForm.handleSubmit(onActivitySubmit)} className="space-y-4">
                    <FormField control={activityForm.control} name="title" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-sans text-sm" style={{ color: panelText }}>Activity Title</FormLabel>
                        <FormControl>
                          <input placeholder="E.g., Sunday Feast Program"
                            className="w-full h-11 px-4 rounded-xl font-sans text-sm border focus:outline-none focus:ring-2 focus:ring-primary/30"
                            style={{ background: "hsl(40 40% 96%)", borderColor: "hsl(14 30% 65% / 0.4)", color: "hsl(319 32% 19%)" }}
                            {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={activityForm.control} name="description" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-sans text-sm" style={{ color: panelText }}>Description</FormLabel>
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
                        <FormLabel className="font-sans text-sm flex items-center gap-1" style={{ color: panelText }}>
                          <CalendarDays className="w-3.5 h-3.5" /> Date &amp; Time
                        </FormLabel>
                        <FormControl>
                          <input type="datetime-local"
                            className="w-full h-11 px-4 rounded-xl font-sans text-sm border focus:outline-none focus:ring-2 focus:ring-primary/30"
                            style={{ background: "hsl(40 40% 96%)", borderColor: "hsl(14 30% 65% / 0.4)", color: "hsl(319 32% 19%)" }}
                            {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={activityForm.control} name="place" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-sans text-sm flex items-center gap-1" style={{ color: panelText }}>
                          <MapPin className="w-3.5 h-3.5" /> Place
                        </FormLabel>
                        <FormControl>
                          <input placeholder="E.g., Temple room, Radhadesh"
                            className="w-full h-11 px-4 rounded-xl font-sans text-sm border focus:outline-none focus:ring-2 focus:ring-primary/30"
                            style={{ background: "hsl(40 40% 96%)", borderColor: "hsl(14 30% 65% / 0.4)", color: "hsl(319 32% 19%)" }}
                            {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <div className="grid grid-cols-2 gap-3">
                      <FormField control={activityForm.control} name="minParticipants" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-sans text-sm flex items-center gap-1" style={{ color: panelText }}>
                            <Users className="w-3.5 h-3.5" /> Min participants
                          </FormLabel>
                          <FormControl>
                            <input type="number" min={3} placeholder="3"
                              className="w-full h-11 px-4 rounded-xl font-sans text-sm border focus:outline-none focus:ring-2 focus:ring-primary/30"
                              style={{ background: "hsl(40 40% 96%)", borderColor: "hsl(14 30% 65% / 0.4)", color: "hsl(319 32% 19%)" }}
                              {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={activityForm.control} name="maxParticipants" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-sans text-sm" style={{ color: panelText }}>Max participants</FormLabel>
                          <FormControl>
                            <input type="number" min={3} placeholder="Optional"
                              className="w-full h-11 px-4 rounded-xl font-sans text-sm border focus:outline-none focus:ring-2 focus:ring-primary/30"
                              style={{ background: "hsl(40 40% 96%)", borderColor: "hsl(14 30% 65% / 0.4)", color: "hsl(319 32% 19%)" }}
                              {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: shellBgAlt }}>
                      <span className="font-sans text-xs" style={{ color: "hsl(14 40% 48%)" }}>Posting as</span>
                      <span className="font-sans text-sm font-semibold" style={{ color: "hsl(319 32% 19%)" }}>{currentUser.fullName}</span>
                    </div>
                    <Button type="submit" className="w-full h-11 rounded-xl font-bold font-sans tracking-wide shadow-sm"
                      disabled={createActivity.isPending} style={{ background: accent, color: "hsl(0 0% 100%)", border: `1px solid ${accent}` }}>
                      {createActivity.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                      Send for Validation
                    </Button>
                  </form>
                </Form>
              )}
            </div>
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
                      <p className="font-serif italic leading-relaxed mb-3" style={{ fontSize: "0.92rem", color: panelText }}>
                        "{message.content}"
                      </p>
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="font-sans text-xs font-semibold" style={{ color: panelText }}>— {message.authorName}</span>
                          <span className="font-sans text-xs" style={{ color: "hsl(14 30% 55%)" }}>{format(new Date(message.createdAt), "MMM d, yyyy")}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <button onClick={() => deleteMessage(message.id)} disabled={deletingMessageId === message.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-sans font-semibold text-xs border transition-opacity"
                            style={{ borderColor: "hsl(14 30% 65% / 0.5)", color: "hsl(14 40% 45%)", background: "transparent", opacity: deletingMessageId === message.id ? 0.5 : 1 }}>
                            {deletingMessageId === message.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                            Delete
                          </button>
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
                style={{ background: `${accent}22`, borderColor: `${panelText}33` }}>
                <MessageCircle className="w-8 h-8 mx-auto mb-3" style={{ color: `${panelText}88` }} />
                <p className="font-sans text-sm" style={{ color: panelText }}>No messages yet. Share your reflections!</p>
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
                        <p className="font-serif italic text-base leading-relaxed mb-4" style={{ color: panelText }}>
                          "{message.content}"
                        </p>
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-3 text-xs" style={{ color: "hsl(14 40% 50%)" }}>
                            <span className="font-bold" style={{ color: panelText }}>— {message.authorName}</span>
                            <span>{format(new Date(message.createdAt), "MMM d, yyyy")}</span>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            {currentUser?.isAdmin && (
                              <>
                                <button onClick={() => disapproveMessage(message.id)} disabled={disapprovingMessageId === message.id}
                                  className="inline-flex items-center gap-1 font-sans text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors"
                                  style={{ borderColor: "hsl(358 48% 50%)", color: "hsl(358 52% 40%)", background: "transparent" }}>
                                  {disapprovingMessageId === message.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}
                                  Unpublish
                                </button>
                                <button onClick={() => deleteMessage(message.id)} disabled={deletingMessageId === message.id}
                                  className="inline-flex items-center gap-1 font-sans text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors"
                                  style={{ borderColor: "hsl(14 30% 65% / 0.5)", color: "hsl(14 40% 45%)", background: "transparent" }}>
                                  {deletingMessageId === message.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                                  Delete
                                </button>
                              </>
                            )}
                            <button onClick={() => toggleComments(message.id, "message", message.commentCount ?? 0)}
                              className="inline-flex items-center gap-1 font-sans text-xs font-semibold px-3 py-1.5 rounded-full transition-colors relative"
                              style={{ background: commentsOpen ? "hsl(14 18% 88%)" : "transparent", color: "hsl(14 42% 42%)", border: "1px solid hsl(14 25% 68% / 0.45)" }}>
                              <MessageSquare className="w-3 h-3" />
                              {(message.commentCount ?? 0) > 0 && (
                                <span className="font-sans text-xs">{message.commentCount}</span>
                              )}
                              {!commentsOpen && hasNewComments("message", message.id, message.commentCount ?? 0) && (
                                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full" style={{ background: "hsl(358 72% 52%)" }} />
                              )}
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
              <h3 className="font-serif text-lg font-bold mb-1" style={{ color: panelText }}>Share a Message</h3>
              <p className="font-sans text-xs mb-4" style={{ color: "hsl(14 38% 50%)" }}>Your message will appear once validated</p>
              {!currentUser ? (
                <SignInPrompt action="share a message" />
              ) : (
                <Form {...messageForm}>
                  <form onSubmit={messageForm.handleSubmit(onMessageSubmit)} className="space-y-4">
                    <FormField control={messageForm.control} name="content" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-sans text-sm" style={{ color: panelText }}>Your Message</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Share your realizations or thoughts…"
                            className="resize-none min-h-[110px] rounded-xl font-sans"
                            style={{ background: "hsl(40 40% 96%)", borderColor: "hsl(14 30% 65% / 0.4)" }}
                            {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: shellBgAlt }}>
                      <span className="font-sans text-xs" style={{ color: "hsl(14 40% 48%)" }}>Posting as</span>
                      <span className="font-sans text-sm font-semibold" style={{ color: "hsl(319 32% 19%)" }}>{currentUser.fullName}</span>
                    </div>
                    <Button type="submit" className="w-full h-11 rounded-xl font-bold font-sans tracking-wide shadow-sm"
                      disabled={createMessage.isPending} style={{ background: accent, color: "hsl(0 0% 100%)", border: `1px solid ${accent}` }}>
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
      {/* Hidden file input for completion photos */}
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handlePhotoInputChange}
      />
    </div>
  );
}

function SignInPrompt({ action }: { action: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-5 text-center">
      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "hsl(26 68% 42% / 0.12)" }}>
        <Lock className="w-5 h-5" style={{ color: "hsl(343 51% 38%)" }} />
      </div>
      <p className="font-sans text-sm" style={{ color: "hsl(14 40% 42%)" }}>Sign in to {action}</p>
      <Link href="/register" className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full font-sans font-semibold text-sm"
        style={{ background: "hsl(343 51% 38%)", color: "hsl(43 100% 86%)" }}>
        Sign in / Register
      </Link>
    </div>
  );
}
