"""
Copilot Studio Integration Router
Handles requests from Microsoft Copilot Studio bot
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import base64

from app.services import vision, gpt4, speech
from app.services.fabric import log_diagnosis_event

router = APIRouter(prefix="/api/copilot", tags=["copilot"])


class CopilotDiagnoseRequest(BaseModel):
    """Request payload from Copilot Studio bot"""
    image_base64: str  # Base64-encoded image from Copilot
    question: str  # User's question
    language: str = "en"  # Target language
    user_id: Optional[str] = None  # For tracking


class CopilotDiagnoseResponse(BaseModel):
    """Response format expected by Copilot Studio bot"""
    status: str
    diagnosis: str  # Plain text for bot to speak
    diagnosis_original: str  # Original English version
    audio_base64: Optional[str] = None  # Optional audio
    language: str
    tags: list


@router.post("/diagnose-crop", response_model=CopilotDiagnoseResponse)
async def copilot_diagnose_crop(request: CopilotDiagnoseRequest):
    """
    Copilot Studio bot integration endpoint.
    
    This endpoint is called by Microsoft Copilot Studio bot configured in:
    copilot-config/manifest.json
    
    Args:
        request: Contains base64 image, question, and language
    
    Returns:
        Response with diagnosis text and optional audio (Copilot bot will speak this)
    """
    try:
        # Step 1: Decode base64 image
        try:
            image_bytes = base64.b64decode(request.image_base64)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid base64 image: {str(e)}")
        
        # Step 2: Analyze image to get tags
        detected_tags = await vision.analyze_image(image_bytes)
        
        # Step 3: Get diagnosis from GPT-4
        diagnosis_original = await gpt4.get_agronomist_advice(
            detected_tags, 
            request.question, 
            "en"  # Always get English first
        )
        
        # Step 4: Translate if needed
        if request.language != "en":
            diagnosis_translated = await speech.translate_text(
                diagnosis_original, 
                request.language
            )
        else:
            diagnosis_translated = diagnosis_original
        
        # Step 5: Generate audio for Copilot to read
        try:
            audio_base64 = await speech.generate_audio(
                diagnosis_translated, 
                request.language
            )
        except Exception as e:
            # Audio generation is optional
            print(f"Warning: Audio generation failed: {str(e)}")
            audio_base64 = None
        
        # Step 6: Log event
        log_data = {
            "source": "copilot_studio",
            "user_id": request.user_id,
            "tags": detected_tags,
            "question": request.question,
            "diagnosis": diagnosis_original,
            "language": request.language,
            "translated_diagnosis": diagnosis_translated
        }
        await log_diagnosis_event(log_data)
        
        # Step 7: Return response in Copilot format
        return CopilotDiagnoseResponse(
            status="success",
            diagnosis=diagnosis_translated,  # For bot to speak
            diagnosis_original=diagnosis_original,  # Original English
            audio_base64=audio_base64,  # Optional audio file
            language=request.language,
            tags=detected_tags
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Copilot diagnosis error: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"Copilot diagnosis failed: {str(e)}"
        )


@router.get("/health")
async def copilot_health():
    """
    Health check endpoint for Copilot Studio monitoring.
    Copilot will periodically call this to verify bot connectivity.
    """
    return {
        "status": "healthy",
        "service": "AgriVoice Copilot Integration",
        "version": "1.0.0",
        "timestamp": None  # Will be filled by server
    }


@router.post("/validate-image")
async def copilot_validate_image(request: CopilotDiagnoseRequest):
    """
    Optional: Validate image before processing.
    Useful for bot to check if image is valid crop image.
    """
    try:
        image_bytes = base64.b64decode(request.image_base64)
        
        # Try to analyze
        tags = await vision.analyze_image(image_bytes)
        
        if tags:
            return {
                "status": "valid",
                "detected_tags": tags,
                "message": "Image is valid crop image"
            }
        else:
            return {
                "status": "unclear",
                "detected_tags": [],
                "message": "Could not identify crop in image"
            }
            
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Image validation failed: {str(e)}")
