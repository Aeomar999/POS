"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldX, Search, Bell, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { NotificationBell } from "@/components/notification-bell";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Skeleton className="h-32 w-32 rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Define route-to-role mapping
  // This logic is abstracted from App.tsx mapping paths to allowedRoles
  const routeRoles: Record<string, string[]> = {
    "/dashboard": ["admin", "manager", "sales"],
    "/pos": ["admin", "manager", "sales"],
    "/inventory": ["admin", "manager"],
    "/products": ["admin", "manager"],
    "/services": ["admin", "manager"],
    "/reports": ["admin", "manager"],
    "/staff": ["admin"],
  };

  const allowedRoles = routeRoles[pathname] || ["admin", "manager", "sales"];
  const userRole = user?.role || "sales";

  const getPageTitle = () => {
    const route = pathname.split("/").filter(Boolean)[0];
    if (!route) return "Dashboard";
    return route.charAt(0).toUpperCase() + route.slice(1);
  };

  if (!allowedRoles.includes(userRole)) {
    return (
      <SidebarProvider>
        <div className="flex h-screen w-full bg-muted/20 overflow-hidden relative">
          <AppSidebar staffUser={user} />
          <main className="flex-1 overflow-auto flex items-center justify-center p-6 bg-background/50">
            <Card className="max-w-md w-full shadow-lg border-destructive/20">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-destructive/10 p-3">
                    <ShieldX className="h-10 w-10 text-destructive" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-destructive font-heading tracking-tight">Access Denied</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-muted-foreground text-sm">
                  You do not have the necessary permissions to view this page.
                  Your current role is <strong className="font-semibold capitalize text-foreground">{userRole}</strong>.
                </p>
                <p className="text-muted-foreground text-sm">
                  This page requires one of the following roles: {allowedRoles.map(r => <strong key={r} className="font-semibold capitalize text-foreground mx-1">{r}</strong>)}
                </p>
              </CardContent>
            </Card>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-accent/20 overflow-hidden relative">
        <AppSidebar staffUser={user} />
        <div className="flex flex-col flex-1 overflow-hidden w-full">
          <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 z-10 sticky top-0 shadow-sm">
            <SidebarTrigger className="-ml-2" />
            <div className="flex flex-1 items-center justify-between">
              <h1 className="text-xl font-bold font-heading tracking-tight capitalize text-foreground">
                {getPageTitle()}
              </h1>
              <div className="flex items-center gap-3">
                <div className="hidden md:flex relative group w-64">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    type="search"
                    placeholder="Search anywhere..."
                    className="w-full pl-9 pr-4 bg-muted/40 border-border/50 focus-visible:bg-background transition-all shadow-none rounded-full"
                  />
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center">
                    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                      <span className="text-xs">⌘</span>K
                    </kbd>
                  </div>
                </div>
                <NotificationBell />
                <ThemeToggle />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full hover:bg-muted/50 h-9 w-9 border border-border/10 shadow-sm transition-all text-muted-foreground hover:text-foreground"
                  onClick={() => router.push('/settings')}
                >
                  <Settings className="h-4 w-4" />
                  <span className="sr-only">Settings</span>
                </Button>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 bg-background">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
