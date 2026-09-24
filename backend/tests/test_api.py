"""
API Integration Tests for Skill Sync AI Analytics REST Endpoints.
Verifies HTTP status codes, payload serialization, and response schemas.
"""

from fastapi.testclient import TestClient
from analytics.api import app
from tests.test_analytics_engine import build_test_dataset

client = TestClient(app)


def test_health_check_endpoint():
    """GET /api/v1/analytics/health returns 200 and valid threshold configuration."""
    response = client.get("/api/v1/analytics/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["engine_type"] == "deterministic_mathematical"
    assert "thresholds" in data
    assert data["thresholds"]["emerging_growth_threshold_pct"] == 25.0
    assert "timestamp" in data


def test_calculate_report_endpoint():
    """POST /api/v1/analytics/calculate returns comprehensive report."""
    dataset = build_test_dataset()
    payload = dataset.model_dump()

    response = client.post("/api/v1/analytics/calculate", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert "metadata" in data
    assert "skill_frequencies" in data
    assert "trends" in data
    assert "emerging_candidates" in data
    assert "district_demand" in data
    assert "industry_demand" in data
    assert "role_demand" in data
    assert "proficiency_demand" in data

    # Verify emerging candidates found in JSON
    emerging = data["emerging_candidates"]
    assert len(emerging) >= 1
    assert any(e["skill_slug"] == "ev-battery-diagnostics" for e in emerging)


def test_skills_frequency_endpoint():
    """POST /api/v1/analytics/skills/frequency returns list of frequencies."""
    dataset = build_test_dataset()
    payload = dataset.model_dump()

    response = client.post("/api/v1/analytics/skills/frequency", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 3
    assert "posting_frequency" in data[0]
    assert "total_vacancies" in data[0]


def test_emerging_skills_endpoint():
    """POST /api/v1/analytics/skills/emerging returns only verified emerging candidates."""
    dataset = build_test_dataset()
    payload = dataset.model_dump()

    response = client.post("/api/v1/analytics/skills/emerging", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert all(item["is_emerging_candidate"] is True for item in data)
    assert all(item["trajectory"] == "emerging" for item in data)


def test_district_demand_endpoint():
    """POST /api/v1/analytics/skills/by-district returns district breakdowns."""
    dataset = build_test_dataset()
    payload = dataset.model_dump()

    response = client.post("/api/v1/analytics/skills/by-district", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert any(d["dimension"] == "district" for d in data)
    assert any(d["skill_slug"] == "ev-battery-diagnostics" for d in data)


def test_industry_demand_endpoint():
    """POST /api/v1/analytics/skills/by-industry returns industry breakdowns."""
    dataset = build_test_dataset()
    payload = dataset.model_dump()

    response = client.post("/api/v1/analytics/skills/by-industry", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert any(d["dimension"] == "industry" for d in data)


def test_role_demand_endpoint():
    """POST /api/v1/analytics/roles/demand returns occupational roles."""
    dataset = build_test_dataset()
    payload = dataset.model_dump()

    response = client.post("/api/v1/analytics/roles/demand", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert any(r["role_title"] == "EV Technician" for r in data)


def test_proficiency_demand_endpoint():
    """POST /api/v1/analytics/proficiencies returns proficiency distributions."""
    dataset = build_test_dataset()
    payload = dataset.model_dump()

    response = client.post("/api/v1/analytics/proficiencies", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert any("dominant_proficiency" in p for p in data)


def test_empty_dataset_validation():
    """Empty postings list triggers HTTP 422 Unprocessable Entity."""
    response = client.post("/api/v1/analytics/calculate", json={"postings": []})
    assert response.status_code == 422

