"""
Diagnosis Router
Handles crop diagnosis and treatment recommendation endpoints
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from ..services.gpt4 import GPT4Service
from ..services.fabric import FabricService

router = APIRouter(prefix="/api/v1", tags=["diagnosis"])
gpt4_service = GPT4Service()
fabric_service = FabricService()


class DiagnosisRequest(BaseModel):
    image_tags: List[str]
    user_question: str
    crop_type: Optional[str] = None
    region: Optional[str] = None
    farmer_id: Optional[str] = None


class DiagnosisResponse(BaseModel):
    disease_name: str
    severity: str
    confidence: float
    diagnosis: str
    organic_solutions: List[str]
    prevention: List[str]
    estimated_recovery_days: int
    recommended_practices: List[str]


class TreatmentPlanResponse(BaseModel):
    week_1: str
    week_2: str
    week_3: str
    week_4: str
    monitoring_tips: List[str]
    success_indicators: List[str]


@router.post("/diagnose", response_model=DiagnosisResponse)
async def diagnose(request: DiagnosisRequest):
    """
    Diagnose crop condition and provide organic treatment recommendations.
    
    - **image_tags**: Tags detected from image analysis
    - **user_question**: Farmer's question about their crop
    - **crop_type**: Type of crop (e.g., "maize", "wheat")
    - **region**: Geographic region
    - **farmer_id**: Unique farmer identifier
    
    Returns diagnosis with treatment recommendations.
    """
    try:
        # Get diagnosis from GPT-4
        diagnosis = await gpt4_service.diagnose_crop(
            request.image_tags,
            request.user_question
        )
        
        # Add metadata
        diagnosis["crop_type"] = request.crop_type
        diagnosis["region"] = request.region
        
        # Log to Fabric for analytics
        try:
            await fabric_service.log_diagnosis(diagnosis, request.farmer_id)
        except Exception as e:
            print(f"Warning: Failed to log to Fabric: {str(e)}")
        
        return diagnosis
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/treatment-plan", response_model=TreatmentPlanResponse)
async def get_treatment_plan(diagnosis: DiagnosisResponse):
    """
    Generate a detailed week-by-week treatment plan based on diagnosis.
    """
    try:
        treatment_plan = await gpt4_service.generate_treatment_plan(diagnosis.dict())
        return treatment_plan
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/health/diagnosis")
async def diagnosis_health():
    """Check diagnosis service health"""
    return {"service": "diagnosis", "status": "operational"}
