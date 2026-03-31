import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Purposes from "@/pages/purposes";
import PurposeDetail from "@/pages/purpose-detail";
import Why from "@/pages/why";
import When from "@/pages/when";
import Vision from "@/pages/vision";
import Register from "@/pages/register";
import Survey from "@/pages/survey";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/purposes" component={Purposes} />
      <Route path="/purpose/:id" component={PurposeDetail} />
      <Route path="/why" component={Why} />
      <Route path="/when" component={When} />
      <Route path="/vision" component={Vision} />
      <Route path="/register" component={Register} />
      <Route path="/survey" component={Survey} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
