import json
import logging
import httpx
import re
from typing import Dict, Any
from backend.config import settings
from backend.schemas.mission import MissionGenerateRequest, MissionGenerated, MissionStep

logger = logging.getLogger("trailbuddy.ollama")

SYSTEM_PROMPT = """You are TrailBuddy, an outdoor mission designer created for the Hacktoberfest 'Touch Grass' challenge.
Your sole mission is: USE THE SCREEN TO PLAN. THEN PUT THE SCREEN AWAY AND GO OUTSIDE.

You generate concrete, engaging, screen-free outdoor missions tailored to the user's available time, activity, mood, difficulty, and interests.

CRITICAL RULES:
1. Output MUST be ONLY valid JSON with no markdown fences, no conversational preface, and no trailing comments.
2. The mission must be achievable in the specified duration.
3. SAFETY FIRST: Never require trespassing, private property access, hazardous climbing, wildlife disturbance, dangerous road crossing, or risky behavior.
4. Always emphasize situational awareness and safety.
5. Maximize screen-free time. The mission should require placing the phone in a pocket or bag.
6. Make activities concrete, mindful, and sensory (not vague motivational platitudes).

JSON SCHEMA:
{
  "title": "String - Evocative outdoor title",
  "tagline": "String - One crisp punchy line",
  "duration_minutes": Integer - matching requested minutes,
  "activity": "String - the selected activity",
  "difficulty": "String - Easy, Moderate, or Challenging",
  "intro": "String - 1-2 sentences setting the purpose of stepping outside",
  "mission": "String - 2-3 sentences detailing the primary outdoor objective",
  "steps": [
    {
      "title": "String - step title",
      "description": "String - clear, actionable instruction outside"
    }
  ],
  "challenge": "String - A specific observation or phone-free challenge during the outing",
  "screen_free_minutes": Integer - calculated screen-free minutes (typically 70-90% of duration),
  "safety_note": "String - Short practical safety & awareness tip",
  "completion_message": "String - Thoughtful sentence acknowledging their return from the real world"
}
"""

