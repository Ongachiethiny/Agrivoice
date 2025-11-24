"""
Enhanced Crop Diagnosis Models with Severity Scoring and Crop Awareness
"""

from pydantic import BaseModel
from typing import Optional, List
from enum import Enum


# ============================================================================
# Enums for Structured Data
# ============================================================================

class CropType(str, Enum):
    """Supported crop types"""
    MAIZE = "maize"
    BEAN = "bean"
    TOMATO = "tomato"
    POTATO = "potato"
    RICE = "rice"
    WHEAT = "wheat"
    CASSAVA = "cassava"
    BANANA = "banana"
    MANGO = "mango"
    CABBAGE = "cabbage"


class SeverityLevel(str, Enum):
    """Disease severity levels"""
    MILD = "mild"
    MODERATE = "moderate"
    SEVERE = "severe"


class FarmerExperience(str, Enum):
    """Farmer experience level"""
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    EXPERIENCED = "experienced"


class Season(str, Enum):
    """Growing seasons"""
    DRY_SEASON = "dry_season"
    RAINY_SEASON = "rainy_season"
    PLANTING = "planting"


# ============================================================================
# Enhanced Request Models
# ============================================================================

class EnhancedDiagnoseRequest(BaseModel):
    """Enhanced diagnosis request with crop context"""
    image_base64: str
    question: str
    language: str = "en"
    
    # NEW FIELDS
    crop_type: Optional[CropType] = None
    severity_estimate: Optional[SeverityLevel] = None
    affected_area: Optional[str] = None  # e.g., "25%", "leaves_only"
    farmer_experience: Optional[FarmerExperience] = "intermediate"
    current_season: Optional[Season] = None
    field_size: Optional[str] = None  # e.g., "0.5 acres", "small"
    
    class Config:
        json_schema_extra = {
            "example": {
                "image_base64": "iVBORw0KGgo...",
                "question": "My maize leaves have brown spots",
                "crop_type": "maize",
                "severity_estimate": "moderate",
                "affected_area": "25%",
                "farmer_experience": "beginner",
                "current_season": "rainy_season",
                "language": "en"
            }
        }


class EnhancedDiagnoseResponse(BaseModel):
    """Enhanced response with structured diagnosis"""
    status: str
    
    # Core diagnosis
    diagnosis: str
    diagnosis_original: str
    
    # NEW FIELDS
    disease_name: Optional[str] = None
    severity: SeverityLevel
    affected_plant_parts: Optional[List[str]] = None
    confidence_score: Optional[float] = None  # 0-1
    
    # Structured actions
    immediate_actions: Optional[List[str]] = None
    ongoing_actions: Optional[List[str]] = None
    prevention_strategies: Optional[List[str]] = None
    
    # Timeline and impact
    timeline_to_recovery: Optional[str] = None
    yield_impact: Optional[str] = None
    replanting_needed: Optional[bool] = None
    
    # Audio and language
    audio_base64: Optional[str] = None
    language: str
    
    # Reference
    tags: List[str]
    
    class Config:
        json_schema_extra = {
            "example": {
                "status": "success",
                "disease_name": "Fungal Leaf Spot (Early Blight)",
                "severity": "moderate",
                "diagnosis": "Your maize shows signs of fungal leaf spot...",
                "diagnosis_original": "Your maize shows signs...",
                "immediate_actions": [
                    "Remove affected lower leaves",
                    "Spray neem oil every 7-10 days"
                ],
                "timeline_to_recovery": "2-3 weeks",
                "yield_impact": "10-20% if untreated",
                "tags": ["leaf", "brown spots", "fungal"]
            }
        }


# ============================================================================
# Crop-Specific Information
# ============================================================================

