"""
Diagnosis Router
Main endpoint orchestrating: Image Analysis -> Diagnosis -> Translation -> Audio
"""

from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
import io

from ..services import vision, gpt4, speech
from ..services.fabric import log_diagnosis_event

router = APIRouter(prefix="/api", tags=["diagnosis"])


@router.post("/diagnose")
async def diagnose(
    file: UploadFile = File(...),
    query: str = Form(...),
    language: str = Form(default="en")
):
    """
    Complete diagnosis pipeline: analyze image -> diagnose -> translate -> generate audio
    
    Request:
        - file: Crop image (JPG/PNG)
        - query: Farmer's question
        - language: Target language code (en, sw, ar, fr, es, pt)
    
    Response:
        {
            "status": "success",
            "data": {
                "detected_tags": ["tag1", "tag2"],
                "diagnosis": {
                    "original_text": "English advice...",
                    "translated_text": "Swahili advice...",
                    "language": "sw"
                },
                "audio": {
                    "base64": "..."
                }
            }
        }
    """
    try:
        # Step 1: Read image file
        image_bytes = await file.read()
        if not image_bytes:
            raise HTTPException(status_code=400, detail="No image provided")
        
        # Step 2: Analyze image with Azure Vision
        detected_tags = await vision.analyze_image(image_bytes)
        
        # Step 3: Get diagnosis from GPT-4
        diagnosis_text = await gpt4.get_agronomist_advice(detected_tags, query, language)
        
        # Step 4: Translate if needed
        if language != "en":
            translated_text = await speech.translate_text(diagnosis_text, language)
        else:
            translated_text = diagnosis_text
        
        # Step 5: Generate audio
        audio_base64 = await speech.generate_audio(translated_text, language)
        
        # Step 6: Log event for analytics
        log_data = {
            "detected_tags": detected_tags,
            "query": query,
            "diagnosis": diagnosis_text,
            "language": language,
            "translated_text": translated_text
        }
        await log_diagnosis_event(log_data)
        
        # Return response with exact contract
        return {
            "status": "success",
            "data": {
                "detected_tags": detected_tags,
                "diagnosis": {
                    "original_text": diagnosis_text,
                    "translated_text": translated_text,
                    "language": language
                },
                "audio": {
                    "base64": audio_base64
                }
            }
        }
        
    except Exception as e:
        return {
            "status": "error",
            "error": str(e)
        }


@router.get("/health/diagnosis")
async def diagnosis_health():
    """Check diagnosis service health"""
    return {"service": "diagnosis", "status": "operational"}

