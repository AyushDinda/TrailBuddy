import os
from pydantic_settings import BaseSettings
from typing import List

from pydantic import ConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "TrailBuddy API"
    VERSION: str = "1.0.0"
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "qwen3")
    MOCK_AI: bool = os.getenv("MOCK_AI", "false").lower() in ("true", "1", "yes")
    FRONTEND_ORIGIN: str = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./trailbuddy.db")
    OLLAMA_TIMEOUT_SECONDS: float = float(os.getenv("OLLAMA_TIMEOUT_SECONDS", "60.0"))

    model_config = ConfigDict(env_file=".env", extra="ignore")

settings = Settings()
