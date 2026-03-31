import { useParams, Link } from "wouter";
import {
  useGetPurpose,
  useGetActivities,
  useGetMessages,
  useCreateActivity,
  useCreateMessage,
  getGetActivitiesQueryKey,
  getGetMessagesQueryKey,
} from "@workspace/api-client-react";
import { ArrowLeft, MessageCircle, CalendarDays, Loader2, Leaf, Users, Building2, Globe, BookOpen, Lightbulb, Share2 } from "lucide-react";
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
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Leaf, Users, Building2, Globe, BookOpen, Lightbulb, Share2,
};

const iconBgMap: Record<string, string> = {
  Leaf: "bg-emerald-600",
  Users: "bg-blue-700",
  Building2: "bg-stone-600",
  Globe: "bg-amber-700",
  BookOpen: "bg-amber-800",
  Lightbulb: "bg-orange-700",
  Share2: "bg-red-800",
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
      <div className="min-h-[100dvh] flex items-center justify-center bg-background relative z-10">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground font-serif italic animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  if (!purpose) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-background p-6 text-center relative z-10">
        <h2 className="font-serif text-2xl mb-4 text-foreground">Purpose not found</h2>
        <Link href="/" className="text-primary font-medium hover:underline flex items-center justify-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Return Home
        </Link>
      </div>
    );
  }

  const IconComp = iconMap[purpose.icon] ?? BookOpen;
  const iconBg = iconBgMap[purpose.icon] ?? "bg-amber-700";

  return (
    <div className="min-h-[100dvh] bg-background pb-20 overflow-x-hidden relative z-10">

      {/* Header */}
      <div className="bg-card/80 border-b border-border/60 px-5 pt-10 pb-8 relative shadow-sm">
        <Link
          href="/"
          data-testid="back-button"
          className="absolute top-8 left-4 w-10 h-10 flex items-center justify-center rounded-full bg-background/80 border border-border/60 text-foreground shadow-sm hover:scale-105 transition-transform"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <div className="max-w-lg mx-auto mt-8 text-center animate-in slide-in-from-bottom-3 fade-in duration-500">
          {/* Icon circle */}
          <div className={`${iconBg} w-20 h-20 rounded-full flex items-center justify-center text-white mx-auto mb-5 shadow-md ring-4 ring-white/30`}>
            <IconComp className="w-10 h-10" />
          </div>

          {/* Orange badge / ribbon matching graphic charter */}
          <div className="inline-block bg-primary px-5 py-1.5 rounded-full mb-3 shadow-sm">
            <span className="text-primary-foreground font-serif italic text-sm font-semibold tracking-wide">
              Purpose {purpose.number} &mdash; {purpose.title}
            </span>
          </div>

          <h1 className="font-serif text-4xl font-bold text-foreground leading-tight mb-4 px-2">
            {purpose.title}
          </h1>

          <p className="text-foreground/70 text-base leading-relaxed px-2 font-sans max-w-sm mx-auto">
            {purpose.fullDescription}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-lg mx-auto px-5">
        <div className="flex items-center gap-3 py-5">
          <div className="flex-1 h-px bg-border/60" />
          <span className="text-muted-foreground text-xs font-sans uppercase tracking-widest">Community</span>
          <div className="flex-1 h-px bg-border/60" />
        </div>

        <Tabs defaultValue="activities" className="w-full">
          <TabsList className="w-full grid grid-cols-2 h-14 bg-card/60 border border-border/50 rounded-2xl shadow-sm p-1.5 mb-6">
            <TabsTrigger
              value="activities"
              className="rounded-xl font-semibold font-sans data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all text-sm"
            >
              <CalendarDays className="w-4 h-4 mr-2" />
              Activities
            </TabsTrigger>
            <TabsTrigger
              value="messages"
              className="rounded-xl font-semibold font-sans data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all text-sm"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Messages
            </TabsTrigger>
          </TabsList>

          {/* ACTIVITIES TAB */}
          <TabsContent value="activities" className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-400">

            <div className="space-y-3">
              <h2 className="font-serif text-2xl font-bold text-foreground">Proposed Activities</h2>
              {isLoadingActivities ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary/60" />
                </div>
              ) : !activities?.length ? (
                <div className="bg-card/60 rounded-2xl p-8 text-center border border-dashed border-border/60">
                  <CalendarDays className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm font-sans">No activities proposed yet. Be the first!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activities.map((activity, i) => (
                    <div
                      key={activity.id}
                      data-testid={`activity-card-${activity.id}`}
                      className="bg-card rounded-2xl p-5 shadow-sm border border-border/60 animate-in fade-in slide-in-from-bottom-2"
                      style={{ animationDelay: `${i * 50}ms`, animationFillMode: "both" }}
                    >
                      <h3 className="font-serif text-lg font-bold text-foreground mb-1.5">{activity.title}</h3>
                      <p className="text-foreground/70 text-sm leading-relaxed font-sans mb-4">{activity.description}</p>
                      <div className="flex justify-between items-center text-xs text-muted-foreground font-sans pt-3 border-t border-border/40">
                        <span className="font-semibold text-foreground/80">By {activity.authorName}</span>
                        <span>{format(new Date(activity.createdAt), "MMM d, yyyy")}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Activity form */}
            <div className="bg-card rounded-2xl p-5 shadow border border-primary/20 relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-1 bg-primary rounded-t-2xl" />
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-serif text-lg font-bold text-foreground">Propose an Activity</h3>
                <span className="bg-primary/15 text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest font-sans">Admin</span>
              </div>
              <Form {...activityForm}>
                <form onSubmit={activityForm.handleSubmit(onActivitySubmit)} className="space-y-4">
                  <FormField
                    control={activityForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground/80 font-sans text-sm">Activity Title</FormLabel>
                        <FormControl>
                          <Input
                            data-testid="input-activity-title"
                            placeholder="E.g., Sunday Feast Program"
                            className="bg-background/60 h-11 rounded-xl border-border/70 font-sans"
                            {...field}
                          />
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
                        <FormLabel className="text-foreground/80 font-sans text-sm">Description</FormLabel>
                        <FormControl>
                          <Textarea
                            data-testid="input-activity-description"
                            placeholder="What will happen during this activity?"
                            className="resize-none bg-background/60 min-h-[90px] rounded-xl border-border/70 font-sans"
                            {...field}
                          />
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
                        <FormLabel className="text-foreground/80 font-sans text-sm">Your Name</FormLabel>
                        <FormControl>
                          <Input
                            data-testid="input-activity-author"
                            placeholder="Enter your name"
                            className="bg-background/60 h-11 rounded-xl border-border/70 font-sans"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    data-testid="button-submit-activity"
                    className="w-full h-11 rounded-xl font-bold font-sans tracking-wide shadow-sm active:scale-[0.98] transition-transform"
                    disabled={createActivity.isPending}
                  >
                    {createActivity.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                    Propose Activity
                  </Button>
                </form>
              </Form>
            </div>
          </TabsContent>

          {/* MESSAGES TAB */}
          <TabsContent value="messages" className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-400">

            <div className="space-y-3">
              <h2 className="font-serif text-2xl font-bold text-foreground">Community Messages</h2>
              {isLoadingMessages ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary/60" />
                </div>
              ) : !messages?.length ? (
                <div className="bg-card/60 rounded-2xl p-8 text-center border border-dashed border-border/60">
                  <MessageCircle className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm font-sans">No messages yet. Share your reflections!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((message, i) => (
                    <div
                      key={message.id}
                      data-testid={`message-card-${message.id}`}
                      className="bg-card rounded-2xl p-5 shadow-sm border border-border/60 animate-in fade-in slide-in-from-bottom-2"
                      style={{ animationDelay: `${i * 50}ms`, animationFillMode: "both" }}
                    >
                      <p className="text-foreground/90 text-base leading-relaxed font-serif italic mb-4">
                        "{message.content}"
                      </p>
                      <div className="flex justify-between items-center text-xs text-muted-foreground font-sans">
                        <span className="text-primary font-bold">— {message.authorName}</span>
                        <span>{format(new Date(message.createdAt), "MMM d, yyyy")}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Message form */}
            <div className="bg-card rounded-2xl p-5 shadow border border-foreground/10 relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-1 bg-foreground/20 rounded-t-2xl" />
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-serif text-lg font-bold text-foreground">Share a Message</h3>
                <span className="bg-foreground/10 text-foreground/70 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest font-sans">Member</span>
              </div>
              <Form {...messageForm}>
                <form onSubmit={messageForm.handleSubmit(onMessageSubmit)} className="space-y-4">
                  <FormField
                    control={messageForm.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground/80 font-sans text-sm">Your Message</FormLabel>
                        <FormControl>
                          <Textarea
                            data-testid="input-message-content"
                            placeholder="Share your realizations or thoughts..."
                            className="resize-none bg-background/60 min-h-[110px] rounded-xl border-border/70 font-sans"
                            {...field}
                          />
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
                        <FormLabel className="text-foreground/80 font-sans text-sm">Your Name</FormLabel>
                        <FormControl>
                          <Input
                            data-testid="input-message-author"
                            placeholder="Enter your name"
                            className="bg-background/60 h-11 rounded-xl border-border/70 font-sans"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    data-testid="button-submit-message"
                    variant="outline"
                    className="w-full h-11 rounded-xl font-bold font-sans tracking-wide active:scale-[0.98] transition-transform border-foreground/20 text-foreground hover:bg-foreground/5"
                    disabled={createMessage.isPending}
                  >
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
