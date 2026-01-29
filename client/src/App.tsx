import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Jobs from "@/pages/Jobs";
import Contact from "@/pages/Contact";
import Admin from "@/pages/Admin";
import Login from "@/pages/Login";
import DesignSettings from "@/pages/DesignSettings";
import ChangePassword from "@/pages/ChangePassword";
import ResetPassword from "@/pages/ResetPassword";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/jobs" component={Jobs} />
      <Route path="/contact" component={Contact} />
      <Route path="/login" component={Login} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin/design" component={DesignSettings} />
      <Route path="/admin/password" component={ChangePassword} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