SAMPLE_MOCK_MISSIONS = [
    {
        "title": "The Canopy & Texture Expedition",
        "tagline": "Look up, look close, and touch natural textures.",
        "duration_minutes": 30,
        "activity": "Nature Exploration",
        "difficulty": "Easy",
        "intro": "Every neighborhood and park has an intricate micro-world waiting to be observed when screens go silent.",
        "mission": "Venture outside and systematically discover three distinctly different bark patterns, canopy leaf shapes, and moss formations.",
        "steps": [
            {
                "title": "Step Away & Stow",
                "description": "Put your phone in your pocket or backpack. Take five deep breaths of outside air before walking."
            },
            {
                "title": "The Bark & Branch Hunt",
                "description": "Locate three distinct tree species. Gently examine their bark texture and observe how light filters through the foliage."
            },
            {
                "title": "Micro-Landscape Discovery",
                "description": "Crouch down near a stone, log, or grass patch. Observe the tiny organisms and natural geometry at your feet for 5 uninterrupted minutes."
            }
        ],
        "challenge": "Complete the entire middle 20 minutes without checking time or looking at any digital screen.",
        "screen_free_minutes": 25,
        "safety_note": "Watch your footing around roots and stones; respect living plants and leave nature undisturbed.",
        "completion_message": "You touched bark, felt the breeze, and traded digital pixels for living sunlight."
    },
    {
        "title": "The Hidden Details Walk",
        "tagline": "Slow down and notice what you normally miss.",
        "duration_minutes": 60,
        "activity": "Walking",
        "difficulty": "Easy",
        "intro": "Today is about noticing the subtle, overlooked details in the environment you usually rush through.",
        "mission": "Take an unhurried walk through your chosen route, paying deliberate attention to architectural accents, wind shifts, and bird calls.",
        "steps": [
            {
                "title": "Start Slowly",
                "description": "Walk at half your typical speed for the first 10 minutes. Resist the urge to check notifications or messages."
            },
            {
                "title": "Sound Mapping",
                "description": "Pause at a bench or quiet corner. Close your eyes for 60 seconds and identify three distant sounds (leaves rustling, bird calls, wind)."
            },
            {
                "title": "One Single Memory",
                "description": "Notice one captivating natural composition or contrast. If you take a photo, take exactly one and immediately stow your phone away."
            }
        ],
        "challenge": "Spend at least 45 minutes completely immersed in your surroundings without touching your screen.",
        "screen_free_minutes": 50,
        "safety_note": "Always maintain full situational awareness at street corners, intersections, and multi-use paths.",
        "completion_message": "You didn't just walk — you awakened your senses to the real world."
    },
    {
        "title": "The Wind & Horizon Waypoint",
        "tagline": "Elevate your perspective and feel the outdoor elements.",
        "duration_minutes": 45,
        "activity": "Hiking",
        "difficulty": "Moderate",
        "intro": "A deliberate outdoor trek designed to get your heart pumping and disconnect from cyberspace.",
        "mission": "Hike or walk toward an elevated viewpoint, open meadow, or park horizon. Track the direction of the breeze and change of altitude.",
        "steps": [
            {
                "title": "Pacing the Ascent",
                "description": "Keep a steady, mindful rhythm. Focus your attention on your breathing and the ground beneath your soles."
            },
            {
                "title": "Horizon Observation",
                "description": "Reach your designated open point or landmark. Stand still for 3 minutes observing clouds moving across the sky."
            },
            {
                "title": "Mindful Descent",
                "description": "Descend or loop back along an alternate pathway you haven't trodden recently."
            }
        ],
        "challenge": "Do not glance at your phone screen until you have returned to your starting point.",
        "screen_free_minutes": 40,
        "safety_note": "Stay on marked trails, stay hydrated, and dress appropriately for current weather conditions.",
        "completion_message": "Your feet explored earth and your eyes witnessed genuine open horizons today."
    }
]

def clean_json_response(raw_text: str) -> str:
    """Strip markdown code blocks and find the outermost JSON object."""
    text = raw_text.strip()
    # Remove markdown code block fences if present
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*", "", text, flags=re.IGNORECASE)
        text = re.sub(r"\s*```$", "", text)
    
    # Locate outermost { and }
    match = re.search(r"(\{.*\})", text, re.DOTALL)
    if match:
        return match.group(1).strip()
    return text.strip()

def get_mock_mission(req: MissionGenerateRequest) -> MissionGenerated:
    """Generate high-quality contextual deterministic mission when MOCK_AI=true."""
    # Find matching template or adjust dynamically
    template = SAMPLE_MOCK_MISSIONS[0]
    for sample in SAMPLE_MOCK_MISSIONS:
        if sample["activity"].lower() == req.activity.lower() or sample["duration_minutes"] == req.duration:
            template = sample
            break

    # Build custom customized version
    screen_free = max(5, int(req.duration * 0.8))
    steps = [
        MissionStep(
            title=f"Set Out: {req.mood} Pacing",
            description=f"Begin your {req.duration}-minute {req.activity.lower()} session. Put your phone in your pocket and commit to being present."
        ),
        MissionStep(
            title=f"Focus on {', '.join(req.interests) if req.interests else 'Your Surroundings'}",
            description=f"Actively seek out 3 unique examples of {', '.join(req.interests) if req.interests else 'nature'} in your immediate environment without looking at a screen."
        ),
        MissionStep(
            title="Sensory Check-In",
            description="Stop for 2 minutes. Listen for the furthest ambient sound and feel the temperature of the air on your face."
        )
    ]

    context_hint = f" ({req.additional_context})" if req.additional_context else ""
    return MissionGenerated(
        title=f"The {req.mood} {req.activity} Quest",
        tagline=f"Trade screen glow for fresh air and {req.mood.lower()} outdoor exploration.",
        duration_minutes=req.duration,
        activity=req.activity,
        difficulty=req.difficulty,
        intro=f"Your custom mission designed to recharge your mind through {req.activity.lower()}{context_hint}.",
        mission=f"Spend {req.duration} minutes outside engaging in {req.activity.lower()} with an intentional {req.mood.lower()} mindset.",
        steps=steps,
        challenge=f"Spend at least {screen_free} continuous minutes completely free from phone interaction.",
        screen_free_minutes=screen_free,
        safety_note="Stay aware of traffic, weather, trail conditions, and pedestrians. Never enter restricted or private areas.",
        completion_message=f"You successfully completed your {req.duration}-minute outdoor mission and reclaimed real-world presence."
    )

