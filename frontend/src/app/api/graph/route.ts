import { NextRequest, NextResponse } from "next/server";
import { buildSkillGraph } from "@/lib/graph/service";
import { GraphNodeType } from "@/lib/graph/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get("search") || undefined;
    const sector = searchParams.get("sector") || undefined;
    const district = searchParams.get("district") || undefined;
    const typesParam = searchParams.get("types");

    let nodeTypes: GraphNodeType[] | undefined = undefined;
    if (typesParam) {
      nodeTypes = typesParam.split(",").map((t) => t.trim() as GraphNodeType);
    }

    const graphData = buildSkillGraph({
      searchQuery,
      sector,
      district,
      nodeTypes,
    });

    return NextResponse.json({
      success: true,
      ...graphData,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error generating Skill Graph:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate dynamic skill graph",
        details: message,
      },
      { status: 500 }
    );
  }
}