CROP_DISEASE_DATABASE = {
    CropType.MAIZE: {
        "common_diseases": [
            "Gray Leaf Spot",
            "Northern Corn Leaf Blight",
            "Southern Corn Leaf Blight",
            "Corn Rust",
            "Maize Lethal Necrosis",
            "Aflatoxin (Aspergillus)"
        ],
        "common_pests": [
            "Fall Armyworm",
            "Stem Borers",
            "Grasshoppers",
            "Cutworms"
        ],
        "critical_symptoms": ["wilting", "discolored leaves", "stunted growth"],
        "high_risk_seasons": ["rainy_season"],
        "crop_duration_days": 120,
    },
    
    CropType.BEAN: {
        "common_diseases": [
            "Bean Rust",
            "Angular Leaf Spot",
            "Bean Common Mosaic Virus",
            "Anthracnose"
        ],
        "common_pests": [
            "Bean Beetles",
            "Aphids",
            "Spider Mites",
            "Pod Borers"
        ],
        "critical_symptoms": ["yellow leaves", "wilting", "pod damage"],
        "high_risk_seasons": ["rainy_season"],
        "crop_duration_days": 90,
    },
    
    CropType.TOMATO: {
        "common_diseases": [
            "Early Blight",
            "Late Blight",
            "Septoria Leaf Spot",
            "Fusarium Wilt",
            "Tomato Yellow Leaf Curl Virus"
        ],
        "common_pests": [
            "Whiteflies",
            "Spider Mites",
            "Fruit Flies",
            "Leaf Miners"
        ],
        "critical_symptoms": ["yellowing", "wilting", "fruit spots", "vine disease"],
        "high_risk_seasons": ["rainy_season"],
        "crop_duration_days": 75,
    },
    
    CropType.POTATO: {
        "common_diseases": [
            "Late Blight",
            "Early Blight",
            "Bacterial Wilt",
            "Potato Virus Y"
        ],
        "common_pests": [
            "Potato Beetles",
            "Aphids",
            "Cutworms",
            "Mites"
        ],
        "critical_symptoms": ["leaf spots", "wilting", "stem rot", "tuber damage"],
        "high_risk_seasons": ["rainy_season"],
        "crop_duration_days": 90,
    },
}


SEVERITY_INDICATORS = {
    SeverityLevel.MILD: {
        "description": "Early stage, treatable",
        "affected_plant_percentage": "<25%",
        "action_urgency": "Monitor and treat within 1 week",
        "recovery_timeline": "1-2 weeks",
        "yield_impact": "<5%"
    },
    SeverityLevel.MODERATE: {
        "description": "Active disease, immediate treatment needed",
        "affected_plant_percentage": "25-75%",
        "action_urgency": "Treat within 2-3 days",
        "recovery_timeline": "2-3 weeks",
        "yield_impact": "10-30%"
    },
    SeverityLevel.SEVERE: {
        "description": "Advanced disease, urgent intervention required",
        "affected_plant_percentage": ">75%",
        "action_urgency": "Treat TODAY if possible",
        "recovery_timeline": "3-4 weeks or replanting needed",
        "yield_impact": ">30%"
    }
}


FARMER_EXPERIENCE_ADAPTATIONS = {
    FarmerExperience.BEGINNER: {
        "complexity": "very_simple",
        "action_count": 2,
        "focus": "Most effective single action",
        "tone": "Very encouraging and supportive"
    },
    FarmerExperience.INTERMEDIATE: {
        "complexity": "standard",
        "action_count": 3,
        "focus": "Balanced approach",
        "tone": "Professional but accessible"
    },
    FarmerExperience.EXPERIENCED: {
        "complexity": "detailed",
        "action_count": 5,
        "focus": "Comprehensive strategy",
        "tone": "Technical and detailed"
    }
}


