"""
Pure, Deterministic Mathematical Formulas for Labour Market Analytics.
Zero LLM or stochastic dependencies. All calculations are 100% deterministic,
transparent, and reproducible.
"""

from typing import Sequence, Tuple, List, Dict
from .config import AnalyticsConfig, DEFAULT_CONFIG
from .models import JobPostingInput


def calculate_frequency(postings: Sequence[JobPostingInput], skill_slug: str) -> int:
    """
    Skill frequency formula:
    Number of unique relevant job postings containing the skill.
    """
    slug_lower = skill_slug.lower()
    return sum(
        1 for p in postings
        if any(s.slug.lower() == slug_lower for s in p.skills)
    )


def calculate_relative_frequency(frequency: int, total_postings: int) -> float:
    """
    Relative frequency formula:
    fraction = frequency / total_postings
    """
    if total_postings <= 0:
        return 0.0
    return round(frequency / total_postings, 4)


def calculate_vacancy_demand(postings: Sequence[JobPostingInput], skill_slug: str) -> int:
    """
    Vacancy-weighted demand formula:
    Sum of open vacancies across all job postings containing the skill.
    """
    slug_lower = skill_slug.lower()
    return sum(
        p.vacancies for p in postings
        if any(s.slug.lower() == slug_lower for s in p.skills)
    )


def calculate_unique_employers(postings: Sequence[JobPostingInput], skill_slug: str) -> int:
    """
    Count of distinct hiring organizations requesting this skill.
    """
    slug_lower = skill_slug.lower()
    employers = {
        p.company.strip().lower() for p in postings
        if any(s.slug.lower() == slug_lower for s in p.skills)
    }
    return len(employers)


def calculate_growth_rate(current_demand: float, previous_demand: float) -> float:
    """
    Growth rate formula:
    growth_rate = ((current_demand - previous_demand) / previous_demand) * 100.0
    
    Handles zero-denominator safely:
    - If previous == 0 and current > 0: 100.0% (new entrant)
    - If previous == 0 and current == 0: 0.0%
    """
    if previous_demand > 0:
        rate = ((current_demand - previous_demand) / previous_demand) * 100.0
        return round(rate, 2)
    elif current_demand > 0:
        return 100.0  # Clean entrant index
    return 0.0


def calculate_decline_rate(growth_rate: float) -> float:
    """
    Decline rate formula:
    decline_rate = abs(growth_rate) if growth_rate < 0 else 0.0
    """
    if growth_rate < 0:
        return round(abs(growth_rate), 2)
    return 0.0


def classify_trajectory(
    current_demand: int,
    previous_demand: int,
    unique_employers: int,
    config: AnalyticsConfig = DEFAULT_CONFIG,
) -> Tuple[str, bool, List[str]]:
    """
    Trajectory classification formula using deterministic thresholds and sample-size safety:
    
    Returns:
    - trajectory: "emerging" | "growing" | "stable" | "declining" | "insufficient_data"
    - is_emerging_candidate: bool
    - notes: List[str] explaining qualification
    """
    total_volume = current_demand + previous_demand
    notes: List[str] = []

    # 1. Sample Size Safety Guardrail
    if total_volume < config.min_postings_for_trajectory:
        notes.append(
            f"Insufficient sample volume: {total_volume} observation(s) "
            f"below minimum threshold ({config.min_postings_for_trajectory})."
        )
        return "insufficient_data", False, notes

    growth = calculate_growth_rate(current_demand, previous_demand)

    # 2. Check Emerging Criteria
    is_velocity_emerging = growth >= config.emerging_growth_threshold
    has_minimum_vacancies = current_demand >= config.min_vacancies_for_emerging
    has_distributed_employers = unique_employers >= config.min_employers_for_emerging

    if is_velocity_emerging and has_minimum_vacancies:
        if has_distributed_employers:
            notes.append(
                f"Emerging candidate: high growth velocity ({growth:+.1f}%) "
                f"grounded across {unique_employers} distinct employers."
            )
            return "emerging", True, notes
        else:
            # Concentration penalty: high velocity but from only 1 employer
            notes.append(
                f"Velocity qualifies for emerging ({growth:+.1f}%), but held as 'growing' "
                f"because demand originates from only {unique_employers} employer (minimum required: {config.min_employers_for_emerging})."
            )
            return "growing", False, notes

    # 3. Growing Trajectory
    if growth >= config.growing_threshold:
        notes.append(f"Demand expanding at {growth:+.1f}% (above growing threshold {config.growing_threshold}%).")
        return "growing", False, notes

    # 4. Declining Trajectory
    if growth <= config.declining_threshold:
        decline = calculate_decline_rate(growth)
        notes.append(f"Demand contracting at {decline:.1f}% (below declining threshold {config.declining_threshold}%).")
        return "declining", False, notes

    # 5. Stable Trajectory
    notes.append(f"Demand stable with variation {growth:+.1f}% within equilibrium range.")
    return "stable", False, notes


def aggregate_by_dimension(
    postings: Sequence[JobPostingInput],
    skill_slug: str,
    dimension_getter,
) -> List[Dict[str, any]]:
    """
    Calculates vacancy and posting counts for a skill grouped by any dimension.
    """
    slug_lower = skill_slug.lower()
    counts: Dict[str, Dict[str, int]] = {}
    total_vacancies_for_skill = 0

    for p in postings:
        if any(s.slug.lower() == slug_lower for s in p.skills):
            dim_val = dimension_getter(p) or "Unspecified"
            if dim_val not in counts:
                counts[dim_val] = {"postings": 0, "vacancies": 0}
            counts[dim_val]["postings"] += 1
            counts[dim_val]["vacancies"] += p.vacancies
            total_vacancies_for_skill += p.vacancies

    items = []
    for dim_val, c in counts.items():
        share = round((c["vacancies"] / total_vacancies_for_skill) * 100.0, 1) if total_vacancies_for_skill > 0 else 0.0
        items.append({
            "dimension_value": dim_val,
            "posting_count": c["postings"],
            "vacancy_count": c["vacancies"],
            "percentage_share": share,
        })

    # Sort descending by vacancy count
    items.sort(key=lambda x: x["vacancy_count"], reverse=True)
    return items