async def generate_mission_with_ollama(req: MissionGenerateRequest) -> MissionGenerated:
    """
    Calls local Ollama instance running Qwen3 (or configured open-weight model).
    Handles fallbacks, connection timeouts, and strict schema validation.
    """
    if settings.MOCK_AI:
        logger.info("MOCK_AI is enabled. Returning mock mission.")
        return get_mock_mission(req)

    user_prompt = f"""Generate an outdoor mission for:
- Available Time: {req.duration} minutes
- Activity: {req.activity}
- Mood: {req.mood}
- Difficulty Level: {req.difficulty}
- Specific Interests: {', '.join(req.interests) if req.interests else 'General nature observation'}
- Additional User Context: {req.additional_context or 'None'}
- Location Context: {req.location_context or 'General outdoors / park / neighborhood'}

Produce STRICT JSON matching the schema now."""

    payload = {
        "model": settings.OLLAMA_MODEL,
        "prompt": user_prompt,
        "system": SYSTEM_PROMPT,
        "stream": False,
        "format": "json",
        "options": {
            "temperature": 0.7,
            "top_p": 0.9,
        }
    }

    url = f"{settings.OLLAMA_BASE_URL.rstrip('/')}/api/generate"

    try:
        async with httpx.AsyncClient(timeout=settings.OLLAMA_TIMEOUT_SECONDS) as client:
            response = await client.post(url, json=payload)
            if response.status_code == 404:
                raise RuntimeError(
                    f"Model '{settings.OLLAMA_MODEL}' not found in Ollama. "
                    f"Please run 'ollama pull {settings.OLLAMA_MODEL}'."
                )
            response.raise_for_status()
            data = response.json()
            raw_response = data.get("response", "")
            
            cleaned_json = clean_json_response(raw_response)
            parsed_data = json.loads(cleaned_json)

            # Ensure fields match schema
            if "duration_minutes" not in parsed_data:
                parsed_data["duration_minutes"] = req.duration
            if "activity" not in parsed_data:
                parsed_data["activity"] = req.activity
            if "difficulty" not in parsed_data:
                parsed_data["difficulty"] = req.difficulty
            if "screen_free_minutes" not in parsed_data:
                parsed_data["screen_free_minutes"] = max(5, int(req.duration * 0.75))

            # Validate with Pydantic
            mission = MissionGenerated(**parsed_data)
            return mission

    except httpx.ConnectError as exc:
        logger.error(f"Cannot connect to Ollama at {settings.OLLAMA_BASE_URL}: {exc}")
        raise ConnectionError(
            "TrailBuddy's local AI is unavailable. Start Ollama and make sure the configured model is installed."
        ) from exc
    except httpx.TimeoutException as exc:
        logger.error(f"Timeout while waiting for Ollama: {exc}")
        raise TimeoutError("Ollama took too long to generate the mission. Please verify your system load and model size.") from exc
    except (json.JSONDecodeError, ValueError) as exc:
        logger.error(f"Malformed JSON from Ollama: {exc}")
        raise ValueError("The local AI produced an invalid mission format. Please try again.") from exc
