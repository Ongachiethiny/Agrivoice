"""
Speech Router
Handles speech-to-text and text-to-speech endpoints
"""
from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import Optional
import os
import tempfile
from ..services.speech import SpeechService

router = APIRouter(prefix="/api/v1", tags=["speech"])
speech_service = SpeechService()


class SpeechToTextResponse(BaseModel):
    text: str
    confidence: float = 0.9


class TextToSpeechResponse(BaseModel):
    status: str
    file: Optional[str] = None


@router.post("/speech-to-text", response_model=SpeechToTextResponse)
async def speech_to_text(file: UploadFile = File(...)):
    """
    Convert farmer's voice question to text using Azure Speech-to-Text.
    
    Accepts audio files in WAV, MP3, or OGG format.
    """
    try:
        # Save uploaded file to temporary location
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
            content = await file.read()
            tmp.write(content)
            tmp_path = tmp.name
        
        # Convert speech to text
        text = await speech_service.speech_to_text(tmp_path)
        
        # Clean up
        os.unlink(tmp_path)
        
        return SpeechToTextResponse(text=text, confidence=0.9)
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/text-to-speech", response_model=TextToSpeechResponse)
async def text_to_speech(text: str, save_file: bool = False):
    """
    Convert diagnosis recommendations to speech for farmers.
    
    - **text**: Text to convert to speech
    - **save_file**: If True, returns file path. If False, streams audio.
    """
    try:
        output_file = None
        if save_file:
            output_file = tempfile.mktemp(suffix=".wav")
        
        result = await speech_service.text_to_speech(text, output_file)
        return result
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/health/speech")
async def speech_health():
    """Check speech service health"""
    return {"service": "speech", "status": "operational"}
