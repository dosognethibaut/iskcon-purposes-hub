import { useState, useCallback } from "react";
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
} from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/context/AuthContext";
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
});

const messageSchema = z.object({
  content: z.string().min(1, "Message cannot be empty"),
  authorName: z.string().min(1, "Your name is required"),
});

const accentByTitle: Record<string, string> = {
  "Accessing":     "hsl(14 52% 38%)",
  "Learning":      "hsl(17 44% 35%)",
  "Community":     "hsl(220 60% 44%)",
  "Applying":      "hsl(14 18% 33%)",
  "Holy Place":    "hsl(14 8% 22%)",
  "Simple Living": "hsl(168 42% 33%)",
  "Sharing":       "hsl(14 40% 30%)",
};

interface Comment {
  id: number;
  messageId: number;
  userId: number;
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

export default function PurposePanel({ purposeId, title, officialText, description }: PurposePanelProps) {
  const queryClient = useQueryClient();
  const { currentUser, token } = useAuth();
  const accent = accentByTitle[title] ?? "hsl(26 68% 42%)";

  const [openActivities, setOpenActivities] = useState<Set<number>>(new Set());
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());
  const [commentsByMsg, setCommentsByMsg] = useState<Record<number, Comment[]>>({});
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
  const [commentSubmitting, setCommentSubmitting] = useState<number | null>(null);
  const [approvingId, setApprovingId] = useState<number | null>(null);

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
    defaultValues: { title: "", description: "", authorName: currentUser?.fullName ?? "" },
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

  const fetchComments = useCallback(async (messageId: number) => {
    try {
      const res = await fetch(`${API_BASE}/api/purposes/${purposeId}/messages/${messageId}/comments`);
      if (!res.ok) return;
      const data: Comment[] = await res.json();
      setCommentsByMsg(prev => ({ ...prev, [messageId]: data }));
    } catch { /* silent */ }
  }, [purposeId]);

  const toggleComments = (messageId: number) => {
    setExpandedComments(prev => {
      const next = new Set(prev);
      if (next.has(messageId)) {
        next.delete(messageId);
      } else {
        next.add(messageId);
        fetchComments(messageId);
      }
      return next;
    });
  };

