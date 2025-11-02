from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, HttpUrl
import time
from typing import Optional

app = FastAPI(title="AMD Service", version="0.1.0")

class PredictIn(BaseModel):
    audio_url: Optional[HttpUrl] = None
    audio_b64: Optional[str] = None

class PredictOut(BaseModel):
    label: str  # "human" | "machine"
    confidence: float
    latency_ms: int
    details: dict

@app.get("/")
async def root():
    return {"ok": True, "service": "amd"}

@app.post("/predict", response_model=PredictOut)
async def predict(inp: PredictIn):
    t0 = time.time()
    # Minimal mock: if audio_url present and contains 'machine', return machine
    try:
      if inp.audio_url and 'machine' in str(inp.audio_url):
          label = 'machine'
          conf = 0.9
      else:
          label = 'human'
          conf = 0.7
    except Exception:
      label = 'human'
      conf = 0.6

    latency_ms = int((time.time() - t0) * 1000)
    return PredictOut(label=label, confidence=conf, latency_ms=latency_ms, details={"rule": "url_contains_machine"})
