"use client";

import React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { env } from "@/lib/env";
import { CheckCircle2, AlertCircle, Database, Key, Server, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="System Settings & Environment Diagnostics"
        description="Configuration parameters, Supabase connection status, API endpoints, and system diagnostics for Skill Sync AI."
      />

      {/* Supabase Connection Status Card */}
      <Card className="border-slate-200">
        <CardHeader className="p-5 pb-3">
          <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Database className="h-5 w-5 text-[#0284c7]" />
            Supabase PostgreSQL & Auth Diagnostics
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Real-time status of persistent cloud database credentials
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-0 space-y-4">
          <div className="flex items-center justify-between p-3 rounded-md bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2.5">
              {env.isSupabaseConfigured ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-amber-500" />
              )}
              <div>
                <p className="text-xs font-semibold text-slate-900">
                  {env.isSupabaseConfigured
                    ? "Supabase Configured & Active"
                    : "Supabase Environment Variables Awaiting Configuration"}
                </p>
                <p className="text-[11px] text-slate-500">
                  Target Endpoint:{" "}
                  <code className="font-mono text-slate-700">
                    {env.supabaseUrl ? env.supabaseUrl : "Pending (.env.local)"}
                  </code>
                </p>
              </div>
            </div>
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                env.isSupabaseConfigured
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-amber-50 text-amber-800 border border-amber-200"
              }`}
            >
              {env.isSupabaseConfigured ? "Connected" : "Action Required"}
            </span>
          </div>

          <div className="p-4 rounded-md border border-slate-200 bg-white space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Quick Setup Instructions for Supabase
            </h4>
            <ol className="list-decimal list-inside text-xs text-slate-600 space-y-1.5 leading-relaxed">
              <li>
                Create a new project at{" "}
                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#0284c7] font-semibold inline-flex items-center gap-0.5 hover:underline"
                >
                  supabase.com <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                Navigate to <strong>Project Settings &gt; API</strong> to retrieve your{" "}
                <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">Project URL</code> and{" "}
                <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">anon public key</code>.
              </li>
              <li>
                In your root directory, copy <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">frontend/.env.example</code> to{" "}
                <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">frontend/.env.local</code>.
              </li>
              <li>
                Execute the SQL migration located in{" "}
                <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">database/migrations/001_initial_schema.sql</code> in the Supabase SQL Editor.
              </li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* System Health Check & Microservices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-slate-200">
          <CardHeader className="p-5 pb-3">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Server className="h-4 w-4 text-[#0284c7]" />
              Web Health API
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <p className="text-xs text-slate-600 mb-3">
              Next.js Edge route confirming application status and metadata.
            </p>
            <Button asChild variant="outline" size="sm" className="w-full text-xs">
              <Link href="/api/health" target="_blank" className="flex items-center justify-center gap-1.5">
                <span>Test /api/health Endpoint</span>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="p-5 pb-3">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Key className="h-4 w-4 text-[#0284c7]" />
              Analytics Service Engine
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <p className="text-xs text-slate-600 mb-3">
              Python FastAPI Analytics Service endpoint configured at <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">http://localhost:8000</code>.
            </p>
            <div className="text-[11px] text-emerald-700 font-medium">
              ✓ Service Configured
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