  const submitComment = async (messageId: number) => {
    const content = (commentInputs[messageId] ?? "").trim();
    if (!content || !token) return;
    setCommentSubmitting(messageId);
    try {
      const res = await fetch(`${API_BASE}/api/purposes/${purposeId}/messages/${messageId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error();
      setCommentInputs(prev => ({ ...prev, [messageId]: "" }));
      await fetchComments(messageId);
      toast.success("Comment added");
    } catch {
      toast.error("Failed to add comment");
    } finally {
      setCommentSubmitting(null);
    }
  };

  const approveMessage = async (messageId: number) => {
    if (!token) return;
    setApprovingId(messageId);
    try {
      const res = await fetch(`${API_BASE}/api/purposes/${purposeId}/messages/${messageId}/approve`, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      queryClient.invalidateQueries({ queryKey: getGetMessagesQueryKey(purposeId) });
      toast.success("Message approved and published");
    } catch {
      toast.error("Failed to approve message");
    } finally {
      setApprovingId(null);
    }
  };

  const onActivitySubmit = (data: z.infer<typeof activitySchema>) => {
    createActivity.mutate({ purposeId, data }, {
      onSuccess: () => {
        toast.success("Activity proposed successfully");
        activityForm.reset({ title: "", description: "", authorName: currentUser?.fullName ?? "" });
        queryClient.invalidateQueries({ queryKey: getGetActivitiesQueryKey(purposeId) });
      },
      onError: () => toast.error("Failed to propose activity"),
    });
  };

  const onMessageSubmit = (data: z.infer<typeof messageSchema>) => {
    createMessage.mutate({ purposeId, data }, {
      onSuccess: () => {
        toast.success("Your message has been sent for validation. It will appear once approved.", { duration: 5000 });
        messageForm.reset({ content: "", authorName: currentUser?.fullName ?? "" });
        queryClient.invalidateQueries({ queryKey: getGetMessagesQueryKey(purposeId) });
      },
      onError: () => toast.error("Failed to share message"),
    });
  };

  const approvedMessages = (messages ?? []).filter((m: any) => m.approved === true);
  const pendingMessages = (messages ?? []).filter((m: any) => m.approved === false);

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
        <div className="flex items-center gap-3 py-4">
          <div className="flex-1 h-px" style={{ background: "hsl(14 30% 60% / 0.25)" }} />
          <span className="font-sans text-xs uppercase tracking-widest" style={{ color: "hsl(14 40% 50%)" }}>Community</span>
          <div className="flex-1 h-px" style={{ background: "hsl(14 30% 60% / 0.25)" }} />
        </div>

        <Tabs defaultValue="activities" className="w-full">
          <TabsList className="w-full grid grid-cols-2 h-12 rounded-2xl p-1 mb-6" style={{ background: "hsl(38 40% 80%)", border: "1px solid hsl(14 30% 60% / 0.2)" }}>
            <TabsTrigger value="activities" className="rounded-xl font-semibold font-sans text-sm transition-all data-[state=active]:shadow-sm" style={{ color: "hsl(14 55% 30%)" }}>
              <CalendarDays className="w-4 h-4 mr-1.5" /> Activities
            </TabsTrigger>
            <TabsTrigger value="messages" className="rounded-xl font-semibold font-sans text-sm transition-all data-[state=active]:shadow-sm" style={{ color: "hsl(14 55% 30%)" }}>
              <MessageCircle className="w-4 h-4 mr-1.5" /> Messages
            </TabsTrigger>
          </TabsList>

          {/* ── ACTIVITIES TAB ── */}
          <TabsContent value="activities" className="space-y-3">
            {isLoadingActivities ? (
              <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin" style={{ color: accent }} /></div>
            ) : !activities?.length ? (
              <div className="rounded-2xl p-8 text-center border border-dashed" style={{ background: "hsl(40 40% 90% / 0.5)", borderColor: "hsl(14 30% 60% / 0.3)" }}>
                <CalendarDays className="w-8 h-8 mx-auto mb-3" style={{ color: "hsl(14 30% 60% / 0.5)" }} />
                <p className="font-sans text-sm" style={{ color: "hsl(14 40% 48%)" }}>No activities yet.</p>
              </div>
            ) : (
              <div className="space-y-3 mb-3">
                {activities.map((activity, i) => {
                  const isOpen = openActivities.has(activity.id);
                  return (
                    <div key={activity.id} className="rounded-2xl overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-2"
                      style={{ background: "hsl(40 50% 93%)", border: `1px solid ${accent}35`, animationDelay: `${i * 50}ms`, animationFillMode: "both" }}>
                      <div style={{ height: 3, background: accent }} />
                      <button type="button" onClick={() => toggleActivity(activity.id)} className="w-full flex items-center gap-3 px-4 py-3.5 text-left">
                        <CalendarDays className="w-4 h-4 shrink-0" style={{ color: accent }} />
                        <span className="flex-1 font-serif font-bold leading-snug" style={{ fontSize: "0.95rem", color: "hsl(14 72% 18%)" }}>{activity.title}</span>
                        {currentUser
                          ? isOpen ? <ChevronUp className="w-4 h-4 shrink-0" style={{ color: accent }} /> : <ChevronDown className="w-4 h-4 shrink-0" style={{ color: accent }} />
                          : <Lock className="w-3.5 h-3.5 shrink-0" style={{ color: accent, opacity: 0.55 }} />}
                      </button>
                      {isOpen && currentUser && (
                        <div className="px-4 pb-4" style={{ borderTop: `1px solid ${accent}25` }}>
                          <p className="font-sans text-sm leading-relaxed mt-3 mb-3" style={{ color: "hsl(14 50% 28%)" }}>{activity.description}</p>
                          <div className="flex justify-between items-center text-xs" style={{ color: "hsl(14 35% 48%)" }}>
                            <span className="font-semibold" style={{ color: accent }}>By {activity.authorName}</span>
                            <span>{format(new Date(activity.createdAt), "MMM d, yyyy")}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            {currentUser?.isAdmin && (
              <div className="rounded-2xl p-5 shadow relative overflow-hidden" style={{ background: "hsl(40 50% 93%)", border: `1px solid ${accent}40` }}>
                <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl" style={{ background: accent }} />
                <h3 className="font-serif text-lg font-bold mb-4" style={{ color: "hsl(14 72% 18%)" }}>Propose an Activity</h3>
                <Form {...activityForm}>
                  <form onSubmit={activityForm.handleSubmit(onActivitySubmit)} className="space-y-4">
                    <FormField control={activityForm.control} name="title" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-sans text-sm" style={{ color: "hsl(14 55% 30%)" }}>Activity Title</FormLabel>
                        <FormControl>
                          <input placeholder="E.g., Sunday Feast Program" className="w-full h-11 px-4 rounded-xl font-sans text-sm border focus:outline-none focus:ring-2 focus:ring-primary/30" style={{ background: "hsl(40 40% 96%)", borderColor: "hsl(14 30% 65% / 0.4)", color: "hsl(14 72% 18%)" }} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={activityForm.control} name="description" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-sans text-sm" style={{ color: "hsl(14 55% 30%)" }}>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="What will happen during this activity?" className="resize-none min-h-[90px] rounded-xl font-sans" style={{ background: "hsl(40 40% 96%)", borderColor: "hsl(14 30% 65% / 0.4)" }} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "hsl(40 40% 88%)" }}>
                      <span className="font-sans text-xs" style={{ color: "hsl(14 40% 48%)" }}>Posting as</span>
                      <span className="font-sans text-sm font-semibold" style={{ color: "hsl(14 72% 18%)" }}>{currentUser.fullName}</span>
                    </div>
                    <Button type="submit" className="w-full h-11 rounded-xl font-bold font-sans tracking-wide shadow-sm" disabled={createActivity.isPending} style={{ background: accent, color: "hsl(40 80% 96%)" }}>
                      {createActivity.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                      Propose Activity
                    </Button>
                  </form>
                </Form>
              </div>
            )}
          </TabsContent>

          {/* ── MESSAGES TAB ── */}
          <TabsContent value="messages" className="space-y-4">

            {/* Admin: pending messages awaiting approval */}
            {currentUser?.isAdmin && pendingMessages.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-1 mb-1">
                  <Clock className="w-3.5 h-3.5" style={{ color: "hsl(35 80% 45%)" }} />
                  <span className="font-sans text-xs font-semibold uppercase tracking-wider" style={{ color: "hsl(35 70% 40%)" }}>
                    Awaiting validation ({pendingMessages.length})
                  </span>
                </div>
                {pendingMessages.map((message: any, i: number) => (
                  <div key={message.id} className="rounded-2xl overflow-hidden shadow-sm"
                    style={{ background: "hsl(42 60% 94%)", border: "1px solid hsl(35 60% 65% / 0.5)", animationDelay: `${i * 40}ms` }}>
                    <div style={{ height: 3, background: "hsl(35 75% 50%)" }} />
                    <div className="p-4">
                      <p className="font-serif italic leading-relaxed mb-3" style={{ fontSize: "0.92rem", color: "hsl(14 65% 22%)" }}>"{message.content}"</p>
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="font-sans text-xs font-semibold" style={{ color: "hsl(35 60% 38%)" }}>— {message.authorName}</span>
                          <span className="font-sans text-xs" style={{ color: "hsl(14 30% 55%)" }}>{format(new Date(message.createdAt), "MMM d, yyyy")}</span>
                        </div>
                        <button
                          onClick={() => approveMessage(message.id)}
                          disabled={approvingId === message.id}
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full font-sans font-semibold text-xs transition-opacity"
                          style={{ background: accent, color: "hsl(40 80% 96%)", opacity: approvingId === message.id ? 0.6 : 1 }}>
                          {approvingId === message.id
                            ? <Loader2 className="w-3 h-3 animate-spin" />
                            : <CheckCircle2 className="w-3 h-3" />}
                          {approvingId === message.id ? "Approving…" : "Approve"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {approvedMessages.length > 0 && (
                  <div className="flex items-center gap-3 py-2">
                    <div className="flex-1 h-px" style={{ background: "hsl(14 25% 72% / 0.4)" }} />
                    <span className="font-sans text-xs uppercase tracking-widest" style={{ color: "hsl(14 35% 55%)" }}>Published</span>
                    <div className="flex-1 h-px" style={{ background: "hsl(14 25% 72% / 0.4)" }} />
                  </div>
                )}
              </div>
            )}

            {/* Approved messages */}
            {isLoadingMessages ? (
              <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin" style={{ color: accent }} /></div>
            ) : approvedMessages.length === 0 ? (
              <div className="rounded-2xl p-8 text-center border border-dashed" style={{ background: "hsl(40 40% 90% / 0.5)", borderColor: "hsl(14 30% 60% / 0.3)" }}>
                <MessageCircle className="w-8 h-8 mx-auto mb-3" style={{ color: "hsl(14 30% 60% / 0.5)" }} />
                <p className="font-sans text-sm" style={{ color: "hsl(14 40% 48%)" }}>No messages yet. Share your reflections!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {approvedMessages.map((message: any, i: number) => {
                  const commentsOpen = expandedComments.has(message.id);
                  const msgComments = commentsByMsg[message.id] ?? [];
                  return (
                    <div key={message.id} className="rounded-2xl overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-2"
                      style={{ background: "hsl(40 50% 93%)", border: `1px solid ${accent}35`, animationDelay: `${i * 50}ms`, animationFillMode: "both" }}>
                      <div style={{ height: 3, background: accent }} />
                      <div className="p-5 pb-3">
                        <p className="font-serif italic text-base leading-relaxed mb-4" style={{ color: "hsl(14 65% 22%)" }}>"{message.content}"</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs" style={{ color: "hsl(14 40% 50%)" }}>
                            <span className="font-bold" style={{ color: accent }}>— {message.authorName}</span>
                            <span>{format(new Date(message.createdAt), "MMM d, yyyy")}</span>
                          </div>
                          <button onClick={() => toggleComments(message.id)}
                            className="inline-flex items-center gap-1 font-sans text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
                            style={{ background: commentsOpen ? `${accent}18` : "transparent", color: accent, border: `1px solid ${accent}30` }}>
                            <MessageSquare className="w-3 h-3" />
                            {msgComments.length > 0 ? msgComments.length : ""}
                            {commentsOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>

                      {/* Comments section */}
                      {commentsOpen && (
                        <div className="px-5 pb-4 pt-2" style={{ borderTop: `1px solid ${accent}20` }}>
                          {msgComments.length === 0 ? (
                            <p className="font-sans text-xs text-center py-3" style={{ color: "hsl(14 30% 58%)" }}>No comments yet. Be the first!</p>
                          ) : (
                            <div className="space-y-2 mb-3">
                              {msgComments.map(c => (
                                <div key={c.id} className="flex gap-2.5 items-start">
                                  <div className="rounded-full shrink-0 flex items-center justify-center font-serif font-bold" style={{ width: 28, height: 28, fontSize: "0.75rem", background: `${accent}18`, color: accent }}>
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

                          {/* Comment input — signed-in users only */}
                          {currentUser ? (
                            <div className="flex gap-2 items-end mt-2">
                              <div className="rounded-full shrink-0 flex items-center justify-center font-serif font-bold" style={{ width: 28, height: 28, fontSize: "0.75rem", background: `${accent}18`, color: accent }}>
                                {currentUser.fullName[0]}
                              </div>
                              <div className="flex-1 flex items-end gap-2 rounded-2xl px-3 py-2" style={{ background: "hsl(40 40% 88%)", border: `1px solid ${accent}20` }}>
                                <textarea
                                  rows={1}
                                  placeholder="Write a comment…"
                                  value={commentInputs[message.id] ?? ""}
                                  onChange={e => setCommentInputs(prev => ({ ...prev, [message.id]: e.target.value }))}
                                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submitComment(message.id); } }}
                                  className="flex-1 resize-none bg-transparent font-sans text-sm outline-none"
                                  style={{ color: "hsl(14 55% 22%)", minHeight: 24, maxHeight: 80 }}
                                />
                                <button
                                  onClick={() => submitComment(message.id)}
                                  disabled={!commentInputs[message.id]?.trim() || commentSubmitting === message.id}
                                  className="shrink-0 rounded-full flex items-center justify-center transition-opacity"
                                  style={{ width: 28, height: 28, background: accent, opacity: !commentInputs[message.id]?.trim() ? 0.35 : 1 }}>
                                  {commentSubmitting === message.id
                                    ? <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                                    : <Send className="w-3.5 h-3.5 text-white" />}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="font-sans text-xs text-center pt-2" style={{ color: "hsl(14 35% 52%)" }}>
                              <Link href="/register" className="font-semibold underline" style={{ color: accent }}>Sign in</Link> to leave a comment
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Share a message form */}
            <div className="rounded-2xl p-5 shadow relative overflow-hidden" style={{ background: "hsl(40 50% 93%)", border: `1px solid ${accent}35` }}>
              <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl" style={{ background: accent }} />
              <h3 className="font-serif text-lg font-bold mb-1" style={{ color: "hsl(14 72% 18%)" }}>Share a Message</h3>
              <p className="font-sans text-xs mb-4" style={{ color: "hsl(14 38% 50%)" }}>Your message will appear once validated</p>
              {!currentUser ? (
                <SignInPrompt />
              ) : (
                <Form {...messageForm}>
                  <form onSubmit={messageForm.handleSubmit(onMessageSubmit)} className="space-y-4">
                    <FormField control={messageForm.control} name="content" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-sans text-sm" style={{ color: "hsl(14 55% 30%)" }}>Your Message</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Share your realizations or thoughts..." className="resize-none min-h-[110px] rounded-xl font-sans" style={{ background: "hsl(40 40% 96%)", borderColor: "hsl(14 30% 65% / 0.4)" }} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "hsl(40 40% 88%)" }}>
                      <span className="font-sans text-xs" style={{ color: "hsl(14 40% 48%)" }}>Posting as</span>
                      <span className="font-sans text-sm font-semibold" style={{ color: "hsl(14 72% 18%)" }}>{currentUser.fullName}</span>
                    </div>
                    <Button type="submit" variant="outline" className="w-full h-11 rounded-xl font-bold font-sans tracking-wide" disabled={createMessage.isPending} style={{ borderColor: `${accent}60`, color: accent }}>
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

function SignInPrompt() {
  return (
    <div className="flex flex-col items-center gap-3 py-5 text-center">
      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "hsl(26 68% 42% / 0.12)" }}>
        <Lock className="w-5 h-5" style={{ color: "hsl(26 68% 42%)" }} />
      </div>
      <p className="font-sans text-sm" style={{ color: "hsl(14 40% 42%)" }}>Sign in to participate in the community</p>
      <Link href="/register" className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full font-sans font-semibold text-sm" style={{ background: "hsl(26 68% 42%)", color: "hsl(40 80% 96%)" }}>
        Sign in / Register
      </Link>
    </div>
  );
}
