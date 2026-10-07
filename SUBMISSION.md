*This is a submission for the [Hacktoberfest Open-Source AI Challenge Week 1: Touch Grass](https://dev.to/challenges/hacktoberfest-week1-2026-10-05)*

## What I Built

**TrailBuddy** is an open-source, offline-first outdoor companion engineered around a single radical product principle:

> **"Use your screen to plan. Then put the screen away and go outside."**

Most modern AI apps are built as conversational time-sinks—they reward endless prompt loops, infinite chat threads, and digital addiction. **TrailBuddy does the exact opposite.** It treats the screen as a temporary launching pad:

1. **Personalized Outdoor Mission Planning**: In under 30 seconds, users configure their available time (15m to 2+ hours), outdoor activity (walking, hiking, bird watching, photography walk, mindful outdoor time), mood, difficulty level, and interests (flora, architecture, wildlife, mindfulness).
2. **Local AI Mission Synthesis**: Instead of generic motivational essays, a local open-weight model (**Qwen3** or **Llama 3.1** via **Ollama**) generates structured, concrete observation quests with sequential challenges (e.g. noticing bark textures, mapping ambient sounds, or tracking cloud paths) and a strict screen-free goal (e.g., 40 minutes of uninterrupted pocket time).
3. **Screen-Free by Design**: The moment the user clicks **"Start Mission"**, the app collapses into an intentionally minimalist, high-contrast countdown screen with a prominent visual reminder: *"Your screen time is over. Go outside. We'll be here when you return."*
4. **Mindful Completion & Offline Reflection**: Upon returning, users record how the outing felt and journal what they physically noticed. The record is permanently archived in a local SQLite database without any cloud surveillance.

**Who is it for?**
Developers, students, remote workers, and outdoor enthusiasts experiencing screen fatigue, digital burnout, and cognitive overload who want a gentle, structured nudge to reconnect with the physical world.

---

## Demo

- **Live Local Demo URL**: `http://localhost:5173`
- **Backend API & Swagger Docs**: `http://localhost:8000/docs`

### Key User Experience Walkthrough:
- **Hero & Landing**: Nature-inspired design language (moss, earth, sky tones) with pure CSS vector art, zero external asset dependencies, and an instant local AI health indicator.
- **Multi-Step Questionnaire**: Accessible 6-step form with visual progress indicators, keyboard accessibility, and cycling AI planning animations.
- **Mission Preview**: Outlines mission objectives, sequential sensory challenges, screen-free time targets, and situational safety guardrails.
- **Active Countdown Mode**: Intentionally distraction-free screen with pause/resume and full `localStorage` persistence across browser refreshes or device sleep.
- **Reflection Archive**: A private SQLite history journal capturing feelings (*Energizing*, *Relaxing*, *Challenging*) and sensory observations.

---

## Code

{% github https://github.com/AyushDinda/TrailBuddy %}

**Repository Tech Stack:**
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide React, React Router.
- **Backend**: Python 3.13, FastAPI, Pydantic v2, SQLAlchemy, Uvicorn, HTTPX.
- **Database**: SQLite (`trailbuddy.db`).
- **AI Engine**: Ollama running open-weight **Qwen3** / **Llama 3.1** locally on `localhost:11434`.
- **Testing**: `pytest`, FastAPI `TestClient`, and end-to-end automated integration tests.
- **License**: MIT License.

---

## How I Built It

TrailBuddy was architected from day one to keep the AI meaningful, private, and strictly offline:

### 1. Local Open-Weight Inference with Ollama & Qwen3
Instead of calling a proprietary cloud API over the internet, TrailBuddy sends structured prompts directly to a locally hosted **Qwen3** (or **Llama 3.1**) model running on **Ollama** (`http://localhost:11434`). The backend enforces **strict JSON schema formatting** directly in the model's generation parameters, ensuring zero conversational preamble and instant client-side parsing.

### 2. Guardrailed Mission Engineering
The AI system prompt enforces strict real-world safety heuristics:
- **Zero Trespassing**: Never instructs users to cross private land or restricted zones.
- **Physical Safety**: Avoids hazardous climbing, wildlife interference, or distracting phone use in traffic.
- **Maximum Screen-Free Ratio**: Automatically calculates a screen-free target representing 75–85% of the outing's duration.

### 3. Resilient Architecture & Mock Fallback
- The FastAPI backend sits between the browser and Ollama as a security barrier, sanitizing untrusted model outputs through Pydantic v2 schemas.
- If Ollama is offline or warming up, the UI delivers a clear notification rather than fake AI text.
- For CI/CD and systems without GPUs, a deterministic `MOCK_AI=true` development mode enables full test suite execution.

### 4. Client-Side Durability
Active outdoor missions shouldn't be lost if a phone screen locks or a tab reloads while walking. TrailBuddy synchronizes the timer state and active challenge progress with `localStorage`, while persisting completed sessions permanently to SQLite.

---

## Why Does Open Innovation Matter?

Open innovation and open-weight models are the cornerstone of TrailBuddy's existence:

1. **Zero Surveillance & True Location Privacy**: An outdoor companion app frequently touches user schedules, moods, and neighborhood environments. By running open weights locally through Ollama, **not a single byte of user context ever touches a third-party cloud server**.
2. **No Commercial Paywalls or Token Subscriptions**: Closed APIs charge per-token fees and deprecate models without warning. Open-weight models like Qwen3 and Llama give developers permanent ownership and free local inference forever.
3. **Anti-Engagement Philosophy**: Proprietary tech platforms build algorithms designed to maximize screen time, ad impressions, and engagement loops. Open innovation gave us the freedom to build software that intentionally measures its success by **how quickly users close the application and go outside**.
4. **Developer Hackability & Model Agnosticism**: Anyone can fork TrailBuddy and swap Qwen3 for Mistral, Gemma 2, or Phi with a single line change in `.env` (`OLLAMA_MODEL=gemma2`).

---

## My Agent Session

TrailBuddy was developed in an agentic pair-programming workflow using **Google DeepMind Antigravity**. The full stack—from database schemas and FastAPI endpoints to the nature-inspired Tailwind design system and automated pytest suites—was built, debugged, and verified end-to-end with automated test runs and live server validation.

---

## Prize Categories

- **Main Track**: Hacktoberfest Open-Source AI Challenge Week 1: "Touch Grass"
- **Open-Weight AI**: Best use of locally hosted open-weight models (Qwen3 / Llama 3 via Ollama)
