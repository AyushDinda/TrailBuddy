import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.main import app
from backend.database.database import Base, get_db
from backend.config import settings

# Test database in memory
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_trailbuddy.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    # Enable mock AI for deterministic test execution
    settings.MOCK_AI = True
    yield
    Base.metadata.drop_all(bind=engine)

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "ollama_model" in data
    assert data["mock_ai"] is True

def test_generate_mission_mock():
    payload = {
        "duration": 45,
        "activity": "Walking",
        "mood": "Curious",
        "difficulty": "Easy",
        "interests": ["Nature", "Photography"],
        "additional_context": "Want to listen to birds",
        "location_context": "Local park"
    }
    response = client.post("/api/missions/generate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["duration_minutes"] == 45
    assert data["activity"] == "Walking"
    assert "steps" in data
    assert len(data["steps"]) >= 1
    assert "screen_free_minutes" in data
    assert data["screen_free_minutes"] > 0
    assert "safety_note" in data

def test_generate_mission_invalid_request():
    # Duration too small (< 5 minutes)
    payload = {
        "duration": 2,
        "activity": "Walking",
        "mood": "Relaxing",
        "difficulty": "Easy",
        "interests": []
    }
    response = client.post("/api/missions/generate", json=payload)
    assert response.status_code == 422  # Pydantic validation error

def test_mission_lifecycle_crud():
    # 1. Generate or define mission JSON
    mission_json = {
        "title": "Park Canopy Stroll",
        "tagline": "Discover ancient barks and skyward branches",
        "duration_minutes": 30,
        "activity": "Walking",
        "difficulty": "Easy",
        "intro": "Step out into the local greenway.",
        "mission": "Take an unhurried walk and observe 3 tree types.",
        "steps": [
            {"title": "Unplug", "description": "Place phone in pocket."},
            {"title": "Observe", "description": "Touch three distinct tree trunks."}
        ],
        "challenge": "No screen glances for 25 minutes.",
        "screen_free_minutes": 25,
        "safety_note": "Stay aware of other walkers and cyclists.",
        "completion_message": "Welcome back! You experienced the living canopy."
    }

    # 2. Save mission
    create_payload = {
        "title": mission_json["title"],
        "tagline": mission_json["tagline"],
        "activity": mission_json["activity"],
        "duration_minutes": mission_json["duration_minutes"],
        "difficulty": mission_json["difficulty"],
        "mission_json": mission_json,
        "completed": False
    }
    create_res = client.post("/api/missions", json=create_payload)
    assert create_res.status_code == 201
    created_data = create_res.json()
    mission_id = created_data["id"]
    assert created_data["completed"] is False
    assert created_data["title"] == "Park Canopy Stroll"

    # 3. Retrieve single mission
    get_res = client.get(f"/api/missions/{mission_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == mission_id

    # 4. List missions
    list_res = client.get("/api/missions")
    assert list_res.status_code == 200
    assert len(list_res.json()) == 1

    # 5. Complete mission with reflection & feeling
    complete_payload = {
        "feeling": "Energizing",
        "reflection": "I noticed the incredible smell of wet pines after the rain."
    }
    comp_res = client.patch(f"/api/missions/{mission_id}/complete", json=complete_payload)
    assert comp_res.status_code == 200
    completed_data = comp_res.json()
    assert completed_data["completed"] is True
    assert completed_data["feeling"] == "Energizing"
    assert "wet pines" in completed_data["reflection"]
    assert completed_data["completed_at"] is not None

    # 6. Delete mission
    del_res = client.delete(f"/api/missions/{mission_id}")
    assert del_res.status_code == 200
    assert del_res.json()["success"] is True

    # 7. Verify deletion
    verify_res = client.get(f"/api/missions/{mission_id}")
    assert verify_res.status_code == 404
