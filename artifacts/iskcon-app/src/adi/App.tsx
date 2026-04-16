import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/adi/context/AuthContext";
import NotFound from "@/adi/pages/not-found";
import Home from "@/adi/pages/home";
import Purposes from "@/adi/pages/purposes";
import PurposeDetail from "@/adi/pages/purpose-detail";
import Why from "@/adi/pages/why";
import When from "@/adi/pages/when";
import Vision from "@/adi/pages/vision";
import Register from "@/adi/pages/register";
import Survey from "@/adi/pages/survey";

const queryClient = new QueryClient();

function AppRoutes() {
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
          <WouterRouter>
            <AppRoutes />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
