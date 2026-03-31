import { useParams, Link } from "wouter";
import { 
  useGetPurpose, 
  useGetActivities, 
  useGetMessages, 
  useCreateActivity, 
  useCreateMessage,
  getGetActivitiesQueryKey,
  getGetMessagesQueryKey
} from "@workspace/api-client-react";
import { ArrowLeft, MessageCircle, CalendarHeart, Loader2 } from "lucide-react";
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
    query: { enabled: !!id }
  });

  const { data: activities, isLoading: isLoadingActivities } = useGetActivities(id, {
    query: { enabled: !!id }
  });

  const { data: messages, isLoading: isLoadingMessages } = useGetMessages(id, {
    query: { enabled: !!id }
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
      onError: () => toast.error("Failed to propose activity")
    });
  };

  const onMessageSubmit = (data: z.infer<typeof messageSchema>) => {
    createMessage.mutate({ purposeId: id, data }, {
      onSuccess: () => {
        toast.success("Message shared successfully");
        messageForm.reset();
        queryClient.invalidateQueries({ queryKey: getGetMessagesQueryKey(id) });
      },
      onError: () => toast.error("Failed to share message")
    });
  };

  if (isLoadingPurpose) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium animate-pulse">Loading Devotional Content...</p>
        </div>
      </div>
    );
  }

  if (!purpose) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-background p-6 text-center">
        <h2 className="font-serif text-2xl mb-4 text-foreground">Purpose not found</h2>
        <Link href="/" className="text-primary font-medium hover:underline flex items-center justify-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-background pb-20 overflow-x-hidden">
      {/* Header */}
      <div className="bg-primary/10 px-5 pt-12 pb-14 rounded-b-[2.5rem] relative shadow-sm">
        <Link href="/" className="absolute top-10 left-5 w-10 h-10 flex items-center justify-center rounded-full bg-card/90 backdrop-blur-sm text-foreground shadow-sm hover:scale-105 transition-transform">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="max-w-md mx-auto mt-12 text-center animate-in slide-in-from-bottom-2 fade-in duration-500">
          <span className="text-primary font-bold tracking-widest text-xs uppercase mb-3 block">
            Purpose {purpose.number}
          </span>
          <h1 className="font-serif text-3xl font-bold text-foreground leading-tight mb-4 px-2">
            {purpose.title}
          </h1>
          <p className="text-muted-foreground text-[15px] leading-relaxed px-1">
            {purpose.fullDescription || purpose.shortDescription}
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-5 -mt-6">
        <Tabs defaultValue="activities" className="w-full">
          <TabsList className="w-full grid grid-cols-2 h-[3.5rem] bg-card/80 backdrop-blur rounded-2xl shadow-sm border p-1.5 mb-8">
            <TabsTrigger value="activities" className="rounded-xl font-semibold data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none transition-all">
              <CalendarHeart className="w-4 h-4 mr-2" />
              Activities
            </TabsTrigger>
            <TabsTrigger value="messages" className="rounded-xl font-semibold data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none transition-all">
              <MessageCircle className="w-4 h-4 mr-2" />
              Messages
            </TabsTrigger>
          </TabsList>

          <TabsContent value="activities" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-4">
              <h2 className="font-serif text-xl font-bold text-foreground flex items-center">
                <span className="w-1.5 h-6 bg-primary rounded-full mr-3"></span>
                Proposed Activities
              </h2>
              {isLoadingActivities ? (
                <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-primary/50" /></div>
              ) : activities?.length === 0 ? (
                <div className="bg-card/50 rounded-2xl p-8 text-center border border-dashed border-border/60 shadow-sm">
                  <CalendarHeart className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground font-medium text-sm">No activities proposed yet. Be the first to suggest one!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activities?.map((activity, i) => (
                    <div 
                      key={activity.id} 
                      className="bg-card rounded-[1.25rem] p-5 shadow-sm border border-border/80 animate-in fade-in slide-in-from-bottom-2"
                      style={{ animationDelay: `${i * 50}ms`, animationFillMode: "both" }}
                    >
                      <h3 className="font-serif font-bold text-lg text-foreground mb-1.5">{activity.title}</h3>
                      <p className="text-muted-foreground text-[15px] mb-4 leading-relaxed">{activity.description}</p>
                      <div className="flex justify-between items-center text-xs text-muted-foreground/80 font-medium pt-3 border-t border-border/40">
                        <span className="text-foreground/80 font-semibold">By {activity.authorName}</span>
                        <span>{format(new Date(activity.createdAt), "MMM d, yyyy")}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-card rounded-[1.25rem] p-6 shadow-md border border-primary/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10" />
              <div className="mb-6 pb-4 border-b border-border/60 flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-foreground">Propose Activity</h3>
                <span className="bg-primary/10 text-primary text-[10px] font-bold px-2.5 py-1.5 rounded-lg uppercase tracking-widest">Admin</span>
              </div>
              <Form {...activityForm}>
                <form onSubmit={activityForm.handleSubmit(onActivitySubmit)} className="space-y-5">
                  <FormField
                    control={activityForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground/80">Activity Title</FormLabel>
                        <FormControl>
                          <Input placeholder="E.g., Sunday Feast Program" className="bg-background/50 h-12 rounded-xl border-border/80 focus-visible:ring-primary/30" {...field} />
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
                        <FormLabel className="text-foreground/80">Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="What will happen during this activity?" className="resize-none bg-background/50 min-h-[100px] rounded-xl border-border/80 focus-visible:ring-primary/30" {...field} />
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
                        <FormLabel className="text-foreground/80">Your Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your name" className="bg-background/50 h-12 rounded-xl border-border/80 focus-visible:ring-primary/30" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full h-12 rounded-xl text-[15px] font-bold tracking-wide shadow-md active:scale-[0.98] transition-transform" disabled={createActivity.isPending}>
                    {createActivity.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                    Propose Activity
                  </Button>
                </form>
              </Form>
            </div>
          </TabsContent>

          <TabsContent value="messages" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-4">
              <h2 className="font-serif text-xl font-bold text-foreground flex items-center">
                <span className="w-1.5 h-6 bg-secondary-foreground/30 rounded-full mr-3"></span>
                Community Messages
              </h2>
              {isLoadingMessages ? (
                <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-primary/50" /></div>
              ) : messages?.length === 0 ? (
                <div className="bg-card/50 rounded-2xl p-8 text-center border border-dashed border-border/60 shadow-sm">
                  <MessageCircle className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground font-medium text-sm">No messages shared yet. Share your thoughts!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages?.map((message, i) => (
                    <div 
                      key={message.id} 
                      className="bg-card rounded-[1.25rem] p-6 shadow-sm border border-border/80 relative animate-in fade-in slide-in-from-bottom-2"
                      style={{ animationDelay: `${i * 50}ms`, animationFillMode: "both" }}
                    >
                      <div className="absolute top-0 right-6 -translate-y-1/2 bg-background p-1.5 rounded-full">
                        <MessageCircle className="w-4 h-4 text-primary/30 fill-primary/10" />
                      </div>
                      <p className="text-foreground/90 text-[15px] mb-5 leading-relaxed font-serif italic">"{message.content}"</p>
                      <div className="flex justify-between items-center text-xs text-muted-foreground/80 font-medium">
                        <span className="text-primary font-bold tracking-wide">— {message.authorName}</span>
                        <span>{format(new Date(message.createdAt), "MMM d, yyyy")}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-card rounded-[1.25rem] p-6 shadow-md border border-secondary/40 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-bl-full -z-10" />
              <div className="mb-6 pb-4 border-b border-border/60 flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-foreground">Share a Message</h3>
                <span className="bg-secondary text-secondary-foreground text-[10px] font-bold px-2.5 py-1.5 rounded-lg uppercase tracking-widest">Member</span>
              </div>
              <Form {...messageForm}>
                <form onSubmit={messageForm.handleSubmit(onMessageSubmit)} className="space-y-5">
                  <FormField
                    control={messageForm.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground/80">Message</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Share your realizations or thoughts..." className="resize-none bg-background/50 min-h-[120px] rounded-xl border-border/80 focus-visible:ring-secondary/50" {...field} />
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
                        <FormLabel className="text-foreground/80">Your Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your name" className="bg-background/50 h-12 rounded-xl border-border/80 focus-visible:ring-secondary/50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full h-12 rounded-xl text-[15px] font-bold tracking-wide shadow-md active:scale-[0.98] transition-transform bg-secondary text-secondary-foreground hover:bg-secondary/90" disabled={createMessage.isPending}>
                    {createMessage.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
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
