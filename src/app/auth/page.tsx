"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Network, ArrowRight, Loader2, ShieldCheck, LockKeyhole } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { motion } from "framer-motion";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function AuthPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, user, router]);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    try {
      setIsLoading(true);
      await apiRequest("POST", "/api/login", values);
      window.location.href = "/dashboard"; // hard redirect to reload user state
    } catch (error: any) {
      toast({
        title: "Authentication Failed",
        description: error.message || "Invalid credentials provided.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background overflow-hidden relative">
      {/* Background decoration for the whole page */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/4 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Visual Side */}
      <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden bg-muted/30 border-r border-border/50">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Network className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold font-heading tracking-tight">Silicon POS</span>
        </div>

        <motion.div 
          {...{ className: "relative z-10 max-w-lg mt-auto mb-auto" } as any}
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <Badge variant="outline" className="mb-6 bg-background/50 backdrop-blur-sm border-primary/20 text-primary py-1 px-3">
            <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
            Secure Access Portal
          </Badge>
          <h1 className="text-5xl font-bold tracking-tight mb-6 text-foreground font-heading leading-[1.1]">
            Elevate your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">
              business operations.
            </span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
            The unified administrative interface for Point of Sale, Inventory Management, and intelligent Reporting.
          </p>
          
          <div className="mt-12 flex items-center gap-6">
            <div className="flex -space-x-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className={`w-10 h-10 rounded-full border-2 border-background flex items-center justify-center text-xs font-bold text-white shadow-sm`} style={{ backgroundColor: `hsl(var(--primary) / ${1 - i * 0.15})`, zIndex: 10 - i }}>
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <div className="text-sm font-medium">
              <span className="text-foreground">Trusted by</span>
              <br/>
              <span className="text-muted-foreground">top retail teams</span>
            </div>
          </div>
        </motion.div>
        
        <div className="relative z-10 text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Silicon Technologies Inc. All rights reserved.
        </div>
      </div>

      {/* Form Side */}
      <div className="flex items-center justify-center p-6 sm:p-12 relative z-10">
        <motion.div 
          {...{ className: "w-full max-w-[420px]" } as any}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} {...{ className: "lg:hidden flex justify-center mb-8" } as any}>
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <Network className="h-7 w-7" />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} {...{ className: "text-center lg:text-left mb-8" } as any}>
            <h2 className="text-3xl font-bold tracking-tight font-heading mb-2">Welcome back</h2>
            <p className="text-muted-foreground">
              Enter your credentials to access the system
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border-border/60 shadow-xl bg-background/60 backdrop-blur-xl overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-500" />
              <CardContent className="pt-8 pb-8 px-6 sm:px-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-foreground/90 font-medium">Username</FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                                <span className="font-semibold">@</span>
                              </div>
                              <Input 
                                placeholder="admin" 
                                {...field} 
                                disabled={isLoading}
                                className="pl-9 h-11 bg-muted/40 border-border/60 focus:bg-background transition-colors"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <div className="flex items-center justify-between">
                            <FormLabel className="text-foreground/90 font-medium">Password</FormLabel>
                            <a href="#" className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
                              Forgot password?
                            </a>
                          </div>
                          <FormControl>
                            <div className="relative group">
                              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                                <LockKeyhole className="h-4 w-4" />
                              </div>
                              <Input 
                                type="password" 
                                placeholder="••••••••" 
                                {...field} 
                                disabled={isLoading}
                                className="pl-9 h-11 bg-muted/40 border-border/60 focus:bg-background transition-colors"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full h-11 mt-6 font-semibold tracking-wide shadow-md hover:shadow-lg transition-all" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Authenticating...
                        </>
                      ) : (
                        <>
                          Sign In Securely
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants} {...{ className: "mt-8 text-center text-sm text-muted-foreground" } as any}>
            <p className="flex items-center justify-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              Protected by enterprise-grade encryption
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