SEASONAL_CONTEXT = {
    Season.RAINY_SEASON: {
        "main_risks": ["fungal diseases", "leaf diseases"],
        "humidity_level": "high",
        "drainage_important": True,
        "disease_pressure": "high"
    },
    Season.DRY_SEASON: {
        "main_risks": ["water stress", "mites", "dust"],
        "humidity_level": "low",
        "irrigation_important": True,
        "disease_pressure": "low"
    },
    Season.PLANTING: {
        "main_risks": ["seed rot", "damping off", "early pests"],
        "humidity_level": "variable",
        "seed_treatment_important": True,
        "disease_pressure": "medium"
    }
}


# ============================================================================
# Helper Functions
# ============================================================================

def get_crop_specific_guidance(crop_type: CropType) -> dict:
    """Get crop-specific disease information"""
    return CROP_DISEASE_DATABASE.get(crop_type, {})


def get_severity_info(severity: SeverityLevel) -> dict:
    """Get severity level details"""
    return SEVERITY_INDICATORS.get(severity, {})


def get_experience_level_guidance(experience: FarmerExperience) -> dict:
    """Get farmer experience level guidance"""
    return FARMER_EXPERIENCE_ADAPTATIONS.get(experience, {})


def get_seasonal_guidance(season: Season) -> dict:
    """Get seasonal context information"""
    return SEASONAL_CONTEXT.get(season, {})


# ============================================================================
# Enhanced System Prompt Generator
# ============================================================================

def generate_enhanced_system_prompt(
    crop_type: Optional[CropType] = None,
    farmer_experience: FarmerExperience = FarmerExperience.INTERMEDIATE,
    season: Optional[Season] = None
) -> str:
    """Generate context-aware system prompt"""
    
    base_prompt = """You are AgriVoice, an expert agronomist specializing in organic farming for African smallholder farmers.

YOUR ROLE:
- Diagnose crop diseases and pest problems from visual symptoms
- Provide ONLY affordable, organic/natural solutions accessible to small farmers
- Give actionable, immediate steps farmers can take TODAY
- Be encouraging and supportive - farmers are your partners, not clients"""
    
    # Add crop-specific context
    crop_context = ""
    if crop_type:
        crop_info = get_crop_specific_guidance(crop_type)
        if crop_info:
            crop_context = f"""

CROP-SPECIFIC FOCUS ({crop_type.value.upper()}):
Common Diseases: {', '.join(crop_info.get('common_diseases', [])[:3])}
Common Pests: {', '.join(crop_info.get('common_pests', [])[:3])}
Crop Duration: {crop_info.get('crop_duration_days')} days"""
    
    # Add experience-level adaptation
    exp_guidance = get_experience_level_guidance(farmer_experience)
    exp_context = f"""

FARMER EXPERIENCE LEVEL: {farmer_experience.value.upper()}
Complexity: {exp_guidance.get('complexity', 'standard')}
Tone: {exp_guidance.get('tone', 'Professional')}
Number of actions: Focus on {exp_guidance.get('action_count', 3)} most impactful steps"""
    
    # Add seasonal context
    seasonal_context = ""
    if season:
        season_info = get_seasonal_guidance(season)
        seasonal_context = f"""

SEASONAL CONTEXT: {season.value.upper()}
Main Risks: {', '.join(season_info.get('main_risks', []))}
Disease Pressure: {season_info.get('disease_pressure', 'medium')}"""
    
    return base_prompt + crop_context + exp_context + seasonal_context


if __name__ == "__main__":
    print("Enhanced Diagnosis Models and Crop Database")
    print("=" * 80)
    print("\nSupported Crops:", [c.value for c in CropType])
    print("\nSeverity Levels:", [s.value for s in SeverityLevel])
    print("\nExperience Levels:", [e.value for e in FarmerExperience])
    
    print("\n" + "=" * 80)
    print("Example: Enhanced System Prompt for Beginner Maize Farmer")
    print("=" * 80)
    prompt = generate_enhanced_system_prompt(
        crop_type=CropType.MAIZE,
        farmer_experience=FarmerExperience.BEGINNER,
        season=Season.RAINY_SEASON
    )
    print(prompt)
