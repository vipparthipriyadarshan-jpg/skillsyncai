"""
Unit Tests for Deterministic Mathematical Formulas.
Verifies pure mathematical operations, zero-division protections,
and trajectory classification boundary conditions.
"""

import pytest
from analytics.config import AnalyticsConfig
from analytics.models import JobPostingInput, JobSkillInput
from analytics.formulas import (
    calculate_frequency,
    calculate_relative_frequency,
    calculate_vacancy_demand,
    calculate_unique_employers,
    calculate_growth_rate,
    calculate_decline_rate,
    classify_trajectory,
)


def create_mock_posting(
    id: str,
    company: str,
    skills: list,
    vacancies: int = 1,
    district: str = "Pune",
    industry: str = "automotive_ev",
    role: str = "EV Technician",
    posted_at: str = "2026-01-15",
) -> JobPostingInput:
    skill_models = [
        JobSkillInput(name=s, slug=s.lower().replace(" ", "-"), category="technical")
        for s in skills
    ]
    return JobPostingInput(
        id=id,
        title=role,
        company=company,
        district=district,
        industry=industry,
        role=role,
        vacancies=vacancies,
        posted_at=posted_at,
        skills=skill_models,
    )


def test_frequency_calculation():
    """Skill frequency must equal count of unique postings containing the skill."""
    postings = [
        create_mock_posting("1", "Tata Motors", ["BMS", "CAN Bus"], vacancies=2),
        create_mock_posting("2", "Mahindra Electric", ["BMS", "Battery Pack Assembly"], vacancies=3),
        create_mock_posting("3", "Ola Electric", ["CAN Bus", "Wiring Harness"], vacancies=1),
        create_mock_posting("4", "Ather Energy", ["Motor Testing"], vacancies=4),
    ]

    assert calculate_frequency(postings, "bms") == 2
    assert calculate_frequency(postings, "can-bus") == 2
    assert calculate_frequency(postings, "motor-testing") == 1
    assert calculate_frequency(postings, "nonexistent-skill") == 0


def test_relative_frequency_calculation():
    """Relative frequency is frequency / total_postings."""
    assert calculate_relative_frequency(2, 4) == 0.50
    assert calculate_relative_frequency(1, 4) == 0.25
    assert calculate_relative_frequency(0, 4) == 0.0
    assert calculate_relative_frequency(5, 0) == 0.0  # Zero total protection


def test_vacancy_demand_calculation():
    """Vacancy-weighted demand sums open positions across matched postings."""
    postings = [
        create_mock_posting("1", "Tata Motors", ["BMS"], vacancies=5),
        create_mock_posting("2", "Mahindra Electric", ["BMS"], vacancies=10),
        create_mock_posting("3", "Ather Energy", ["Welding"], vacancies=2),
    ]

    assert calculate_vacancy_demand(postings, "bms") == 15
    assert calculate_vacancy_demand(postings, "welding") == 2


def test_unique_employers_calculation():
    """Calculates distinct hiring companies requesting a skill."""
    postings = [
        create_mock_posting("1", "Tata Motors", ["BMS"]),
        create_mock_posting("2", "Tata Motors", ["BMS"]),  # Duplicate company
        create_mock_posting("3", "Mahindra Electric", ["BMS"]),
    ]

    assert calculate_unique_employers(postings, "bms") == 2


def test_growth_rate_deterministic_math():
    """Verifies formula: ((current - previous) / previous) * 100."""
    # Normal positive growth: 10 -> 15 (+50%)
    assert calculate_growth_rate(15, 10) == 50.0

    # Normal negative growth: 20 -> 10 (-50%)
    assert calculate_growth_rate(10, 20) == -50.0

    # No change: 10 -> 10 (0%)
    assert calculate_growth_rate(10, 10) == 0.0

    # Zero previous with positive current (New entrant): 0 -> 8 (+100%)
    assert calculate_growth_rate(8, 0) == 100.0

    # Zero both: 0 -> 0 (0%)
    assert calculate_growth_rate(0, 0) == 0.0


def test_decline_rate_deterministic_math():
    """Decline rate reflects absolute magnitude of negative growth."""
    assert calculate_decline_rate(-50.0) == 50.0
    assert calculate_decline_rate(-15.25) == 15.25
    assert calculate_decline_rate(25.0) == 0.0
    assert calculate_decline_rate(0.0) == 0.0


def test_trajectory_emerging_qualification():
    """Emerging skills require high velocity AND multi-employer breadth."""
    config = AnalyticsConfig(
        emerging_growth_threshold=25.0,
        min_employers_for_emerging=2,
        min_vacancies_for_emerging=3,
        min_postings_for_trajectory=2,
    )

    # Qualified emerging: +60% growth, 16 vacancies across 3 employers
    traj, is_em, notes = classify_trajectory(
        current_demand=16,
        previous_demand=10,
        unique_employers=3,
        config=config,
    )
    assert traj == "emerging"
    assert is_em is True
    assert any("Emerging candidate" in n for n in notes)


def test_trajectory_single_employer_guardrail():
    """Anti-hallucination guardrail: high velocity from only 1 employer is held as 'growing'."""
    config = AnalyticsConfig(
        emerging_growth_threshold=25.0,
        min_employers_for_emerging=2,
        min_vacancies_for_emerging=3,
    )

    # 100% growth, but only 1 company posting
    traj, is_em, notes = classify_trajectory(
        current_demand=20,
        previous_demand=5,
        unique_employers=1,
        config=config,
    )
    assert traj == "growing"
    assert is_em is False
    assert any("held as 'growing'" in n for n in notes)


def test_trajectory_sample_size_safety():
    """Volume below sample threshold is flagged as insufficient_data."""
    config = AnalyticsConfig(min_postings_for_trajectory=2)

    traj, is_em, notes = classify_trajectory(
        current_demand=1,
        previous_demand=0,
        unique_employers=1,
        config=config,
    )
    assert traj == "insufficient_data"
    assert is_em is False
    assert any("Insufficient sample volume" in n for n in notes)


def test_trajectory_growing_and_declining():
    """Verifies standard growing and declining thresholds."""
    config = AnalyticsConfig(growing_threshold=10.0, declining_threshold=-10.0)

    # Growing: +15% (between 10% and 25%)
    traj_grow, _, _ = classify_trajectory(current_demand=23, previous_demand=20, unique_employers=2, config=config)
    assert traj_grow == "growing"

    # Stable: +5% (between -10% and 10%)
    traj_stable, _, _ = classify_trajectory(current_demand=21, previous_demand=20, unique_employers=2, config=config)
    assert traj_stable == "stable"

    # Declining: -30% (below -10%)
    traj_dec, _, _ = classify_trajectory(current_demand=14, previous_demand=20, unique_employers=2, config=config)
    assert traj_dec == "declining"
