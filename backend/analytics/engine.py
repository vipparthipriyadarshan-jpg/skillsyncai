"""
Core Labour Market Analytics Engine for Skill Sync AI.
Orchestrates multi-dimensional slicing, temporal velocity metrics,
trajectory analysis, and metadata lineage generation.
"""

from typing import List, Dict, Set, Optional, Tuple
from datetime import datetime, timezone
from collections import defaultdict

from .config import AnalyticsConfig, DEFAULT_CONFIG
from .models import (
    JobPostingInput,
    AnalyticsDatasetInput,
    MetricMetadata,
    SkillFrequencyMetric,
    DimensionalDemandMetric,
    DimensionalDemandItem,
    TrendVelocityMetric,
    ProficiencyBreakdown,
    RoleDemandSummary,
    AnalyticsReportResponse,
)
from .formulas import (
    calculate_frequency,
    calculate_relative_frequency,
    calculate_vacancy_demand,
    calculate_unique_employers,
    calculate_growth_rate,
    calculate_decline_rate,
    classify_trajectory,
    aggregate_by_dimension,
)


class LabourMarketAnalyticsEngine:
    """Production analytics engine executing deterministic labor market calculations."""

    def __init__(self, config: AnalyticsConfig = DEFAULT_CONFIG):
        self.config = config

    def calculate_full_report(self, dataset: AnalyticsDatasetInput) -> AnalyticsReportResponse:
        """
        Executes end-to-end analytics report covering all 10 target labor-market metrics:
        1. Skill frequency
        2. Skill demand by district
        3. Skill demand by industry
        4. Skill demand by role
        5. Skill demand by time period
        6. Skill growth rate
        7. Skill decline rate
        8. Role demand
        9. Proficiency demand
        10. Emerging skill candidates
        """
        postings = dataset.postings
        if not postings:
            raise ValueError("Dataset contains no job postings.")

        # 1. Partition into temporal periods
        curr_postings, prev_postings, period_info = self._partition_periods(dataset)

        # 2. Extract unique skills
        all_skills: Dict[str, Dict[str, str]] = {}
        for p in postings:
            for s in p.skills:
                slug = s.slug.lower()
                if slug not in all_skills:
                    all_skills[slug] = {"name": s.name, "category": s.category}

        # 3. Metric 1: Skill Frequencies (Current Population)
        frequencies = self.calculate_skill_frequencies(curr_postings if curr_postings else postings)

        # 4. Metrics 5, 6, 7 & 10: Temporal Trends, Growth/Decline & Emerging Candidates
        trends = self.calculate_trend_velocities(curr_postings, prev_postings, all_skills)
        emerging_candidates = [t for t in trends if t.is_emerging_candidate]

        # 5. Metrics 2 & 3: Dimensional Demand (District & Industry)
        district_demand = self.calculate_district_demand(postings, all_skills)
        industry_demand = self.calculate_industry_demand(postings, all_skills)

        # 6. Metric 8: Role Demand
        role_demand = self.calculate_role_demand(postings)

        # 7. Metric 9: Proficiency Demand
        proficiency_demand = self.calculate_proficiency_demand(postings, all_skills)

        # 8. Metadata Lineage Envelope
        total_vacancies = sum(p.vacancies for p in postings)
        unique_employers = len({p.company.strip().lower() for p in postings})

        metadata = MetricMetadata(
            source=self.config.source_identifier,
            calculation_period=period_info,
            population={
                "total_postings": len(postings),
                "total_vacancies": total_vacancies,
                "unique_employers": unique_employers,
                "unique_skills": len(all_skills),
            },
            timestamp=datetime.now(timezone.utc).isoformat(),
        )

        return AnalyticsReportResponse(
            metadata=metadata,
            skill_frequencies=frequencies,
            trends=trends,
            emerging_candidates=emerging_candidates,
            district_demand=district_demand,
            industry_demand=industry_demand,
            role_demand=role_demand,
            proficiency_demand=proficiency_demand,
        )

    def calculate_skill_frequencies(self, postings: List[JobPostingInput]) -> List[SkillFrequencyMetric]:
        """Calculates posting frequency, relative frequency, vacancies, and employer breadth."""
        total_postings = len(postings)
        skill_map: Dict[str, Dict[str, any]] = {}

        for p in postings:
            seen_in_posting: Set[str] = set()
            for s in p.skills:
                slug = s.slug.lower()
                if slug not in skill_map:
                    skill_map[slug] = {
                        "name": s.name,
                        "category": s.category,
                        "posting_frequency": 0,
                        "total_vacancies": 0,
                        "employers": set(),
                    }

                if slug not in seen_in_posting:
                    skill_map[slug]["posting_frequency"] += 1
                    seen_in_posting.add(slug)

                skill_map[slug]["total_vacancies"] += p.vacancies
                skill_map[slug]["employers"].add(p.company.strip().lower())

        results = []
        for slug, data in skill_map.items():
            freq = data["posting_frequency"]
            results.append(SkillFrequencyMetric(
                skill_slug=slug,
                skill_name=data["name"],
                category=data["category"],
                posting_frequency=freq,
                relative_frequency=calculate_relative_frequency(freq, total_postings),
                total_vacancies=data["total_vacancies"],
                unique_employers=len(data["employers"]),
            ))

        # Sort descending by total vacancy demand
        results.sort(key=lambda x: x.total_vacancies, reverse=True)
        return results

    def calculate_trend_velocities(
        self,
        curr_postings: List[JobPostingInput],
        prev_postings: List[JobPostingInput],
        skills_dict: Dict[str, Dict[str, str]],
    ) -> List[TrendVelocityMetric]:
        """Calculates growth rates, decline rates, and emerging skill classifications."""
        results: List[TrendVelocityMetric] = []

        for slug, meta in skills_dict.items():
            curr_vacancies = calculate_vacancy_demand(curr_postings, slug)
            prev_vacancies = calculate_vacancy_demand(prev_postings, slug)
            curr_employers = calculate_unique_employers(curr_postings, slug)

            growth = calculate_growth_rate(curr_vacancies, prev_vacancies)
            decline = calculate_decline_rate(growth)
            abs_change = curr_vacancies - prev_vacancies

            trajectory, is_emerging, notes = classify_trajectory(
                current_demand=curr_vacancies,
                previous_demand=prev_vacancies,
                unique_employers=curr_employers,
                config=self.config,
            )

            results.append(TrendVelocityMetric(
                skill_slug=slug,
                skill_name=meta["name"],
                category=meta["category"],
                current_demand=curr_vacancies,
                previous_demand=prev_vacancies,
                absolute_change=abs_change,
                growth_rate=growth,
                decline_rate=decline,
                trajectory=trajectory,
                is_emerging_candidate=is_emerging,
                unique_employers_current=curr_employers,
                qualification_notes=notes,
            ))

        # Sort descending by growth rate then absolute change
        results.sort(key=lambda x: (x.growth_rate, x.absolute_change), reverse=True)
        return results

    def calculate_district_demand(
        self,
        postings: List[JobPostingInput],
        skills_dict: Dict[str, Dict[str, str]],
    ) -> List[DimensionalDemandMetric]:
        """Slices skill demand by geographical district."""
        results = []
        for slug, meta in skills_dict.items():
            breakdown = aggregate_by_dimension(postings, slug, lambda p: p.district)
            items = [DimensionalDemandItem(**b) for b in breakdown]
            results.append(DimensionalDemandMetric(
                skill_slug=slug,
                skill_name=meta["name"],
                dimension="district",
                breakdown=items,
            ))
        return results

    def calculate_industry_demand(
        self,
        postings: List[JobPostingInput],
        skills_dict: Dict[str, Dict[str, str]],
    ) -> List[DimensionalDemandMetric]:
        """Slices skill demand by industry sector."""
        results = []
        for slug, meta in skills_dict.items():
            breakdown = aggregate_by_dimension(postings, slug, lambda p: p.industry)
            items = [DimensionalDemandItem(**b) for b in breakdown]
            results.append(DimensionalDemandMetric(
                skill_slug=slug,
                skill_name=meta["name"],
                dimension="industry",
                breakdown=items,
            ))
        return results

    def calculate_role_demand(self, postings: List[JobPostingInput]) -> List[RoleDemandSummary]:
        """Calculates demand and top required skills grouped by occupational role."""
        roles: Dict[str, Dict[str, any]] = defaultdict(lambda: {
            "industry": "Unspecified",
            "postings": 0,
            "vacancies": 0,
            "skill_counts": defaultdict(int),
        })

        for p in postings:
            role_key = p.role.strip()
            roles[role_key]["industry"] = p.industry
            roles[role_key]["postings"] += 1
            roles[role_key]["vacancies"] += p.vacancies

            for s in p.skills:
                roles[role_key]["skill_counts"][s.name] += 1

        summaries = []
        for role_title, data in roles.items():
            top_skills = sorted(
                data["skill_counts"].keys(),
                key=lambda k: data["skill_counts"][k],
                reverse=True,
            )[:5]

            summaries.append(RoleDemandSummary(
                role_title=role_title,
                industry=data["industry"],
                total_postings=data["postings"],
                total_vacancies=data["vacancies"],
                top_skills=top_skills,
            ))

        summaries.sort(key=lambda x: x.total_vacancies, reverse=True)
        return summaries

    def calculate_proficiency_demand(
        self,
        postings: List[JobPostingInput],
        skills_dict: Dict[str, Dict[str, str]],
    ) -> List[ProficiencyBreakdown]:
        """Calculates proficiency tiers (introductory, intermediate, advanced, expert) per skill."""
        prof_map: Dict[str, Dict[str, int]] = defaultdict(lambda: {
            "introductory": 0,
            "intermediate": 0,
            "advanced": 0,
            "expert": 0,
        })

        for p in postings:
            for s in p.skills:
                slug = s.slug.lower()
                prof = (s.proficiency or "intermediate").lower()
                if prof in prof_map[slug]:
                    prof_map[slug][prof] += p.vacancies

        breakdowns = []
        for slug, meta in skills_dict.items():
            counts = prof_map[slug]
            dominant = max(counts.keys(), key=lambda k: counts[k]) if any(counts.values()) else "intermediate"

            breakdowns.append(ProficiencyBreakdown(
                skill_slug=slug,
                skill_name=meta["name"],
                introductory=counts["introductory"],
                intermediate=counts["intermediate"],
                advanced=counts["advanced"],
                expert=counts["expert"],
                dominant_proficiency=dominant,
            ))

        return breakdowns

    def _partition_periods(
        self,
        dataset: AnalyticsDatasetInput,
    ) -> Tuple[List[JobPostingInput], List[JobPostingInput], Dict[str, Optional[str]]]:
        """Partitions job postings into current vs comparison observation periods."""
        postings = dataset.postings

        # Custom date boundaries specified
        if dataset.current_period_start and dataset.previous_period_start:
            curr_start = dataset.current_period_start
            curr_end = dataset.current_period_end or "9999-12-31"
            prev_start = dataset.previous_period_start
            prev_end = dataset.previous_period_end or curr_start

            curr = [p for p in postings if curr_start <= p.posted_at <= curr_end]
            prev = [p for p in postings if prev_start <= p.posted_at <= prev_end]

            return curr, prev, {
                "current_start": curr_start,
                "current_end": dataset.current_period_end,
                "previous_start": prev_start,
                "previous_end": dataset.previous_period_end,
            }

        # Automatic chronological split: sort by posted_at and split midpoint
        sorted_postings = sorted(postings, key=lambda x: x.posted_at)
        n = len(sorted_postings)
        mid = max(1, n // 2)

        prev = sorted_postings[:mid]
        curr = sorted_postings[mid:]

        prev_dates = [p.posted_at for p in prev]
        curr_dates = [p.posted_at for p in curr]

        return curr, prev, {
            "current_start": min(curr_dates) if curr_dates else None,
            "current_end": max(curr_dates) if curr_dates else None,
            "previous_start": min(prev_dates) if prev_dates else None,
            "previous_end": max(prev_dates) if prev_dates else None,
        }
