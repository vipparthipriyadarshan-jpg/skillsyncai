"use client";

import React, { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCircle, Mail, CheckCircle2, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/settings`,
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        setSuccessMsg(
          "Password reset link has been dispatched to your email address. Please follow the instructions in the email."
        );
      }
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "Failed to request password reset."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl font-bold text-slate-900">
          Reset Password
        </CardTitle>
        <CardDescription className="text-xs text-slate-500">
          Enter your registered work email to receive password recovery instructions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {errorMsg && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-800 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
            <div>{errorMsg}</div>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
            <div>{successMsg}</div>
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Work Email Address
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

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0f2744] text-white hover:bg-[#1a3a60]"
          >
            {loading ? "Sending link..." : "Send Reset Instructions"}
          </Button>
        </form>

        <div className="mt-4 pt-4 border-t border-slate-100 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs text-[#0284c7] font-medium hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Sign In
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
