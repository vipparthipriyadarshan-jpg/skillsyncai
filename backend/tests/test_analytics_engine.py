"""
Integration Tests for Labour Market Analytics Engine.
Verifies multi-period temporal velocity, dimensional slicing (district, industry, role),
proficiency breakdowns, and audit metadata lineage.
"""

import pytest
from analytics.config import AnalyticsConfig
from analytics.models import JobPostingInput, JobSkillInput, AnalyticsDatasetInput
from analytics.engine import LabourMarketAnalyticsEngine


def build_test_dataset() -> AnalyticsDatasetInput:
    """
    Builds a realistic multi-period dataset reflecting Indian industrial shifts:
    - Period 1 (Previous: 2025-10 to 2025-12):
        - High demand for Carburetor Tuning (legacy automotive)
        - Moderate demand for Conventional Manual Lathe
        - Low / nascent demand for EV Battery Diagnostics
    - Period 2 (Current: 2026-01 to 2026-03):
        - Huge surge in EV Battery Diagnostics and BMS (emerging across Tata, Mahindra, Ather)
        - Moderate demand for 5-Axis CNC Milling
        - Significant drop in Carburetor Tuning (declining)
        - Steady demand for Shielded Metal Arc Welding (stable)
    """
    postings = [
        # --- PREVIOUS PERIOD (2025-Q4) ---
        JobPostingInput(
            id="prev-1",
            title="Automotive Workshop Mechanic",
            company="Bajaj Auto Service",
            district="Pune",
            industry="automotive",
            role="Automotive Mechanic",
            vacancies=10,
            posted_at="2025-11-01",
            skills=[
                JobSkillInput(name="Carburetor Tuning", slug="carburetor-tuning", proficiency="intermediate"),
                JobSkillInput(name="Basic Bench Fitting", slug="basic-bench-fitting", proficiency="intermediate"),
            ],
        ),
        JobPostingInput(
            id="prev-2",
            title="General Repair Technician",
            company="Hero MotoCorp Dealership",
            district="Ahmedabad",
            industry="automotive",
            role="Automotive Mechanic",
            vacancies=10,
            posted_at="2025-11-15",
            skills=[
                JobSkillInput(name="Carburetor Tuning", slug="carburetor-tuning", proficiency="advanced"),
            ],
        ),
        JobPostingInput(
            id="prev-3",
            title="EV Prototype Trainee",
            company="Tata Motors EV",
            district="Pune",
            industry="automotive_ev",
            role="EV Technician",
            vacancies=2,
            posted_at="2025-12-01",
            skills=[
                JobSkillInput(name="EV Battery Diagnostics", slug="ev-battery-diagnostics", proficiency="introductory"),
                JobSkillInput(name="BMS Configuration", slug="bms-configuration", proficiency="introductory"),
            ],
        ),
        JobPostingInput(
            id="prev-4",
            title="Welder Specialist",
            company="L&T Heavy Engineering",
            district="Coimbatore",
            industry="manufacturing",
            role="Welder",
            vacancies=5,
            posted_at="2025-12-10",
            skills=[
                JobSkillInput(name="SMAW Welding", slug="smaw-welding", proficiency="advanced"),
            ],
        ),

        # --- CURRENT PERIOD (2026-Q1) ---
        JobPostingInput(
            id="curr-1",
            title="EV Battery Diagnostics Lead",
            company="Tata Motors EV",
            district="Pune",
            industry="automotive_ev",
            role="EV Technician",
            vacancies=8,
            posted_at="2026-01-10",
            skills=[
                JobSkillInput(name="EV Battery Diagnostics", slug="ev-battery-diagnostics", proficiency="advanced"),
                JobSkillInput(name="BMS Configuration", slug="bms-configuration", proficiency="advanced"),
                JobSkillInput(name="CAN Bus Protocol", slug="can-bus-protocol", proficiency="intermediate"),
            ],
        ),
        JobPostingInput(
            id="curr-2",
            title="Battery Pack Test Engineer",
            company="Mahindra Electric",
            district="Pune",
            industry="automotive_ev",
            role="EV Technician",
            vacancies=6,
            posted_at="2026-01-20",
            skills=[
                JobSkillInput(name="EV Battery Diagnostics", slug="ev-battery-diagnostics", proficiency="intermediate"),
                JobSkillInput(name="BMS Configuration", slug="bms-configuration", proficiency="intermediate"),
            ],
        ),
        JobPostingInput(
            id="curr-3",
            title="Telematics & Diagnostics Associate",
            company="Ather Energy",
            district="Bengaluru",
            industry="automotive_ev",
            role="EV Technician",
            vacancies=4,
            posted_at="2026-02-01",
            skills=[
                JobSkillInput(name="EV Battery Diagnostics", slug="ev-battery-diagnostics", proficiency="intermediate"),
                JobSkillInput(name="CAN Bus Protocol", slug="can-bus-protocol", proficiency="intermediate"),
            ],
        ),
        JobPostingInput(
            id="curr-4",
            title="Industrial Welder",
            company="Bharat Heavy Electricals",
            district="Coimbatore",
            industry="manufacturing",
            role="Welder",
            vacancies=5,
            posted_at="2026-02-15",
            skills=[
                JobSkillInput(name="SMAW Welding", slug="smaw-welding", proficiency="intermediate"),
            ],
        ),
        JobPostingInput(
            id="curr-5",
            title="Legacy Motorcycle Mechanic",
            company="Local Auto Repair",
            district="Ahmedabad",
            industry="automotive",
            role="Automotive Mechanic",
            vacancies=2,
            posted_at="2026-02-25",
            skills=[
                JobSkillInput(name="Carburetor Tuning", slug="carburetor-tuning", proficiency="intermediate"),
            ],
        ),
    ]

    return AnalyticsDatasetInput(
        postings=postings,
        previous_period_start="2025-10-01",
        previous_period_end="2025-12-31",
        current_period_start="2026-01-01",
        current_period_end="2026-03-31",
    )


