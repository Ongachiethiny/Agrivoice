"""
Analytics Router
Endpoints for Fabric dashboard and impact reporting
"""

from fastapi import APIRouter, HTTPException
from app.services.data_logger import (
    get_analytics_summary,
    get_disease_statistics,
    get_impact_metrics,
    get_all_data
)

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


@router.get("/summary")
async def get_summary():
    """
    Get overall analytics summary
    
    Returns:
        - total_diagnoses: Number of diagnoses performed
        - top_diseases: Most common detected diseases
        - languages_used: Languages supported by users
        - regions: Regions where diagnoses occurred
        - avg_severity: Most common severity level
    """
    try:
        data = await get_analytics_summary()
        return {
            "status": "success",
            "data": data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/diseases")
async def get_diseases():
    """
    Get disease-specific statistics
    
    Returns:
        List of diseases with:
        - count: Number of diagnoses
        - regions: Affected regions
        - languages: Languages used
        - severity_breakdown: Severity distribution
    """
    try:
        data = await get_disease_statistics()
        return {
            "status": "success",
            "disease_count": len(data),
            "data": data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/impact")
async def get_impact():
    """
    Get impact metrics for dashboard visualization
    
    Returns:
        - farmers_helped: Total farmers served
        - unique_crops_diagnosed: Crop types identified
        - disease_hotspot_regions: Geographic hotspots
        - overall_crisis_severity: Crisis level (low/moderate/high)
        - severe_cases_percentage: Percentage of severe diagnoses
        - estimated_yield_saved: Economic impact estimate
    """
    try:
        data = await get_impact_metrics()
        return {
            "status": "success",
            "data": data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/raw")
async def get_raw_data():
    """
    Get all raw diagnosis data (admin only in production)
    
    Returns:
        List of all logged diagnosis events
    """
    try:
        data = await get_all_data()
        return {
            "status": "success",
            "count": len(data),
            "data": data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
