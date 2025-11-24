"""
Image Analysis Router
Handles image upload and analysis endpoints
"""
from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import List
import os
import tempfile
from ..services.vision import VisionService

router = APIRouter(prefix="/api/v1", tags=["image_analysis"])
vision_service = VisionService()


class ImageAnalysisResponse(BaseModel):
    tags: List[str]
    objects: List[str]
    description: str
    confidence: float


@router.post("/analyze-image", response_model=ImageAnalysisResponse)
async def analyze_image(file: UploadFile = File(...)):
    """
    Upload and analyze a crop image using Azure Computer Vision.
    
    Returns detected tags, objects, and image description.
    """
    try:
        # Save uploaded file to temporary location
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
            content = await file.read()
            tmp.write(content)
            tmp_path = tmp.name
        
        # Analyze image
        result = await vision_service.analyze_image(tmp_path)
        
        # Clean up
        os.unlink(tmp_path)
        
        return result
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/analyze-image-url", response_model=ImageAnalysisResponse)
async def analyze_image_url(image_url: str):
    """
    Analyze a crop image from URL using Azure Computer Vision.
    """
    try:
        result = await vision_service.analyze_image_url(image_url)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
