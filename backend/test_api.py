"""
End-to-End API Test Suite for Esy FARM Backend
===============================================
Tests:
1. GET /health
2. POST /api/ml/price-estimate
3. POST /api/ml/demand-predict
4. POST /api/ml/recommend-slot
"""

import sys
import json
from pathlib import Path
from fastapi.testclient import TestClient

# Ensure backend and project root are in sys.path
CURRENT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = CURRENT_DIR.parent
for p in (str(PROJECT_ROOT), str(CURRENT_DIR)):
    if p not in sys.path:
        sys.path.insert(0, p)

from backend.app.main import app
from backend.app.config import HF_TOKEN

client = TestClient(app)


def test_health_check():
    print("\n" + "=" * 60)
    print("1. Testing GET /health")
    print("=" * 60)
    response = client.get("/health")
    print(f"Status Code: {response.status_code}")
    data = response.json()
    print(f"Response: {json.dumps(data, indent=2)}")

    assert response.status_code == 200, f"Health check failed with {response.status_code}"
    assert data["status"] == "healthy"
    assert "ml_models" in data
    assert "HF_TOKEN" not in json.dumps(data)
    print(">>> GET /health PASSED")


def test_price_estimate():
    print("\n" + "=" * 60)
    print("2. Testing POST /api/ml/price-estimate")
    print("=" * 60)
    # Using sample request from task specification
    payload = {
        "crop": "Ragi",
        "district": "Davanagere",
        "season": "Kharif",
        "quantity_quintals": 25,
        "msp": 4863,
    }
    print(f"Payload: {json.dumps(payload, indent=2)}")

    response = client.post("/api/ml/price-estimate", json=payload)
    print(f"Status Code: {response.status_code}")
    data = response.json()
    print(f"Response: {json.dumps(data, indent=2)}")

    assert response.status_code == 200, f"Price estimate failed: {response.text}"
    assert data["crop"] == "Ragi"
    assert data["quantity_quintals"] == 25
    assert data["msp"] == 4863
    assert "estimated_value" in data
    assert data["model_used"] == "amazon/chronos-2"
    assert "HF_TOKEN" not in json.dumps(data)
    print(">>> POST /api/ml/price-estimate PASSED")


def test_demand_predict():
    print("\n" + "=" * 60)
    print("3. Testing POST /api/ml/demand-predict")
    print("=" * 60)
    # Using sample request from task specification
    payload = {
        "centre": "Example Centre",
        "crop": "Ragi",
        "date": "2026-10-15",
        "slots": [
            "09:00-10:00",
            "10:00-11:00",
            "11:00-12:00",
        ],
    }
    print(f"Payload: {json.dumps(payload, indent=2)}")

    response = client.post("/api/ml/demand-predict", json=payload)
    print(f"Status Code: {response.status_code}")
    data = response.json()
    print(f"Response: {json.dumps(data, indent=2)}")

    assert response.status_code == 200, f"Demand predict failed: {response.text}"
    assert data["centre"] == "Example Centre"
    assert data["crop"] == "Ragi"
    assert data["date"] == "2026-10-15"
    assert len(data["slots"]) == 3
    for s in data["slots"]:
        assert "slot" in s
        assert "predicted_demand" in s
        assert isinstance(s["predicted_demand"], int)
    assert data["model_used"] == "amazon/chronos-2"
    assert "HF_TOKEN" not in json.dumps(data)
    print(">>> POST /api/ml/demand-predict PASSED")


def test_recommend_slot():
    print("\n" + "=" * 60)
    print("4. Testing POST /api/ml/recommend-slot")
    print("=" * 60)
    # Testing slot recommender with slots and capacity
    payload = {
        "centre": "APMC Regional Centre",
        "crop": "Ragi",
        "date": "2026-10-15",
        "slots": [
            "09:00-10:00",
            "10:00-11:00",
            "11:00-12:00",
        ],
        "centre_capacity": 60,
        "existing_bookings": {
            "09:00-10:00": 45,
            "10:00-11:00": 12,
            "11:00-12:00": 50,
        },
    }
    print(f"Payload: {json.dumps(payload, indent=2)}")

    response = client.post("/api/ml/recommend-slot", json=payload)
    print(f"Status Code: {response.status_code}")
    data = response.json()
    print(f"Response: {json.dumps(data, indent=2)}")

    assert response.status_code == 200, f"Recommend slot failed: {response.text}"
    assert "recommended_slot" in data
    assert "predicted_demand" in data
    assert "reason" in data
    assert "HF_TOKEN" not in json.dumps(data)
    print(">>> POST /api/ml/recommend-slot PASSED")


def run_suite():
    print("\n" + "#" * 60)
    print("# RUNNING FASTAPI ML API TEST SUITE")
    print("#" * 60)
    test_health_check()
    test_price_estimate()
    test_demand_predict()
    test_recommend_slot()
    print("\n" + "#" * 60)
    print("# ALL FASTAPI API ENDPOINTS PASSED SUCCESSFULLY!")
    print("#" * 60)


if __name__ == "__main__":
    run_suite()
