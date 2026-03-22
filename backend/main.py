import os
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from model import humanize_text
import time

# ── Rate limiter ──────────────────────────────────────────────────────────────
limiter = Limiter(key_func=get_remote_address)

# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="AI Text Humanizer API",
    description="Rewrite AI-generated text to sound natural and human using Mistral 7B",
    version="1.0.0",
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS: Set ALLOWED_ORIGINS env var in production (comma-separated)
# e.g. "https://yourusername.github.io,http://localhost:5173"
allowed_origins = os.getenv("ALLOWED_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Schemas ───────────────────────────────────────────────────────────────────
class HumanizeRequest(BaseModel):
    text: str = Field(..., min_length=10, max_length=5000, description="Text to humanize")
    tone: str = Field("default", description="Tone: default | formal | casual | academic")

class HumanizeResponse(BaseModel):
    result: str
    original_word_count: int
    result_word_count: int
    tone: str
    processing_time_ms: int

# ── Routes ────────────────────────────────────────────────────────────────────
@app.get("/")
def root():
    return {"status": "ok", "message": "AI Humanizer API is running 🚀"}

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.post("/humanize", response_model=HumanizeResponse)
@limiter.limit("10/minute")
async def humanize(request: Request, body: HumanizeRequest):
    valid_tones = {"default", "formal", "casual", "academic"}
    if body.tone not in valid_tones:
        raise HTTPException(status_code=400, detail=f"Invalid tone. Choose from: {valid_tones}")

    start = time.time()

    try:
        result = humanize_text(body.text, tone=body.tone)
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))

    elapsed_ms = int((time.time() - start) * 1000)

    return HumanizeResponse(
        result=result,
        original_word_count=len(body.text.split()),
        result_word_count=len(result.split()),
        tone=body.tone,
        processing_time_ms=elapsed_ms,
    )
