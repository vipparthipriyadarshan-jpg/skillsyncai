import { NextResponse } from "next/server";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

export async function GET() {
  const timestamp = new Date().toISOString();

  return NextResponse.json(
    {
      status: "healthy",
      service: "Skill Sync AI",
      tagline: "Bridging Industry Demand and Workforce Skills",
      platform_edition: "enterprise",
      timestamp,
      supabase_configured: env.isSupabaseConfigured,
      ai_provider_configured: env.isAiConfigured,
      analytics_service_configured: env.isAnalyticsConfigured,
    },
    { status: 200 }
  );
}
