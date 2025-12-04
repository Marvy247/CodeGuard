"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, Zap, Lock, Activity } from "lucide-react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect to dashboard after 2 seconds
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-4xl mx-auto px-4 text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Logo/Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <Shield className="h-24 w-24 text-primary animate-pulse" />
            <div className="absolute inset-0 bg-primary/20 blur-3xl" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            CodeGuard
          </h1>
          <p className="text-2xl text-muted-foreground">
            AI-Powered Smart Contract Security
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8">
          <div className="flex flex-col items-center gap-2">
            <Zap className="h-8 w-8 text-yellow-500" />
            <p className="text-sm font-medium">Real-Time Detection</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Activity className="h-8 w-8 text-green-500" />
            <p className="text-sm font-medium">6 AI Agents</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Lock className="h-8 w-8 text-blue-500" />
            <p className="text-sm font-medium">8 MCP Tools</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Shield className="h-8 w-8 text-purple-500" />
            <p className="text-sm font-medium">24/7 Protection</p>
          </div>
        </div>

        {/* Loading/Redirect Message */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 border border-primary/20">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <p className="text-sm font-medium">Redirecting to dashboard...</p>
          </div>
          <p className="text-xs text-muted-foreground">
            Or click{" "}
            <button
              onClick={() => router.push("/dashboard")}
              className="underline underline-offset-2 hover:text-primary transition-colors"
            >
              here
            </button>{" "}
            to go now
          </p>
        </div>

        {/* Footer */}
        <div className="pt-8">
          <p className="text-xs text-muted-foreground">
            Built for NullShot Hacks Season 0 • Track 1 • Deployed on Base Sepolia
          </p>
        </div>
      </div>
    </div>
  );
}
