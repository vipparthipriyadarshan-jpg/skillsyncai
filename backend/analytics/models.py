"""
Pydantic Schemas and Data Models for Skill Sync AI Labour Market Analytics.
Strict typing ensures data cleanliness, serialization safety, and schema contracts.
"""

from typing import List, Dict, Optional, Literal
from pydantic import BaseModel, Field


class JobSkillInput(BaseModel):
    """Normalized skill entity associated with a job posting."""
    name: str = Field(..., description="Canonical or clean name of the skill")
    slug: str = Field(..., description="Standardized slug identifier")
    category: str = Field(default="technical", description="Skill taxonomy category")
    proficiency: Literal["introductory", "intermediate", "advanced", "expert"] = Field(
        default="intermediate", description="Required proficiency tier"
    )
    is_canonical: bool = Field(default=True, description="Whether skill maps to national taxonomy")


class JobPostingInput(BaseModel):
    """Structured job posting record used as analytic input."""
    id: str = Field(..., description="Unique job posting ID")
    title: str = Field(..., description="Standardized role title")
    company: str = Field(..., description="Hiring organization or employer")
    district: str = Field(..., description="District or geographic municipality")
    industry: str = Field(..., description="Sector or industry vertical")
    role: str = Field(..., description="Occupational role classification")
    vacancies: int = Field(default=1, ge=1, description="Number of open positions")
    posted_at: str = Field(..., description="ISO date of posting (YYYY-MM-DD)")
    skills: List[JobSkillInput] = Field(default_factory=list, description="Extracted skills")


class AnalyticsDatasetInput(BaseModel):
    """Payload containing job postings and optional custom calculation windows."""
    postings: List[JobPostingInput] = Field(..., min_length=1, description="Collection of job postings")
    current_period_start: Optional[str] = Field(None, description="Start date for current window (YYYY-MM-DD)")
    current_period_end: Optional[str] = Field(None, description="End date for current window (YYYY-MM-DD)")
    previous_period_start: Optional[str] = Field(None, description="Start date for comparison window (YYYY-MM-DD)")
    previous_period_end: Optional[str] = Field(None, description="End date for comparison window (YYYY-MM-DD)")


class MetricMetadata(BaseModel):
    """Data lineage and audit envelope required on all calculated metrics."""
    source: str = Field(..., description="Data engine source identifier")
    calculation_period: Dict[str, Optional[str]] = Field(
        ..., description="Temporal boundaries (current and comparison windows)"
    )
    population: Dict[str, int] = Field(
        ..., description="Population metrics (total_postings, total_vacancies, unique_employers, unique_skills)"
    )
    timestamp: str = Field(..., description="UTC ISO timestamp of metric execution")


class SkillFrequencyMetric(BaseModel):
    """Core frequency calculation for an individual skill."""
    skill_slug: str
    skill_name: str
    category: str
    posting_frequency: int = Field(..., description="Number of unique job postings requiring skill")
    relative_frequency: float = Field(..., description="Fraction of total postings requiring skill (0.0 to 1.0)")
    total_vacancies: int = Field(..., description="Total vacancy volume requiring skill")
    unique_employers: int = Field(..., description="Count of distinct companies requesting skill")


class DimensionalDemandItem(BaseModel):
    """Single slice along an analytics dimension."""
    dimension_value: str
    posting_count: int
    vacancy_count: int
    percentage_share: float = Field(..., description="Share of total demand in this slice")


class DimensionalDemandMetric(BaseModel):
    """Demand breakdown for a skill across a categorical dimension."""
    skill_slug: str
    skill_name: str
    dimension: Literal["district", "industry", "role"]
    breakdown: List[DimensionalDemandItem]


class ProficiencyBreakdown(BaseModel):
    """Distribution of required competency tiers for a skill."""
    skill_slug: str
    skill_name: str
    introductory: int = 0
    intermediate: int = 0
    advanced: int = 0
    expert: int = 0
    dominant_proficiency: str = "intermediate"


class TrendVelocityMetric(BaseModel):
    """Temporal velocity, growth/decline rates, and trajectory classification."""
    skill_slug: str
    skill_name: str
    category: str
    current_demand: int = Field(..., description="Vacancies or postings in current window")
    previous_demand: int = Field(..., description="Vacancies or postings in previous window")
    absolute_change: int = Field(..., description="current_demand - previous_demand")
    growth_rate: float = Field(..., description="Percentage growth rate")
    decline_rate: float = Field(..., description="Percentage decline rate (0.0 if growing)")
    trajectory: Literal["emerging", "growing", "stable", "declining", "insufficient_data"]
    is_emerging_candidate: bool = Field(..., description="True if satisfies all emerging criteria")
    unique_employers_current: int = Field(..., description="Employers in current window")
    qualification_notes: List[str] = Field(default_factory=list, description="Audit justification")


class RoleDemandSummary(BaseModel):
    """Aggregate demand metrics for an occupational role."""
    role_title: str
    industry: str
    total_postings: int
    total_vacancies: int
    top_skills: List[str]


class AnalyticsReportResponse(BaseModel):
    """Comprehensive Labour Market Analytics Report Envelope."""
    metadata: MetricMetadata
    skill_frequencies: List[SkillFrequencyMetric]
    trends: List[TrendVelocityMetric]
    emerging_candidates: List[TrendVelocityMetric]
    district_demand: List[DimensionalDemandMetric]
    industry_demand: List[DimensionalDemandMetric]
    role_demand: List[RoleDemandSummary]
    proficiency_demand: List[ProficiencyBreakdown]
