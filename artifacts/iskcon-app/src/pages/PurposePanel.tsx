import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetActivities,
  useGetMessages,
  useCreateActivity,
  useCreateMessage,
  getGetActivitiesQueryKey,
  getGetMessagesQueryKey,
} from "@workspace/api-client-react";
import { CalendarDays, MessageCircle, Loader2, Lock, ChevronDown, ChevronUp } from "lucide-react";
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

const ACTIVITY_GREEN = "hsl(145 45% 36%)";
const ACTIVITY_GREEN_BG = "hsl(145 28% 91%)";
const ACTIVITY_GREEN_BORDER = "hsl(145 35% 72% / 0.6)";

interface PurposePanelProps {
  purposeId: number;
  title: string;
  officialText: string;
  description: string;
}

export default function PurposePanel({ purposeId, title, officialText, description }: PurposePanelProps) {
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();
  const accent = accentByTitle[title] ?? "hsl(26 68% 42%)";
  const [openActivities, setOpenActivities] = useState<Set<number>>(new Set());

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
        toast.success("Message shared. Hare Krishna!");
        messageForm.reset({ content: "", authorName: currentUser?.fullName ?? "" });
        queryClient.invalidateQueries({ queryKey: getGetMessagesQueryKey(purposeId) });
      },
      onError: () => toast.error("Failed to share message"),
    });
  };

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
              <div className="flex justify-center p-8">
                <Loader2 className="w-6 h-6 animate-spin" style={{ color: ACTIVITY_GREEN }} />
              </div>
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
                    <div
                      key={activity.id}
                      className="rounded-2xl overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-2"
                      style={{ background: ACTIVITY_GREEN_BG, border: `1px solid ${ACTIVITY_GREEN_BORDER}`, animationDelay: `${i * 50}ms`, animationFillMode: "both" }}
                    >
                      {/* Green top stripe */}
                      <div style={{ height: 3, background: ACTIVITY_GREEN }} />

                      {/* Header row — always visible, clickable */}
                      <button
                        type="button"
                        onClick={() => toggleActivity(activity.id)}
                        className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
                      >
                        <CalendarDays className="w-4 h-4 shrink-0" style={{ color: ACTIVITY_GREEN }} />
                        <span className="flex-1 font-serif font-bold leading-snug" style={{ fontSize: "0.95rem", color: "hsl(145 45% 14%)" }}>
                          {activity.title}
                        </span>
                        {currentUser ? (
                          isOpen
                            ? <ChevronUp className="w-4 h-4 shrink-0" style={{ color: ACTIVITY_GREEN }} />
                            : <ChevronDown className="w-4 h-4 shrink-0" style={{ color: ACTIVITY_GREEN }} />
                        ) : (
                          <Lock className="w-3.5 h-3.5 shrink-0" style={{ color: ACTIVITY_GREEN, opacity: 0.6 }} />
                        )}
                      </button>

                      {/* Expanded content — only when open and signed in */}
                      {isOpen && currentUser && (
                        <div className="px-4 pb-4" style={{ borderTop: `1px solid ${ACTIVITY_GREEN_BORDER}` }}>
                          <p className="font-sans text-sm leading-relaxed mt-3 mb-3" style={{ color: "hsl(145 30% 22%)" }}>
                            {activity.description}
                          </p>
                          <div className="flex justify-between items-center text-xs" style={{ color: "hsl(145 25% 42%)" }}>
                            <span className="font-semibold">By {activity.authorName}</span>
                            <span>{format(new Date(activity.createdAt), "MMM d, yyyy")}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Propose — admin only */}
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
          <TabsContent value="messages" className="space-y-6">
            <div className="space-y-3">
              <h2 className="font-serif text-xl font-bold" style={{ color: "hsl(14 72% 18%)" }}>Community Messages</h2>
              {isLoadingMessages ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="w-6 h-6 animate-spin" style={{ color: accent }} />
                </div>
              ) : !messages?.length ? (
                <div className="rounded-2xl p-8 text-center border border-dashed" style={{ background: "hsl(40 40% 90% / 0.5)", borderColor: "hsl(14 30% 60% / 0.3)" }}>
                  <MessageCircle className="w-8 h-8 mx-auto mb-3" style={{ color: "hsl(14 30% 60% / 0.5)" }} />
                  <p className="font-sans text-sm" style={{ color: "hsl(14 40% 48%)" }}>No messages yet. Share your reflections!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((message, i) => (
                    <div key={message.id} className="rounded-2xl p-5 shadow-sm animate-in fade-in slide-in-from-bottom-2"
                      style={{ background: "hsl(40 50% 93%)", border: "1px solid hsl(14 30% 60% / 0.2)", animationDelay: `${i * 50}ms`, animationFillMode: "both" }}>
                      <p className="font-serif italic text-base leading-relaxed mb-4" style={{ color: "hsl(14 65% 22%)" }}>"{message.content}"</p>
                      <div className="flex justify-between items-center text-xs" style={{ color: "hsl(14 40% 50%)" }}>
                        <span className="font-bold" style={{ color: accent }}>— {message.authorName}</span>
                        <span>{format(new Date(message.createdAt), "MMM d, yyyy")}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl p-5 shadow relative overflow-hidden" style={{ background: "hsl(40 50% 93%)", border: "1px solid hsl(14 30% 60% / 0.25)" }}>
              <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl" style={{ background: "hsl(14 45% 40%)" }} />
              <h3 className="font-serif text-lg font-bold mb-4" style={{ color: "hsl(14 72% 18%)" }}>Share a Message</h3>
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
                    <Button type="submit" variant="outline" className="w-full h-11 rounded-xl font-bold font-sans tracking-wide" disabled={createMessage.isPending} style={{ borderColor: "hsl(14 30% 55% / 0.4)", color: "hsl(14 60% 28%)" }}>
                      {createMessage.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                      Post Message
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
