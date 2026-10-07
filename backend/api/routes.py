import json
from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc

from backend.database.database import get_db
from backend.database.models import Mission
from backend.schemas.mission import (
    MissionGenerateRequest,
    MissionGenerated,
    MissionCreate,
    MissionCompleteRequest,
    MissionResponse
)
from backend.services.ollama_service import generate_mission_with_ollama
from backend.config import settings

router = APIRouter()

def model_to_response(m: Mission) -> MissionResponse:
    try:
        mission_dict = json.loads(m.mission_json)
    except Exception:
        mission_dict = {}

    return MissionResponse(
        id=m.id,
        title=m.title,
        tagline=m.tagline,
        activity=m.activity,
        duration_minutes=m.duration_minutes,
        difficulty=m.difficulty,
        mission_data=mission_dict,
        completed=m.completed,
        reflection=m.reflection,
        feeling=m.feeling,
        created_at=m.created_at,
        completed_at=m.completed_at
    )

@router.get("/health", tags=["Health"])
async def health_check():
    """Health-check endpoint returning API status, configured AI model, and mode."""
    return {
        "status": "healthy",
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "ollama_base_url": settings.OLLAMA_BASE_URL,
        "ollama_model": settings.OLLAMA_MODEL,
        "mock_ai": settings.MOCK_AI,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@router.post("/missions/generate", response_model=MissionGenerated, tags=["AI Missions"])
async def generate_mission(req: MissionGenerateRequest):
    """
    Generate a personalized outdoor mission using local Qwen3 model via Ollama.
    """
    try:
        mission = await generate_mission_with_ollama(req)
        return mission
    except ConnectionError as ce:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(ce)
        )
    except TimeoutError as te:
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail=str(te)
        )
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(ve)
        )
    except RuntimeError as re:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(re)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred generating your mission: {str(e)}"
        )

@router.post("/missions", response_model=MissionResponse, status_code=status.HTTP_201_CREATED, tags=["Missions"])
def create_mission(mission_in: MissionCreate, db: Session = Depends(get_db)):
    """
    Save a mission to SQLite database.
    """
    try:
        db_mission = Mission(
            title=mission_in.title,
            tagline=mission_in.tagline,
            activity=mission_in.activity,
            duration_minutes=mission_in.duration_minutes,
            difficulty=mission_in.difficulty,
            mission_json=json.dumps(mission_in.mission_json),
            completed=mission_in.completed,
            reflection=mission_in.reflection,
            feeling=mission_in.feeling,
            created_at=datetime.now(timezone.utc),
            completed_at=datetime.now(timezone.utc) if mission_in.completed else None
        )
        db.add(db_mission)
        db.commit()
        db.refresh(db_mission)
        return model_to_response(db_mission)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save mission: {str(e)}"
        )

@router.get("/missions", response_model=List[MissionResponse], tags=["Missions"])
def list_missions(db: Session = Depends(get_db)):
    """
    Fetch history of missions ordered newest to oldest.
    """
    missions = db.query(Mission).order_by(desc(Mission.created_at)).all()
    return [model_to_response(m) for m in missions]

@router.get("/missions/{mission_id}", response_model=MissionResponse, tags=["Missions"])
def get_mission(mission_id: int, db: Session = Depends(get_db)):
    """
    Fetch single mission details by ID.
    """
    mission = db.query(Mission).filter(Mission.id == mission_id).first()
    if not mission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Mission with ID {mission_id} not found"
        )
    return model_to_response(mission)

@router.patch("/missions/{mission_id}/complete", response_model=MissionResponse, tags=["Missions"])
def complete_mission(
    mission_id: int,
    req: MissionCompleteRequest,
    db: Session = Depends(get_db)
):
    """
    Mark a mission as completed and record reflections and feelings.
    """
    mission = db.query(Mission).filter(Mission.id == mission_id).first()
    if not mission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Mission with ID {mission_id} not found"
        )
    
    mission.completed = True
    mission.completed_at = datetime.now(timezone.utc)
    if req.reflection is not None:
        mission.reflection = req.reflection
    if req.feeling is not None:
        mission.feeling = req.feeling

    db.commit()
    db.refresh(mission)
    return model_to_response(mission)

@router.delete("/missions/{mission_id}", tags=["Missions"])
def delete_mission(mission_id: int, db: Session = Depends(get_db)):
    """
    Delete a mission record from database.
    """
    mission = db.query(Mission).filter(Mission.id == mission_id).first()
    if not mission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Mission with ID {mission_id} not found"
        )
    db.delete(mission)
    db.commit()
    return {"success": True, "message": f"Mission {mission_id} deleted successfully"}
