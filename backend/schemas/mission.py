from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Any
from datetime import datetime

class MissionStep(BaseModel):
    title: str = Field(..., description="Short title of the step or challenge")
    description: str = Field(..., description="Actionable instruction for the user outside")

class MissionGenerated(BaseModel):
    title: str = Field(..., description="Evocative outdoor mission title")
    tagline: str = Field(..., description="Short inspiring tagline")
    duration_minutes: int = Field(..., ge=5, le=300, description="Total planned duration in minutes")
    activity: str = Field(..., description="Primary outdoor activity")
    difficulty: str = Field(..., description="Easy, Moderate, or Challenging")
    intro: str = Field(..., description="Contextual setting of the mission")
    mission: str = Field(..., description="Core actionable outdoors objective")
    steps: List[MissionStep] = Field(..., min_length=1, description="List of 2 to 4 progression steps")
    challenge: str = Field(..., description="Specific screen-free or observation challenge")
    screen_free_minutes: int = Field(..., ge=0, description="Minimum suggested screen-free duration")
    safety_note: str = Field(..., description="Awareness and safety reminder")
    completion_message: str = Field(..., description="Encouraging completion acknowledgment")

class MissionGenerateRequest(BaseModel):
    duration: int = Field(..., ge=5, le=300, description="Duration in minutes (e.g. 15, 30, 45, 60, 90, 120)")
    activity: str = Field(..., min_length=2, description="Activity (e.g. Walking, Running, Bird Watching)")
    mood: str = Field(..., min_length=2, description="Mood (e.g. Relaxing, Adventurous, Curious)")
    difficulty: str = Field(..., min_length=2, description="Difficulty (e.g. Easy, Moderate, Challenging)")
    interests: List[str] = Field(default_factory=list, description="Selected interests")
    additional_context: Optional[str] = Field(default="", max_length=500, description="Optional notes or goals")
    location_context: Optional[str] = Field(default="", max_length=200, description="Optional environment context (e.g. local park, woods, neighborhood)")

class MissionCreate(BaseModel):
    title: str
    tagline: str
    activity: str
    duration_minutes: int
    difficulty: str
    mission_json: dict
    completed: bool = False
    reflection: Optional[str] = None
    feeling: Optional[str] = None

class MissionCompleteRequest(BaseModel):
    reflection: Optional[str] = None
    feeling: Optional[str] = None

class MissionResponse(BaseModel):
    id: int
    title: str
    tagline: str
    activity: str
    duration_minutes: int
    difficulty: str
    mission_data: dict
    completed: bool
    reflection: Optional[str]
    feeling: Optional[str]
    created_at: datetime
    completed_at: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)
