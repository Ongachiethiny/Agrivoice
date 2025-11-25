"""
Diagnosis History Router
Handles storage and retrieval of user diagnosis history
"""

from fastapi import APIRouter, HTTPException, Depends, Header, File, UploadFile, Form
from pydantic import BaseModel
from typing import Optional, List
import json
from pathlib import Path
from datetime import datetime
import uuid

from ..services import vision, gpt4, speech
from ..services.fabric import log_diagnosis_event
from ..services.data_logger import log_diagnosis
from ..routers.auth import get_current_user

router = APIRouter(prefix="/api/history", tags=["history"])

# File-based history storage
HISTORY_DIR = Path("./data/history")
HISTORY_DIR.mkdir(parents=True, exist_ok=True)


class DiagnosisCreate(BaseModel):
    """Diagnosis input model"""
    query: str
    language: str = "en"


class DiagnosisRecord(BaseModel):
    """Diagnosis history record"""
    id: str
    user_id: str
    query: str
    language: str
    detected_tags: List[str]
    diagnosis_text: str
    translated_text: str
    audio_base64: Optional[str]
    timestamp: str
    image_filename: Optional[str]


def get_user_history_file(user_id: str) -> Path:
    """Get the history file path for a user"""
    return HISTORY_DIR / f"{user_id}.jsonl"


def save_diagnosis_to_history(user_id: str, diagnosis_record: dict):
    """Save a diagnosis to user's history"""
    history_file = get_user_history_file(user_id)
    
    with open(history_file, 'a') as f:
        f.write(json.dumps(diagnosis_record) + '\n')


def load_user_history(user_id: str, limit: int = 50) -> List[dict]:
    """Load user's diagnosis history"""
    history_file = get_user_history_file(user_id)
    
    if not history_file.exists():
        return []
    
    records = []
    with open(history_file, 'r') as f:
        for line in f:
            if line.strip():
                records.append(json.loads(line))
    
    # Return most recent records first
    return list(reversed(records))[-limit:]


@router.post("/save")
async def save_diagnosis(
    file: UploadFile = File(...),
    query: str = Form(...),
    language: str = Form(default="en"),
    current_user: dict = Depends(get_current_user)
):
    """
    Save a diagnosis to user's history
    
    Orchestrates: Image Upload -> Analysis -> Diagnosis -> Translation -> Audio -> Save to History
    """
    try:
        user_id = current_user["user_id"]
        diagnosis_id = str(uuid.uuid4())
        
        # Step 1: Read image file
        image_bytes = await file.read()
        if not image_bytes:
            raise HTTPException(status_code=400, detail="No image provided")
        
        # Save image file
        image_filename = f"{user_id}/{diagnosis_id}.jpg"
        image_path = Path("./data/images") / image_filename
        image_path.parent.mkdir(parents=True, exist_ok=True)
        with open(image_path, 'wb') as f:
            f.write(image_bytes)
        
        # Step 2: Analyze image
        detected_tags = await vision.analyze_image(image_bytes)
        
        # Step 3: Get diagnosis
        diagnosis_text = await gpt4.get_agronomist_advice(detected_tags, query, language)
        
        # Step 4: Translate if needed
        if language != "en":
            translated_text = await speech.translate_text(diagnosis_text, language)
        else:
            translated_text = diagnosis_text
        
        # Step 5: Generate audio
        audio_base64 = await speech.generate_audio(translated_text, language)
        
        # Step 6: Create diagnosis record
        diagnosis_record = {
            "id": diagnosis_id,
            "user_id": user_id,
            "query": query,
            "language": language,
            "detected_tags": detected_tags,
            "diagnosis_text": diagnosis_text,
            "translated_text": translated_text,
            "audio_base64": audio_base64,
            "timestamp": datetime.now().isoformat(),
            "image_filename": image_filename
        }
        
        # Step 7: Save to history
        save_diagnosis_to_history(user_id, diagnosis_record)
        
        # Step 8: Log for analytics
        log_data = {
            "user_id": user_id,
            "detected_tags": detected_tags,
            "query": query,
            "diagnosis": diagnosis_text,
            "language": language,
            "translated_text": translated_text
        }
        await log_diagnosis_event(log_data)
        await log_diagnosis(log_data)
        
        return {
            "status": "success",
            "data": {
                "id": diagnosis_id,
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
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error saving diagnosis: {str(e)}")
        return {
            "status": "error",
            "error": str(e)
        }


@router.get("/list")
async def list_history(
    limit: int = 50,
    current_user: dict = Depends(get_current_user)
) -> dict:
    """
    Get user's diagnosis history
    
    Query Parameters:
        - limit: Maximum number of records to return (default: 50)
    """
    try:
        user_id = current_user["user_id"]
        history = load_user_history(user_id, limit)
        
        return {
            "status": "success",
            "count": len(history),
            "data": history
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/detail/{diagnosis_id}")
async def get_diagnosis_detail(
    diagnosis_id: str,
    current_user: dict = Depends(get_current_user)
) -> dict:
    """
    Get detailed information about a specific diagnosis
    """
    try:
        user_id = current_user["user_id"]
        history = load_user_history(user_id, limit=1000)
        
        # Find the diagnosis
        diagnosis = None
        for record in history:
            if record.get("id") == diagnosis_id:
                diagnosis = record
                break
        
        if not diagnosis:
            raise HTTPException(status_code=404, detail="Diagnosis not found")
        
        return {
            "status": "success",
            "data": diagnosis
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/delete/{diagnosis_id}")
async def delete_diagnosis(
    diagnosis_id: str,
    current_user: dict = Depends(get_current_user)
) -> dict:
    """
    Delete a diagnosis from user's history
    """
    try:
        user_id = current_user["user_id"]
        history_file = get_user_history_file(user_id)
        
        if not history_file.exists():
            raise HTTPException(status_code=404, detail="No history found")
        
        # Load all records except the one to delete
        history = load_user_history(user_id, limit=1000)
        remaining = [r for r in history if r.get("id") != diagnosis_id]
        
        # Rewrite the history file
        with open(history_file, 'w') as f:
            for record in remaining:
                f.write(json.dumps(record) + '\n')
        
        return {
            "status": "success",
            "message": f"Diagnosis {diagnosis_id} deleted"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/stats")
async def get_history_stats(
    current_user: dict = Depends(get_current_user)
) -> dict:
    """
    Get statistics about user's diagnoses
    """
    try:
        user_id = current_user["user_id"]
        history = load_user_history(user_id, limit=1000)
        
        # Calculate stats
        total_diagnoses = len(history)
        languages_used = {}
        diseases_detected = {}
        
        for record in history:
            # Count languages
            lang = record.get("language", "en")
            languages_used[lang] = languages_used.get(lang, 0) + 1
            
            # Count diseases
            for tag in record.get("detected_tags", []):
                diseases_detected[tag] = diseases_detected.get(tag, 0) + 1
        
        return {
            "status": "success",
            "data": {
                "total_diagnoses": total_diagnoses,
                "languages_used": languages_used,
                "top_diseases": sorted(diseases_detected.items(), key=lambda x: x[1], reverse=True)[:10],
                "first_diagnosis": history[-1].get("timestamp") if history else None,
                "last_diagnosis": history[0].get("timestamp") if history else None
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
