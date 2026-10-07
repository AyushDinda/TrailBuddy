from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from datetime import datetime, timezone
from backend.database.database import Base

class Mission(Base):
    __tablename__ = "missions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    tagline = Column(String(500), nullable=False)
    activity = Column(String(100), nullable=False)
    duration_minutes = Column(Integer, nullable=False)
    difficulty = Column(String(50), nullable=False)
    mission_json = Column(Text, nullable=False)
    completed = Column(Boolean, default=False, nullable=False)
    reflection = Column(Text, nullable=True)
    feeling = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    completed_at = Column(DateTime, nullable=True)