def test_full_report_execution():
    """Verifies end-to-end report calculation across all metrics."""
    dataset = build_test_dataset()
    engine = LabourMarketAnalyticsEngine()
    report = engine.calculate_full_report(dataset)

    # 1. Metadata Verification
    assert "Skill Sync AI" in report.metadata.source
    assert report.metadata.population["total_postings"] == 9
    assert report.metadata.population["total_vacancies"] == 52
    assert report.metadata.population["unique_employers"] >= 6
    assert report.metadata.population["unique_skills"] == 6
    assert report.metadata.timestamp is not None

    # 2. Emerging Skills Detection
    ev_battery = next((t for t in report.trends if t.skill_slug == "ev-battery-diagnostics"), None)
    assert ev_battery is not None
    assert ev_battery.trajectory == "emerging"
    assert ev_battery.is_emerging_candidate is True
    assert ev_battery.growth_rate > 500.0  # 2 -> 18 vacancies = +800% growth
    assert ev_battery.unique_employers_current >= 3  # Tata, Mahindra, Ather
    assert ev_battery in report.emerging_candidates

    # 3. Declining Skills Detection
    carburetor = next((t for t in report.trends if t.skill_slug == "carburetor-tuning"), None)
    assert carburetor is not None
    assert carburetor.trajectory == "declining"
    assert carburetor.growth_rate < -50.0  # 20 -> 2 vacancies = -90% drop
    assert carburetor.decline_rate == 90.0

    # 4. Stable Skills Detection
    welding = next((t for t in report.trends if t.skill_slug == "smaw-welding"), None)
    assert welding is not None
    # 5 vacancies in prev period (L&T) vs 5 in curr (BHEL)
    assert welding.growth_rate == 0.0
    assert welding.trajectory == "stable"

    # 5. District Demand Verification
    pune_ev = next(
        (d for d in report.district_demand if d.skill_slug == "ev-battery-diagnostics"),
        None,
    )
    assert pune_ev is not None
    pune_slice = next((s for s in pune_ev.breakdown if s.dimension_value == "Pune"), None)
    assert pune_slice is not None
    assert pune_slice.vacancy_count >= 14  # 8 (Tata) + 6 (Mahindra)

    # 6. Role Demand Verification
    ev_role = next((r for r in report.role_demand if r.role_title == "EV Technician"), None)
    assert ev_role is not None
    assert ev_role.total_vacancies >= 18
    assert "EV Battery Diagnostics" in ev_role.top_skills

    # 7. Proficiency Demand Verification
    ev_prof = next((p for p in report.proficiency_demand if p.skill_slug == "ev-battery-diagnostics"), None)
    assert ev_prof is not None
    assert ev_prof.advanced >= 8  # 8 from Tata Motors Lead role
    assert ev_prof.intermediate >= 10  # 6 Mahindra + 4 Ather


def test_automatic_chronological_partition():
    """Engine automatically splits unpartitioned dataset into chronological periods."""
    dataset = build_test_dataset()
    # Remove explicit date boundaries
    unpartitioned = AnalyticsDatasetInput(postings=dataset.postings)

    engine = LabourMarketAnalyticsEngine()
    report = engine.calculate_full_report(unpartitioned)

    assert report.metadata.calculation_period["current_start"] is not None
    assert report.metadata.calculation_period["previous_start"] is not None
    assert len(report.trends) > 0


def test_single_observation_not_emerging_in_engine():
    """A skill with high volume from only 1 employer is not flagged as emerging."""
    postings = [
        JobPostingInput(
            id="obs-1",
            title="Specialist",
            company="Monopoly Co",
            district="Pune",
            industry="tech",
            role="Specialist",
            vacancies=50,
            posted_at="2026-03-01",
            skills=[JobSkillInput(name="Proprietary Tech", slug="proprietary-tech")],
        ),
    ]
    dataset = AnalyticsDatasetInput(
        postings=postings,
        previous_period_start="2025-10-01",
        previous_period_end="2025-12-31",
        current_period_start="2026-01-01",
        current_period_end="2026-03-31",
    )
    engine = LabourMarketAnalyticsEngine()
    report = engine.calculate_full_report(dataset)

    prop = next((t for t in report.trends if t.skill_slug == "proprietary-tech"), None)
    assert prop is not None
    # Must NOT be an emerging candidate because only 1 company posted
    assert prop.is_emerging_candidate is False
    assert prop.trajectory == "growing"  # Held as growing
    assert len(report.emerging_candidates) == 0

