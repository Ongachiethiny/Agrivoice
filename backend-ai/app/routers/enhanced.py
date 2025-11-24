"""
Enhanced Copilot Router with Crop Awareness and Severity Scoring
"""

from fastapi import APIRouter, HTTPException
from typing import Optional
import base64

from app.models import (
    EnhancedDiagnoseRequest, 
    EnhancedDiagnoseResponse,
    CropType,
    SeverityLevel,
    FarmerExperience,
    Season,
    get_crop_specific_guidance,
    get_severity_info,
    generate_enhanced_system_prompt
)
from app.services import vision, gpt4, speech
from app.services.fabric import log_diagnosis_event

router = APIRouter(prefix="/api/v2", tags=["enhanced"])


@router.post("/diagnose-enhanced", response_model=EnhancedDiagnoseResponse)
async def enhanced_diagnose(request: EnhancedDiagnoseRequest):
    """
    Enhanced diagnosis endpoint with crop awareness and severity scoring.
    
    This endpoint includes:
    - Crop type awareness for specialized recommendations
    - Severity scoring to prioritize actions
    - Farmer experience level adaptation
    - Seasonal context awareness
    - Structured response with timeline and impact assessment
    
    Args:
        request: Contains image, question, crop type, severity, experience level, etc.
    
    Returns:
        Enhanced response with structured diagnosis and actions
    """
    try:
        # Step 1: Decode base64 image
        try:
            image_bytes = base64.b64decode(request.image_base64)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid base64 image: {str(e)}")
        
        # Step 2: Analyze image to get tags
        detected_tags = await vision.analyze_image(image_bytes)
        
        # Step 3: Determine severity if not provided
        severity = request.severity_estimate or SeverityLevel.MODERATE
        severity_info = get_severity_info(severity)
        
        # Get farmer experience, ensuring it's an enum
        farmer_exp = request.farmer_experience
        if isinstance(farmer_exp, str):
            farmer_exp = FarmerExperience(farmer_exp)
        elif farmer_exp is None:
            farmer_exp = FarmerExperience.INTERMEDIATE
        
        # Step 4: Get crop-specific guidance
        crop_guidance = {}
        if request.crop_type:
            crop_guidance = get_crop_specific_guidance(request.crop_type)
        
        # Step 5: Generate context-aware system prompt
        system_prompt = generate_enhanced_system_prompt(
            crop_type=request.crop_type,
            farmer_experience=farmer_exp,
            season=request.current_season
        )
        
        # Step 6: Add structured context to user message
        user_context = f"""
IMAGE ANALYSIS: {', '.join(detected_tags)}
CROP: {request.crop_type.value if request.crop_type else 'Unknown'}
SEVERITY: {severity.value}
AFFECTED AREA: {request.affected_area or 'Unknown'}
FARMER QUESTION: {request.question}

Please provide a diagnosis following this structure:
1. DISEASE/PEST NAME
2. SEVERITY ASSESSMENT
3. IMMEDIATE ACTIONS (1-3 steps for TODAY)
4. ONGOING MANAGEMENT (for next 2-4 weeks)
5. TIMELINE (when to expect improvement)
6. PREVENTION (for next season)
"""
        
        # Step 7: Get enhanced diagnosis from GPT-4
        diagnosis_text = await gpt4.get_agronomist_advice(
            detected_tags,
            user_context,
            request.language
        )
        
        # Step 8: Extract structured information from response
        # (In production, you'd parse the response to extract fields)
        disease_name = extract_field_from_response(diagnosis_text, "DISEASE")
        immediate_actions = extract_actions_from_response(diagnosis_text, "IMMEDIATE")
        ongoing_actions = extract_actions_from_response(diagnosis_text, "ONGOING")
        prevention = extract_actions_from_response(diagnosis_text, "PREVENTION")
        
        # Step 9: Translate diagnosis if needed
        diagnosis_translated = diagnosis_text
        if request.language != "en":
            diagnosis_translated = await speech.translate_text(diagnosis_text, request.language)
        
        # Step 10: Generate audio
        audio_base64 = None
        try:
            audio_base64 = await speech.generate_audio(diagnosis_translated, request.language)
        except Exception as e:
            print(f"Audio generation failed (non-blocking): {str(e)}")
        
        # Step 11: Log to Fabric
        await log_diagnosis_event({
            "crop_type": request.crop_type.value if request.crop_type else "unknown",
            "severity": severity.value,
            "detected_tags": detected_tags,
            "disease_name": disease_name,
            "diagnosis": diagnosis_text,
            "farmer_experience": farmer_exp.value
        })
        
        # Step 12: Prepare response
        return EnhancedDiagnoseResponse(
            status="success",
            diagnosis=diagnosis_translated,
            diagnosis_original=diagnosis_text,
            disease_name=disease_name,
            severity=severity,
            affected_plant_parts=extract_plant_parts(diagnosis_text),
            confidence_score=0.85,  # Placeholder - could be calculated
            immediate_actions=immediate_actions,
            ongoing_actions=ongoing_actions,
            prevention_strategies=prevention,
            timeline_to_recovery=extract_timeline(diagnosis_text),
            yield_impact=severity_info.get("yield_impact"),
            replanting_needed=severity == SeverityLevel.SEVERE,
            audio_base64=audio_base64,
            language=request.language,
            tags=detected_tags
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Diagnosis failed: {str(e)}")


# ============================================================================
# Helper Functions for Response Parsing
# ============================================================================

def extract_field_from_response(response: str, field_name: str) -> Optional[str]:
    """Extract a specific field from the diagnosis response"""
    lines = response.split('\n')
    for line in lines:
        if field_name.upper() in line.upper():
            # Return content after the field name
            parts = line.split(':', 1)
            if len(parts) > 1:
                return parts[1].strip()
    return None


def extract_actions_from_response(response: str, action_type: str) -> Optional[list]:
    """Extract action items from the diagnosis response"""
    lines = response.split('\n')
    actions = []
    in_section = False
    
    for line in lines:
        if action_type.upper() in line.upper():
            in_section = True
            continue
        
        if in_section:
            # Check if we've entered a new section
            if line.startswith('#') or line.strip() == '':
                break
            
            # Extract numbered items
            line_stripped = line.strip()
            if line_stripped and (line_stripped[0].isdigit() or line_stripped.startswith('-')):
                # Clean up the action text
                action = line_stripped.lstrip('0123456789.-) ').strip()
                if action:
                    actions.append(action)
    
    return actions if actions else None


def extract_plant_parts(response: str) -> Optional[list]:
    """Extract affected plant parts from the response"""
    parts = []
    keywords = ['leaf', 'leaves', 'stem', 'root', 'fruit', 'flower', 'seed', 'pod']
    
    response_lower = response.lower()
    for keyword in keywords:
        if keyword in response_lower:
            parts.append(keyword)
    
    return list(set(parts)) if parts else None


def extract_timeline(response: str) -> Optional[str]:
    """Extract recovery timeline from the response"""
    lines = response.split('\n')
    for line in lines:
        if 'week' in line.lower() or 'day' in line.lower():
            if 'timeline' in line.lower() or 'improvement' in line.lower():
                parts = line.split(':', 1)
                if len(parts) > 1:
                    return parts[1].strip()
    return "2-3 weeks"  # Default fallback


@router.get("/crops")
async def list_supported_crops():
    """List all supported crop types"""
    return {
        "crops": [c.value for c in CropType],
        "count": len(CropType)
    }


@router.get("/severity-levels")
async def list_severity_levels():
    """List severity levels with descriptions"""
    return {
        "levels": {
            level.value: info.get("description")
            for level, info in {
                SeverityLevel.MILD: {"description": "Early stage, treatable"},
                SeverityLevel.MODERATE: {"description": "Active disease, treatment needed"},
                SeverityLevel.SEVERE: {"description": "Advanced disease, urgent action"}
            }.items()
        }
    }


@router.get("/experience-levels")
async def list_experience_levels():
    """List farmer experience levels"""
    return {
        "levels": [e.value for e in FarmerExperience]
    }
