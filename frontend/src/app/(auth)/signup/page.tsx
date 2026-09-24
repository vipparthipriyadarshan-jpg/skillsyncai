"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { UserRole, USER_ROLES, DEFAULT_ROLE } from "@/lib/roles";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCircle, Lock, Mail, User, CheckCircle2 } from "lucide-react";
import { env } from "@/lib/env";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>(DEFAULT_ROLE);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        if (!env.isSupabaseConfigured) {
          setErrorMsg(
            "Supabase credentials are not yet configured in .env.local. Set up Supabase to enable persistent user registrations."
          );
        } else {
          setErrorMsg(error.message);
        }
      } else {
        if (data.session) {
          router.push("/dashboard");
        } else {
          setSuccessMsg(
            "Registration submitted successfully. Please check your email inbox to verify your account."
          );
        }
      }
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "An unexpected error occurred during signup."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl font-bold text-slate-900">
          Create Stakeholder Account
        </CardTitle>
        <CardDescription className="text-xs text-slate-500">
          Join the Skill Sync AI ecosystem with your operational role
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

        <form onSubmit={handleSignup} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Dr. Rajesh Sharma"
                className="w-full rounded-md border border-slate-300 py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:border-[#0284c7] focus:outline-none focus:ring-1 focus:ring-[#0284c7]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">
              Official Email Address
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

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full rounded-md border border-slate-300 py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:border-[#0284c7] focus:outline-none focus:ring-1 focus:ring-[#0284c7]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
              <span>Select Stakeholder Role</span>
              <span className="text-[11px] text-slate-400 font-normal">
                Configures access permissions
              </span>
            </label>
            <div className="grid grid-cols-1 gap-2 pt-1">
              {(Object.keys(USER_ROLES) as UserRole[]).map((rKey) => {
                const rConfig = USER_ROLES[rKey];
                const isSelected = role === rKey;
                return (
                  <div
                    key={rKey}
                    onClick={() => setRole(rKey)}
                    className={`cursor-pointer rounded-md border p-2.5 transition-all text-left flex items-start gap-2.5 ${
                      isSelected
                        ? "border-[#0284c7] bg-sky-50/50"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      checked={isSelected}
                      onChange={() => setRole(rKey)}
                      className="mt-1 h-3.5 w-3.5 text-[#0284c7] focus:ring-[#0284c7]"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        {rConfig.label}
                      </p>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        {rConfig.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0f2744] text-white hover:bg-[#1a3a60] mt-4"
          >
            {loading ? "Registering..." : "Create Account"}
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-500">
          Already registered?{" "}
          <Link href="/login" className="text-[#0284c7] font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
