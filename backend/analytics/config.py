"""
Configuration for Skill Sync AI Labour Market Analytics Engine.
Provides deterministic mathematical thresholds and sample-size guardrails.
"""

from dataclasses import dataclass
import os


@dataclass(frozen=True)
class AnalyticsConfig:
    """Configurable thresholds for trajectory classification and sample-size safety."""

    # Trajectory velocity thresholds (in percentage)
    emerging_growth_threshold: float = float(os.getenv("ANALYTICS_EMERGING_THRESHOLD", "25.0"))
    growing_threshold: float = float(os.getenv("ANALYTICS_GROWING_THRESHOLD", "10.0"))
    declining_threshold: float = float(os.getenv("ANALYTICS_DECLINING_THRESHOLD", "-10.0"))

    # Sample-size guardrails (anti-noise and anti-hallucination)
    min_postings_for_trajectory: int = int(os.getenv("ANALYTICS_MIN_POSTINGS_TRAJECTORY", "2"))
    min_employers_for_emerging: int = int(os.getenv("ANALYTICS_MIN_EMPLOYERS_EMERGING", "2"))
    min_vacancies_for_emerging: int = int(os.getenv("ANALYTICS_MIN_VACANCIES_EMERGING", "3"))

    # Default metadata tag
    source_identifier: str = os.getenv(
        "ANALYTICS_SOURCE_IDENTIFIER",
        "Skill Sync AI / Labour Market Analytics Engine (National Alignment Platform)",
    )


DEFAULT_CONFIG = AnalyticsConfig()
