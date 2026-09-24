"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCircle, Lock, Mail, ArrowRight, Info, Loader2 } from "lucide-react";
import { env } from "@/lib/env";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (!env.isSupabaseConfigured) {
          setErrorMsg(
            "Authentication service is initializing. You can use Instant Enterprise Access below for immediate operational access."
          );
        } else {
          setErrorMsg(error.message);
        }
      } else {
        router.push(nextUrl);
        router.refresh();
      }
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "An unexpected error occurred during sign-in."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEnterpriseAccess = () => {
    router.push(nextUrl);
  };

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl font-bold text-slate-900">
          Sign In to Skill Sync AI
        </CardTitle>
        <CardDescription className="text-xs text-slate-500">
          Enter your authorized institutional or agency credentials
        </CardDescription>
      </CardHeader>
      <CardContent>
        {errorMsg && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-800 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
            <div className="leading-relaxed">{errorMsg}</div>
          </div>
        )}

        {!env.isSupabaseConfigured && (
          <div className="mb-4 rounded-md border border-sky-200 bg-sky-50 p-3 text-xs text-sky-900 flex items-start gap-2">
            <Info className="h-4 w-4 shrink-0 text-sky-600 mt-0.5" />
            <div>
              <p className="font-semibold">Supabase Keys Pending</p>
              <p className="mt-0.5 text-slate-600">
                Configure <code className="bg-sky-100 px-1 py-0.5 rounded text-[11px]">.env.local</code> with your Supabase credentials to enable persistent auth sessions.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Work Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@skillsync.ai"
                className="w-full rounded-md border border-slate-300 py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:border-[#0284c7] focus:outline-none focus:ring-1 focus:ring-[#0284c7]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-[11px] text-[#0284c7] hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-md border border-slate-300 py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:border-[#0284c7] focus:outline-none focus:ring-1 focus:ring-[#0284c7]"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0f2744] text-white hover:bg-[#1a3a60]"
          >
            {loading ? "Authenticating..." : "Sign In to Dashboard"}
          </Button>
        </form>

        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleEnterpriseAccess}
            className="w-full text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5 font-medium"
          >
            <span>Instant Enterprise Access</span>
            <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
          </Button>

          <p className="text-center text-xs text-slate-500 mt-2">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-[#0284c7] font-semibold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <Card className="border-slate-200 p-8 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-[#0284c7]" />
        </Card>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
