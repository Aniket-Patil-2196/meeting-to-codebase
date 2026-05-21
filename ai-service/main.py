"""
Meeting → Codebase AI Service
FastAPI application that processes meeting transcripts using Gemini API
and returns structured JSON with issues, user stories, API schema,
and folder structure.
"""

import json
import os
import logging

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from google.genai import types
from google.genai.errors import APIError

load_dotenv()

# ── Logging setup ───────────────────────────────────────────
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ── FastAPI app ─────────────────────────────────────────────
app = FastAPI(
    title="Meeting → Codebase AI Service",
    description="Processes meeting transcripts with Gemini AI",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Gemini client ───────────────────────────────────────
api_key = os.getenv("GEMINI_API_KEY") or os.getenv("ANTHROPIC_API_KEY") # Fallback if you used the old key name
client = genai.Client(api_key=api_key)

MODEL = "gemini-2.5-pro"


# ── Request schema ─────────────────────────────────────────
class TranscriptRequest(BaseModel):
    transcript: str


# ── System prompt for Gemini ──────────────────────────────
SYSTEM_PROMPT = """You are a senior software architect. Analyze the product meeting \
transcript provided and return ONLY a valid JSON object with \
exactly these 4 keys:

{
  "issues": [
    {
      "title": "short action-oriented title",
      "description": "detailed description of what needs to be built",
      "labels": ["feature", "backend"]
    }
  ],
  "userStories": [
    {
      "role": "type of user",
      "goal": "what they want to do",
      "reason": "why they want to do it"
    }
  ],
  "apiSchema": [
    {
      "method": "POST",
      "endpoint": "/api/resource",
      "description": "what this endpoint does",
      "body": { "field": "type" }
    }
  ],
  "folderStructure": {
    "backend": {
      "routes": ["auth.js", "user.js"],
      "models": ["User.js"],
      "controllers": ["authController.js"]
    },
    "frontend": {
      "pages": ["Login.jsx", "Dashboard.jsx"],
      "components": ["Navbar.jsx", "Card.jsx"]
    }
  }
}

STRICT RULES:
- Return ONLY the JSON object. Nothing else.
- No markdown. No backticks. No explanation text.
- No trailing commas. Must be valid parseable JSON.
- Generate at least 3 issues, 2 user stories, 3 API endpoints.
- Make all content specific to what was discussed in the transcript."""

# ── Stricter retry prompt (used if first attempt fails) ────
STRICT_RETRY_PROMPT = """Your previous response was not valid JSON. \
You MUST return ONLY a raw JSON object. \
No markdown code fences. No explanation. No text before or after. \
Start your response with { and end with }. \
The JSON must have exactly these keys: issues, userStories, apiSchema, folderStructure."""


def parse_response(text: str) -> dict:
    """
    Attempt to parse the response as JSON.
    Strips markdown code fences if present, then parses.
    """
    cleaned = text.strip()

    # Strip markdown code fences if Gemini wraps the response
    if cleaned.startswith("```"):
        # Remove opening fence (```json or ```)
        try:
            first_newline = cleaned.index("\n")
            cleaned = cleaned[first_newline + 1 :]
        except ValueError:
            pass
        # Remove closing fence
        if cleaned.endswith("```"):
            cleaned = cleaned[: -3].strip()

    return json.loads(cleaned)


async def call_ai(transcript: str, is_retry: bool = False) -> dict:
    """
    Send the transcript to Gemini and parse the JSON response.
    On retry, appends a stricter instruction to force valid JSON.
    """
    system = SYSTEM_PROMPT
    if is_retry:
        system = SYSTEM_PROMPT + "\n\n" + STRICT_RETRY_PROMPT

    logger.info(
        "Calling Gemini API (retry=%s, transcript_length=%d)",
        is_retry,
        len(transcript),
    )

    response = client.models.generate_content(
        model=MODEL,
        contents=transcript,
        config=types.GenerateContentConfig(
            system_instruction=system,
            temperature=0.2,
        ),
    )

    raw_text = response.text
    logger.info("Gemini raw response length: %d chars", len(raw_text))

    return parse_response(raw_text)


# ── Health check ───────────────────────────────────────────
@app.get("/health")
async def health():
    """Simple health check endpoint."""
    return {"status": "ok", "service": "ai-service"}


# ── Main processing endpoint ──────────────────────────────
@app.post("/process")
async def process_transcript(request: TranscriptRequest):
    """
    Accepts a meeting transcript and returns structured JSON
    with issues, user stories, API schema, and folder structure.
    Retries once if AI returns invalid JSON.
    """
    if not request.transcript or not request.transcript.strip():
        raise HTTPException(status_code=400, detail="Transcript cannot be empty")

    # First attempt
    try:
        result = await call_ai(request.transcript)
        logger.info("✅ Gemini response parsed successfully on first attempt")
        return result
    except json.JSONDecodeError as e:
        logger.warning("⚠️  First Gemini response was invalid JSON: %s", str(e))
    except APIError as e:
        logger.error("❌ Gemini API error on first attempt: %s", str(e))
        if e.code == 400 and "API key not valid" in str(e).lower():
            raise HTTPException(
                status_code=401,
                detail="Invalid Gemini API key. Please check your GEMINI_API_KEY in .env",
            )
        raise HTTPException(
            status_code=502,
            detail=f"AI service error: {str(e)}",
        )
    except Exception as e:
        if "API_KEY_INVALID" in str(e) or "400" in str(e):
             raise HTTPException(
                status_code=401,
                detail="Invalid Gemini API key. Please check your GEMINI_API_KEY in .env",
            )
        logger.error("❌ Unexpected error on first attempt: %s", str(e))
        raise HTTPException(status_code=500, detail=str(e))

    # Retry with stricter prompt
    try:
        result = await call_ai(request.transcript, is_retry=True)
        logger.info("✅ Gemini response parsed successfully on retry")
        return result
    except json.JSONDecodeError as e:
        logger.error("❌ Gemini returned invalid JSON on retry: %s", str(e))
        raise HTTPException(
            status_code=502,
            detail="AI service returned invalid response after retry. Please try again.",
        )
    except APIError as e:
        logger.error("❌ Gemini API error: %s", str(e))
        raise HTTPException(
            status_code=502,
            detail=f"AI service error: {str(e)}",
        )
    except Exception as e:
        logger.error("❌ Unexpected error: %s", str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}",
        )


# ── Run with: uvicorn main:app --reload --port 8000 ───────
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
