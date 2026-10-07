from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from backend.config import settings
from backend.database.database import init_db
from backend.api.routes import router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("trailbuddy")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure tables exist
    logger.info("Initializing database...")
    init_db()
    logger.info("TrailBuddy backend started successfully.")
    logger.info(f"Ollama Base URL: {settings.OLLAMA_BASE_URL} | Model: {settings.OLLAMA_MODEL} | MOCK_AI: {settings.MOCK_AI}")
    yield
    logger.info("Shutting down TrailBuddy backend.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Offline outdoor companion powered by local open-weight AI (Qwen3 + Ollama).",
    lifespan=lifespan
)

# CORS configuration
origins = [
    settings.FRONTEND_ORIGIN,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")

@app.get("/")
def root():
    return {
        "message": "Welcome to TrailBuddy API — Your Offline Outdoor Companion",
        "docs": "/docs",
        "health": "/api/health"
    }
