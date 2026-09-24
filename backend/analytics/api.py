"""
FastAPI REST API for Skill Sync AI Labour Market Analytics Service.
Exposes clean, deterministic endpoints for labor market computations.
"""

from typing import List
from datetime import datetime, timezone
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from .config import AnalyticsConfig, DEFAULT_CONFIG
from .models import (
    AnalyticsDatasetInput,
    AnalyticsReportResponse,
    SkillFrequencyMetric,
    TrendVelocityMetric,
    DimensionalDemandMetric,
    RoleDemandSummary,
    ProficiencyBreakdown,
)
from .engine import LabourMarketAnalyticsEngine

app = FastAPI(
    title="Skill Sync AI - Labour Market Analytics Engine",
    description="Deterministic mathematical analytics API for industry demand and skill trends.",
    version="1.0.0",
)

# Enable secure CORS for Next.js frontend communication (RFC 6454 compliant)
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-User-Role"],
)

engine = LabourMarketAnalyticsEngine(config=DEFAULT_CONFIG)


@app.get("/api/v1/analytics/health", status_code=status.HTTP_200_OK)
def health_check():
    """Health status and configuration inspection endpoint."""
    return {
        "status": "healthy",
        "service": "Skill Sync AI Labour Market Analytics Engine",
        "version": "1.0.0",
        "engine_type": "deterministic_mathematical",
        "thresholds": {
            "emerging_growth_threshold_pct": engine.config.emerging_growth_threshold,
            "growing_threshold_pct": engine.config.growing_threshold,
            "declining_threshold_pct": engine.config.declining_threshold,
            "min_postings_for_trajectory": engine.config.min_postings_for_trajectory,
            "min_employers_for_emerging": engine.config.min_employers_for_emerging,
            "min_vacancies_for_emerging": engine.config.min_vacancies_for_emerging,
        },
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@app.post(
    "/api/v1/analytics/calculate",
    response_model=AnalyticsReportResponse,
    status_code=status.HTTP_200_OK,
    summary="Compute Comprehensive Labour Market Report",
)
def calculate_full_report(payload: AnalyticsDatasetInput) -> AnalyticsReportResponse:
    """Computes all 10 core metrics and returns comprehensive report with audit lineage."""
    try:
        return engine.calculate_full_report(payload)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Analytics calculation error: {str(e)}")


@app.post(
    "/api/v1/analytics/skills/frequency",
    response_model=List[SkillFrequencyMetric],
    status_code=status.HTTP_200_OK,
    summary="Skill Frequency Analysis",
)
def get_skill_frequencies(payload: AnalyticsDatasetInput) -> List[SkillFrequencyMetric]:
    """Calculates skill posting frequencies and vacancy volumes."""
    return engine.calculate_skill_frequencies(payload.postings)


@app.post(
    "/api/v1/analytics/skills/trends",
    response_model=List[TrendVelocityMetric],
    status_code=status.HTTP_200_OK,
    summary="Skill Velocity & Trajectory Trends",
)
def get_skill_trends(payload: AnalyticsDatasetInput) -> List[TrendVelocityMetric]:
    """Calculates temporal growth rates, decline rates, and trajectory classifications."""
    report = engine.calculate_full_report(payload)
    return report.trends


@app.post(
    "/api/v1/analytics/skills/emerging",
    response_model=List[TrendVelocityMetric],
    status_code=status.HTTP_200_OK,
    summary="Emerging Skill Candidates",
)
def get_emerging_skills(payload: AnalyticsDatasetInput) -> List[TrendVelocityMetric]:
    """Filters skills meeting strict emerging velocity and multi-employer criteria."""
    report = engine.calculate_full_report(payload)
    return report.emerging_candidates


@app.post(
    "/api/v1/analytics/skills/by-district",
    response_model=List[DimensionalDemandMetric],
    status_code=status.HTTP_200_OK,
    summary="Skill Demand Sliced by District",
)
def get_district_demand(payload: AnalyticsDatasetInput) -> List[DimensionalDemandMetric]:
    """Breakdown of skill demand across geographic districts."""
    report = engine.calculate_full_report(payload)
    return report.district_demand


@app.post(
    "/api/v1/analytics/skills/by-industry",
    response_model=List[DimensionalDemandMetric],
    status_code=status.HTTP_200_OK,
    summary="Skill Demand Sliced by Industry",
)
def get_industry_demand(payload: AnalyticsDatasetInput) -> List[DimensionalDemandMetric]:
    """Breakdown of skill demand across industry sectors."""
    report = engine.calculate_full_report(payload)
    return report.industry_demand


@app.post(
    "/api/v1/analytics/roles/demand",
    response_model=List[RoleDemandSummary],
    status_code=status.HTTP_200_OK,
    summary="Occupational Role Demand Summary",
)
def get_role_demand(payload: AnalyticsDatasetInput) -> List[RoleDemandSummary]:
    """Aggregates vacancies and top demanded skills per occupational role."""
    return engine.calculate_role_demand(payload.postings)


@app.post(
    "/api/v1/analytics/proficiencies",
    response_model=List[ProficiencyBreakdown],
    status_code=status.HTTP_200_OK,
    summary="Proficiency Tier Distribution",
)
def get_proficiency_demand(payload: AnalyticsDatasetInput) -> List[ProficiencyBreakdown]:
    """Distributes skill requirements across introductory, intermediate, advanced, and expert."""
    report = engine.calculate_full_report(payload)
    return report.proficiency_demand
