import { NextRequest, NextResponse } from "next/server";
import {
  getSkillRadarData,
  getSkillProfile,
  RadarFilterOptions,
} from "@/lib/analytics/radar-service";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // 1. Check if inspecting an individual skill profile
    const skillSlug = searchParams.get("skillSlug");
    if (skillSlug) {
      const profile = getSkillProfile(skillSlug);
      if (!profile) {
        return NextResponse.json(
          { error: `Skill profile for '${skillSlug}' was not found in active dataset.` },
          { status: 404 }
        );
      }
      return NextResponse.json(profile, { status: 200 });
    }

    // 2. Parse Radar filter parameters
    const district = searchParams.get("district") || undefined;
    const industry = searchParams.get("industry") || undefined;
    const timeRange = (searchParams.get("timeRange") as RadarFilterOptions["timeRange"]) || undefined;
    const trajectory = (searchParams.get("trajectory") as RadarFilterOptions["trajectory"]) || undefined;
    const search = searchParams.get("search") || undefined;
    const page = searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : 1;
    const pageSize = searchParams.get("pageSize") ? parseInt(searchParams.get("pageSize")!, 10) : 10;

    const options: RadarFilterOptions = {
      district,
      industry,
      timeRange,
      trajectory,
      search,
      page,
      pageSize,
    };

    const data = getSkillRadarData(options);
    return NextResponse.json(data, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to calculate skill demand radar data.";
    console.error("[Radar API Error]:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
