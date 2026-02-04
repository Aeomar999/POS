import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Network,
  Camera,
  Headphones,
  Wrench,
  Shield,
  Zap,
  ArrowRight,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-sm">
                ST
              </div>
              <span className="font-semibold text-lg hidden sm:block">
                Silicon Technologies POS
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button asChild data-testid="button-login">
                <a href="/api/login">
                  Staff Login
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                  <span className="text-foreground">Advanced</span>{" "}
                  <span className="text-primary">POS System</span>
                  <br />
                  <span className="text-foreground">for IT Businesses</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-xl">
                  Streamline your networking hardware, CCTV, and service sales 
                  with Silicon Technologies' integrated Point of Sale and 
                  Inventory Management solution.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild data-testid="button-get-started">
                  <a href="/api/login">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  data-testid="button-learn-more"
                >
                  Learn More
                </Button>
              </div>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>Secure System</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  <span>Fast & Reliable</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent rounded-3xl" />
              <div className="relative bg-gradient-to-br from-card to-muted rounded-3xl p-8 border shadow-xl">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-background/80 rounded-xl p-6 space-y-2 border">
                    <Network className="h-8 w-8 text-primary" />
                    <h3 className="font-semibold">Networking</h3>
                    <p className="text-sm text-muted-foreground">
                      Routers, Switches, Cables
                    </p>
                  </div>
                  <div className="bg-background/80 rounded-xl p-6 space-y-2 border">
                    <Camera className="h-8 w-8 text-primary" />
                    <h3 className="font-semibold">CCTV</h3>
                    <p className="text-sm text-muted-foreground">
                      Security Cameras
                    </p>
                  </div>
                  <div className="bg-background/80 rounded-xl p-6 space-y-2 border">
                    <Headphones className="h-8 w-8 text-primary" />
                    <h3 className="font-semibold">Intercom</h3>
                    <p className="text-sm text-muted-foreground">
                      Communication Systems
                    </p>
                  </div>
                  <div className="bg-background/80 rounded-xl p-6 space-y-2 border">
                    <Wrench className="h-8 w-8 text-primary" />
                    <h3 className="font-semibold">Services</h3>
                    <p className="text-sm text-muted-foreground">
                      Installation & Support
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Why Choose Silicon Technologies?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We provide comprehensive IT solutions tailored to your business
              needs with professional service and support.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-8 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Network className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Quality Products</h3>
                <p className="text-muted-foreground">
                  Premium networking equipment, CCTV cameras, and IT hardware
                  from trusted manufacturers.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-8 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Wrench className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Expert Installation</h3>
                <p className="text-muted-foreground">
                  Professional installation services by certified technicians
                  ensuring optimal performance.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-8 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Reliable Support</h3>
                <p className="text-muted-foreground">
                  Ongoing maintenance and training services to keep your systems
                  running smoothly.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-xs">
              ST
            </div>
            <span className="font-medium">Silicon Technologies</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Silicon Technologies. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
