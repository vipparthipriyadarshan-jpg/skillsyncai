import { NextRequest, NextResponse } from "next/server";
import {
  runWorkforceSimulation,
  saveSimulationScenario,
  getSavedScenarios,
  compareScenarios,
} from "@/lib/simulator/engine";
import { SimulatorScenarioInput } from "@/lib/simulator/types";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limiter";

export const dynamic = "force-dynamic";

/**
 * GET /api/simulator
 * Retrieve saved scenarios or run scenario comparisons.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const scenarioIdsParam = searchParams.get("scenarioIds");

    const savedScenarios = getSavedScenarios();

    let comparison = null;
    if (scenarioIdsParam) {
      const ids = scenarioIdsParam.split(",").map((s) => s.trim()).filter(Boolean);
      comparison = compareScenarios(ids);
    } else if (savedScenarios.length >= 2) {
      // Default compare first two scenarios
      comparison = compareScenarios([savedScenarios[0].id, savedScenarios[1].id]);
    }

    return NextResponse.json({
      success: true,
      savedScenarios,
      comparison,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * POST /api/simulator
 * Execute mathematical workforce simulation.
 */
export async function POST(req: NextRequest) {
  // 1. Rate Limiting: Max 30 simulations per minute
  const clientIp = getClientIp(req);
  const rateLimit = checkRateLimit(`sim-exec:${clientIp}`, { limit: 30, windowMs: 60 * 1000 });
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many simulation requests. Please wait." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rateLimit.resetMs / 1000)) } }
    );
  }

  try {
    const body: SimulatorScenarioInput = await req.json();

    if (!body.sector || typeof body.demandChangePct !== "number" || !Number.isFinite(body.demandChangePct)) {
      return NextResponse.json(
        { error: "Invalid payload: 'sector' and a finite numeric 'demandChangePct' are required." },
        { status: 400 }
      );
    }

    // Input bounds: demand change must be between -100% and +500%
    if (body.demandChangePct < -100 || body.demandChangePct > 500) {
      return NextResponse.json(
        { error: "Demand change percentage out of range (-100% to +500%)." },
        { status: 400 }
      );
    }

    const output = runWorkforceSimulation({
      sector: body.sector,
      demandChangePct: body.demandChangePct,
      districtScope: body.districtScope || "all",
      policyTitle: body.policyTitle,
      notes: body.notes,
    });

    return NextResponse.json({
      success: true,
      output,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Simulation Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * PUT /api/simulator
 * Save a policy simulation scenario.
 */
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, author, authorRole, notes, output } = body;

    if (!output || !output.scenarioId) {
      return NextResponse.json(
        { error: "Missing required 'output' object from simulation run." },
        { status: 400 }
      );
    }

    const saved = saveSimulationScenario({
      title: title || "Workforce Policy Simulation",
      author: author || "State Planning Board",
      authorRole: authorRole || "Policy Officer",
      notes: notes || "",
      output,
    });

    return NextResponse.json({
      success: true,
      savedScenario: saved,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save scenario";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
