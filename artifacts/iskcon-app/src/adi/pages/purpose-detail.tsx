import { useParams, Link } from "wouter";
import {
  useGetPurpose,
  useGetActivities,
  useGetMessages,
  useCreateActivity,
  useCreateMessage,
  getGetActivitiesQueryKey,
  getGetMessagesQueryKey,
} from "@/adi/lib/local-api";
import { ArrowLeft, MessageCircle, CalendarDays, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { format } from "date-fns";
import logoAccessing    from "@assets/7p_LogoNoTitle_Accessing_1774931916882.png";
import logoLearning     from "@assets/7p_LogoNoTitle_Learning_1774931916883.png";
import logoApplying     from "@assets/7p_LogoNoTitle_Applying_1774931916883.png";
import logoCommunity    from "@assets/7p_LogoNoTitle_Community_1774931916884.png";
import logoHolyPlace    from "@assets/7p_LogoNoTitle_HolyPlace_1774931916884.png";
import logoSharing      from "@assets/7p_LogoNoTitle_Sharing_1774931916884.png";
import logoSimpleLiving from "@assets/7p_LogoNoTitle_SimpleLiving_1774931916885.png";

const logoByTitle: Record<string, string> = {
  "Accessing":     logoAccessing,
  "Learning":      logoLearning,
  "Community":     logoCommunity,
  "Applying":      logoApplying,
  "Holy Place":    logoHolyPlace,
  "Simple Living": logoSimpleLiving,
  "Sharing":       logoSharing,
};

const numberByTitle: Record<string, number> = {
  "Accessing":     1,
  "Learning":      2,
  "Community":     3,
  "Applying":      4,
  "Holy Place":    5,
  "Simple Living": 6,
  "Sharing":       7,
};

const accentByTitle: Record<string, string> = {
  "Accessing":     "hsl(14 52% 38%)",
  "Learning":      "hsl(17 44% 35%)",
  "Community":     "hsl(220 60% 44%)",
  "Applying":      "hsl(14 18% 33%)",
  "Holy Place":    "hsl(14 8% 22%)",
  "Simple Living": "hsl(168 42% 33%)",
  "Sharing":       "hsl(14 40% 30%)",
};

const activitySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  authorName: z.string().min(1, "Your name is required"),
});

const messageSchema = z.object({
  content: z.string().min(1, "Message cannot be empty"),
  authorName: z.string().min(1, "Your name is required"),
});

