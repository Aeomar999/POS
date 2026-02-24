"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { ArrowRight, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Layers className="h-6 w-6 text-primary" />
              </div>
              <span className="font-bold text-xl tracking-tight text-foreground">
                Silicon Tech
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button asChild data-testid="button-login">
                <Link href="/auth">
                  Staff Login
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-background pt-16 sm:pt-24 lg:pt-32 pb-16">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-foreground mb-8">
                Unified Management for
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600 mt-2">
                  Modern Retail
                </span>
              </h1>
              <p className="max-w-2xl mx-auto text-xl text-muted-foreground mb-10 leading-relaxed">
                Streamline your point of sale, manage inventory with precision, and track service requests all brilliantly contained in one powerful platform.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <Button size="lg" asChild data-testid="button-get-started">
                  <Link href="/auth">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
