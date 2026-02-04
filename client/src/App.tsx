import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldX } from "lucide-react";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import POS from "@/pages/pos";
import Products from "@/pages/products";
import Services from "@/pages/services";
import Staff from "@/pages/staff";
import Inventory from "@/pages/inventory";
import Reports from "@/pages/reports";
import type { StaffUser } from "@shared/schema";

// Access Denied Page
function AccessDenied() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <ShieldX className="h-12 w-12 mx-auto text-destructive mb-2" />
          <CardTitle className="text-xl">Access Denied</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          You don't have permission to access this page. Contact your administrator if you believe this is an error.
        </CardContent>
      </Card>
    </div>
  );
}

// Role-based route guard
interface RoleGuardProps {
  allowedRoles: string[];
  staffUser: StaffUser | undefined;
  isLoading?: boolean;
  children: React.ReactNode;
}

function RoleGuard({ allowedRoles, staffUser, isLoading, children }: RoleGuardProps) {
  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  
  if (!staffUser) {
    return <AccessDenied />;
  }
  
  if (!allowedRoles.includes(staffUser.role)) {
    return <AccessDenied />;
  }
  
  return <>{children}</>;
}

function AuthenticatedRouter() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();

  const { data: staffUser, isLoading: staffLoading } = useQuery<StaffUser>({
    queryKey: ["/api/staff/me"],
    enabled: isAuthenticated,
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="space-y-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-xl mx-auto">
            ST
          </div>
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Landing />;
  }

  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={sidebarStyle as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar staffUser={staffUser} />
        <div className="flex flex-col flex-1 min-w-0">
          <header className="flex items-center justify-between gap-4 p-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-auto">
            <Switch>
              <Route path="/" component={Dashboard} />
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/pos" component={POS} />
              <Route path="/products">
                <RoleGuard allowedRoles={["admin", "manager"]} staffUser={staffUser} isLoading={staffLoading}>
                  <Products />
                </RoleGuard>
              </Route>
              <Route path="/services">
                <RoleGuard allowedRoles={["admin", "manager"]} staffUser={staffUser} isLoading={staffLoading}>
                  <Services />
                </RoleGuard>
              </Route>
              <Route path="/staff">
                <RoleGuard allowedRoles={["admin"]} staffUser={staffUser} isLoading={staffLoading}>
                  <Staff />
                </RoleGuard>
              </Route>
              <Route path="/inventory">
                <RoleGuard allowedRoles={["admin", "manager"]} staffUser={staffUser} isLoading={staffLoading}>
                  <Inventory />
                </RoleGuard>
              </Route>
              <Route path="/reports">
                <RoleGuard allowedRoles={["admin", "manager"]} staffUser={staffUser} isLoading={staffLoading}>
                  <Reports />
                </RoleGuard>
              </Route>
              <Route component={NotFound} />
            </Switch>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="silicon-pos-theme">
        <TooltipProvider>
          <AuthenticatedRouter />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