export default function PurposeDetail() {
  const { id: idStr } = useParams();
  const id = parseInt(idStr || "0", 10);
  const queryClient = useQueryClient();

  const { data: purpose, isLoading: isLoadingPurpose } = useGetPurpose(id, {
    query: { enabled: !!id },
  });

  const { data: activities, isLoading: isLoadingActivities } = useGetActivities(id, {
    query: { enabled: !!id, queryKey: getGetActivitiesQueryKey(id) },
  });

  const { data: messages, isLoading: isLoadingMessages } = useGetMessages(id, {
    query: { enabled: !!id, queryKey: getGetMessagesQueryKey(id) },
  });

  const createActivity = useCreateActivity();
  const createMessage = useCreateMessage();

  const activityForm = useForm<z.infer<typeof activitySchema>>({
    resolver: zodResolver(activitySchema),
    defaultValues: { title: "", description: "", authorName: "" },
  });

  const messageForm = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: { content: "", authorName: "" },
  });

  const onActivitySubmit = (data: z.infer<typeof activitySchema>) => {
    createActivity.mutate({ purposeId: id, data }, {
      onSuccess: () => {
        toast.success("Activity proposed successfully");
        activityForm.reset();
        queryClient.invalidateQueries({ queryKey: getGetActivitiesQueryKey(id) });
      },
      onError: () => toast.error("Failed to propose activity"),
    });
  };

  const onMessageSubmit = (data: z.infer<typeof messageSchema>) => {
    createMessage.mutate({ purposeId: id, data }, {
      onSuccess: () => {
        toast.success("Message shared. Hare Krishna!");
        messageForm.reset();
        queryClient.invalidateQueries({ queryKey: getGetMessagesQueryKey(id) });
      },
      onError: () => toast.error("Failed to share message"),
    });
  };

  if (isLoadingPurpose) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground font-serif italic animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  if (!purpose) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-background p-6 text-center">
        <h2 className="font-serif text-2xl mb-4 text-foreground">Purpose not found</h2>
        <Link href="/" className="text-primary font-medium hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Return Home
        </Link>
      </div>
    );
  }

  const logo = logoByTitle[purpose.title];
  const accent = accentByTitle[purpose.title] ?? "hsl(26 68% 42%)";

  return (
    <div className="min-h-[100dvh] pb-20 overflow-x-hidden" style={{ background: "hsl(38 52% 86%)" }}>

      {/* Header — parchment gradient matching home */}
      <div
        className="relative px-5 pt-10 pb-8"
        style={{
          background: "linear-gradient(160deg, hsl(38 52% 82%) 0%, hsl(36 48% 78%) 100%)",
          borderBottom: "1px solid hsl(14 30% 60% / 0.25)",
        }}
      >
        {/* Back button */}
        <Link
          href="/"
          data-testid="back-button"
          className="inline-flex items-center gap-1.5 text-sm font-sans mb-6 opacity-60 hover:opacity-100 transition-opacity"
          style={{ color: "hsl(14 72% 18%)" }}
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        <div className="max-w-lg mx-auto flex items-center gap-5">
          {/* Logo — no background, just the image */}
          {logo && (
            <img src={logo} alt={purpose.title} className="shrink-0" style={{ width: 80, height: 80, objectFit: "contain" }} />
          )}

          <div className="flex-1 min-w-0">
            {/* Purpose number badge */}
            <div
              className="inline-block px-3 py-1 rounded-lg font-sans text-xs font-bold tracking-widest uppercase mb-2"
              style={{ background: accent, color: "hsl(40 80% 96%)" }}
            >
              Purpose {numberByTitle[purpose.title] ?? purpose.number}
            </div>
            <h1
              className="font-serif font-bold leading-tight"
              style={{ fontSize: "clamp(1.5rem, 6vw, 2.2rem)", color: "hsl(14 72% 16%)" }}
            >
              {purpose.title}
            </h1>
          </div>
        </div>

        {/* Description */}
        <p
          className="font-sans leading-relaxed mt-4 max-w-lg mx-auto"
          style={{ color: "hsl(14 50% 30%)", fontSize: "0.92rem" }}
        >
          {purpose.fullDescription}
        </p>
      </div>

      {/* Divider */}
      <div className="max-w-lg mx-auto px-5">
        <div className="flex items-center gap-3 py-5">
          <div className="flex-1 h-px" style={{ background: "hsl(14 30% 60% / 0.25)" }} />
          <span className="font-sans text-xs uppercase tracking-widest" style={{ color: "hsl(14 40% 50%)" }}>Community</span>
          <div className="flex-1 h-px" style={{ background: "hsl(14 30% 60% / 0.25)" }} />
        </div>

        <Tabs defaultValue="activities" className="w-full">
          <TabsList
            className="w-full grid grid-cols-2 h-12 rounded-2xl p-1 mb-6"
            style={{ background: "hsl(38 40% 80%)", border: "1px solid hsl(14 30% 60% / 0.2)" }}
          >
            <TabsTrigger
              value="activities"
              className="rounded-xl font-semibold font-sans text-sm transition-all data-[state=active]:shadow-sm"
              style={{ color: "hsl(14 55% 30%)" }}
            >
              <CalendarDays className="w-4 h-4 mr-1.5" />
              Activities
            </TabsTrigger>
            <TabsTrigger
              value="messages"
              className="rounded-xl font-semibold font-sans text-sm transition-all data-[state=active]:shadow-sm"
              style={{ color: "hsl(14 55% 30%)" }}
            >
              <MessageCircle className="w-4 h-4 mr-1.5" />
              Messages
            </TabsTrigger>
          </TabsList>

          {/* ACTIVITIES TAB */}
          <TabsContent value="activities" className="space-y-6">

            <div className="space-y-3">
              <h2 className="font-serif text-xl font-bold" style={{ color: "hsl(14 72% 18%)" }}>Proposed Activities</h2>
              {isLoadingActivities ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="w-6 h-6 animate-spin" style={{ color: accent }} />
                </div>
              ) : !activities?.length ? (
                <div className="rounded-2xl p-8 text-center border border-dashed" style={{ background: "hsl(40 40% 90% / 0.5)", borderColor: "hsl(14 30% 60% / 0.3)" }}>
                  <CalendarDays className="w-8 h-8 mx-auto mb-3" style={{ color: "hsl(14 30% 60% / 0.5)" }} />
                  <p className="font-sans text-sm" style={{ color: "hsl(14 40% 48%)" }}>No activities proposed yet. Be the first!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activities.map((activity, i) => (
                    <div
                      key={activity.id}
                      data-testid={`activity-card-${activity.id}`}
                      className="rounded-2xl p-5 shadow-sm animate-in fade-in slide-in-from-bottom-2"
                      style={{ background: "hsl(40 50% 93%)", border: "1px solid hsl(14 30% 60% / 0.2)", animationDelay: `${i * 50}ms`, animationFillMode: "both" }}
                    >
                      <h3 className="font-serif text-lg font-bold mb-1.5" style={{ color: "hsl(14 72% 18%)" }}>{activity.title}</h3>
                      <p className="font-sans text-sm leading-relaxed mb-4" style={{ color: "hsl(14 50% 35%)" }}>{activity.description}</p>
                      <div className="flex justify-between items-center text-xs pt-3" style={{ borderTop: "1px solid hsl(14 30% 60% / 0.2)", color: "hsl(14 40% 50%)" }}>
                        <span className="font-semibold" style={{ color: "hsl(14 60% 28%)" }}>By {activity.authorName}</span>
                        <span>{format(new Date(activity.createdAt), "MMM d, yyyy")}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Activity form */}
            <div className="rounded-2xl p-5 shadow relative overflow-hidden" style={{ background: "hsl(40 50% 93%)", border: `1px solid ${accent}40` }}>
              <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl" style={{ background: accent }} />
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-serif text-lg font-bold" style={{ color: "hsl(14 72% 18%)" }}>Propose an Activity</h3>
                <span className="text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest font-sans" style={{ background: `${accent}22`, color: accent }}>Admin</span>
              </div>
              <Form {...activityForm}>
                <form onSubmit={activityForm.handleSubmit(onActivitySubmit)} className="space-y-4">
                  <FormField
                    control={activityForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-sans text-sm" style={{ color: "hsl(14 55% 30%)" }}>Activity Title</FormLabel>
                        <FormControl>
                          <Input data-testid="input-activity-title" placeholder="E.g., Sunday Feast Program" className="h-11 rounded-xl font-sans" style={{ background: "hsl(40 40% 96%)", borderColor: "hsl(14 30% 65% / 0.4)" }} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={activityForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-sans text-sm" style={{ color: "hsl(14 55% 30%)" }}>Description</FormLabel>
                        <FormControl>
                          <Textarea data-testid="input-activity-description" placeholder="What will happen during this activity?" className="resize-none min-h-[90px] rounded-xl font-sans" style={{ background: "hsl(40 40% 96%)", borderColor: "hsl(14 30% 65% / 0.4)" }} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={activityForm.control}
                    name="authorName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-sans text-sm" style={{ color: "hsl(14 55% 30%)" }}>Your Name</FormLabel>
                        <FormControl>
                          <Input data-testid="input-activity-author" placeholder="Enter your name" className="h-11 rounded-xl font-sans" style={{ background: "hsl(40 40% 96%)", borderColor: "hsl(14 30% 65% / 0.4)" }} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" data-testid="button-submit-activity" className="w-full h-11 rounded-xl font-bold font-sans tracking-wide shadow-sm" disabled={createActivity.isPending} style={{ background: accent, color: "hsl(40 80% 96%)" }}>
                    {createActivity.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                    Propose Activity
                  </Button>
                </form>
              </Form>
            </div>
          </TabsContent>

          {/* MESSAGES TAB */}
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
                    <div
                      key={message.id}
                      data-testid={`message-card-${message.id}`}
                      className="rounded-2xl p-5 shadow-sm animate-in fade-in slide-in-from-bottom-2"
                      style={{ background: "hsl(40 50% 93%)", border: "1px solid hsl(14 30% 60% / 0.2)", animationDelay: `${i * 50}ms`, animationFillMode: "both" }}
                    >
                      <p className="font-serif italic text-base leading-relaxed mb-4" style={{ color: "hsl(14 65% 22%)" }}>
                        "{message.content}"
                      </p>
                      <div className="flex justify-between items-center text-xs" style={{ color: "hsl(14 40% 50%)" }}>
                        <span className="font-bold" style={{ color: accent }}>— {message.authorName}</span>
                        <span>{format(new Date(message.createdAt), "MMM d, yyyy")}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Message form */}
            <div className="rounded-2xl p-5 shadow relative overflow-hidden" style={{ background: "hsl(40 50% 93%)", border: "1px solid hsl(14 30% 60% / 0.25)" }}>
              <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl" style={{ background: "hsl(14 45% 40%)" }} />
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-serif text-lg font-bold" style={{ color: "hsl(14 72% 18%)" }}>Share a Message</h3>
                <span className="text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest font-sans" style={{ background: "hsl(14 30% 60% / 0.15)", color: "hsl(14 55% 32%)" }}>Member</span>
              </div>
              <Form {...messageForm}>
                <form onSubmit={messageForm.handleSubmit(onMessageSubmit)} className="space-y-4">
                  <FormField
                    control={messageForm.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-sans text-sm" style={{ color: "hsl(14 55% 30%)" }}>Your Message</FormLabel>
                        <FormControl>
                          <Textarea data-testid="input-message-content" placeholder="Share your realizations or thoughts..." className="resize-none min-h-[110px] rounded-xl font-sans" style={{ background: "hsl(40 40% 96%)", borderColor: "hsl(14 30% 65% / 0.4)" }} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={messageForm.control}
                    name="authorName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-sans text-sm" style={{ color: "hsl(14 55% 30%)" }}>Your Name</FormLabel>
                        <FormControl>
                          <Input data-testid="input-message-author" placeholder="Enter your name" className="h-11 rounded-xl font-sans" style={{ background: "hsl(40 40% 96%)", borderColor: "hsl(14 30% 65% / 0.4)" }} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" variant="outline" data-testid="button-submit-message" className="w-full h-11 rounded-xl font-bold font-sans tracking-wide" disabled={createMessage.isPending} style={{ borderColor: "hsl(14 30% 55% / 0.4)", color: "hsl(14 60% 28%)" }}>
                    {createMessage.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                    Post Message
                  </Button>
                </form>
              </Form>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
