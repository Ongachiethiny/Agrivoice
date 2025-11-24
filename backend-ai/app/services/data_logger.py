"""
Data Logger Service
Logs all diagnosis events to persistent storage for analytics and dashboards
"""

import json
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional
from collections import defaultdict

# Use a simple JSON file as database (can be replaced with real DB later)
DATA_DIR = Path(__file__).parent.parent.parent / "data"
DATA_DIR.mkdir(exist_ok=True)
LOGS_FILE = DATA_DIR / "diagnoses.jsonl"


async def log_diagnosis(data: Dict) -> None:
    """
    Log a diagnosis event to persistent storage
    
    Args:
        data: Diagnosis data including tags, crop, disease, severity, etc.
    """
    log_entry = {
        "timestamp": datetime.now().isoformat(),
        "detected_tags": data.get("detected_tags", []),
        "query": data.get("query", ""),
        "language": data.get("language", "en"),
        "region": data.get("region", "unknown"),
        "crop_type": data.get("crop_type", "unknown"),
        "severity": data.get("severity", "unknown"),
        "disease_detected": data.get("disease_detected", "unknown"),
    }
    
    try:
        # Append to JSONL file (one JSON object per line)
        with open(LOGS_FILE, "a", encoding="utf-8") as f:
            f.write(json.dumps(log_entry) + "\n")
        print(f"✅ Diagnosis logged: {log_entry['detected_tags']}")
    except Exception as e:
        print(f"❌ Error logging diagnosis: {str(e)}")


async def get_analytics_summary() -> Dict:
    """
    Get summary statistics from all logged diagnoses
    
    Returns:
        Dictionary with analytics data
    """
    if not LOGS_FILE.exists():
        return {
            "total_diagnoses": 0,
            "top_diseases": [],
            "languages_used": [],
            "regions": [],
            "avg_severity": "N/A",
            "total_yield_impact_range": "0-0%"
        }
    
    try:
        diagnoses = []
        with open(LOGS_FILE, "r", encoding="utf-8") as f:
            for line in f:
                if line.strip():
                    diagnoses.append(json.loads(line))
        
        # Calculate statistics
        disease_counts = defaultdict(int)
        language_counts = defaultdict(int)
        region_counts = defaultdict(int)
        severity_counts = defaultdict(int)
        
        for diagnosis in diagnoses:
            tags = diagnosis.get("detected_tags", [])
            if tags:
                disease_counts[tags[0]] += 1
            
            lang = diagnosis.get("language", "unknown")
            language_counts[lang] += 1
            
            region = diagnosis.get("region", "unknown")
            region_counts[region] += 1
            
            severity = diagnosis.get("severity", "unknown")
            severity_counts[severity] += 1
        
        top_diseases = sorted(disease_counts.items(), key=lambda x: x[1], reverse=True)[:5]
        
        return {
            "total_diagnoses": len(diagnoses),
            "top_diseases": [{"disease": d[0], "count": d[1]} for d in top_diseases],
            "languages_used": list(language_counts.keys()),
            "regions": list(region_counts.keys()),
            "severity_breakdown": dict(severity_counts),
            "avg_severity": max(severity_counts, key=severity_counts.get) if severity_counts else "N/A",
            "yield_impact_estimate": "15-40% average if untreated"
        }
    except Exception as e:
        print(f"❌ Error getting analytics: {str(e)}")
        return {"error": str(e)}


async def get_disease_statistics() -> List[Dict]:
    """
    Get breakdown by disease
    
    Returns:
        List of disease statistics
    """
    if not LOGS_FILE.exists():
        return []
    
    try:
        disease_data = defaultdict(lambda: {
            "count": 0,
            "regions": set(),
            "languages": set(),
            "severities": defaultdict(int)
        })
        
        with open(LOGS_FILE, "r", encoding="utf-8") as f:
            for line in f:
                if line.strip():
                    diagnosis = json.loads(line)
                    tags = diagnosis.get("detected_tags", [])
                    if tags:
                        disease = tags[0]
                        disease_data[disease]["count"] += 1
                        disease_data[disease]["regions"].add(diagnosis.get("region", "unknown"))
                        disease_data[disease]["languages"].add(diagnosis.get("language", "unknown"))
                        severity = diagnosis.get("severity", "unknown")
                        disease_data[disease]["severities"][severity] += 1
        
        return [
            {
                "disease": disease,
                "count": data["count"],
                "regions": list(data["regions"]),
                "languages": list(data["languages"]),
                "severity_breakdown": dict(data["severities"])
            }
            for disease, data in sorted(disease_data.items(), key=lambda x: x[1]["count"], reverse=True)
        ]
    except Exception as e:
        print(f"❌ Error getting disease stats: {str(e)}")
        return []


async def get_impact_metrics() -> Dict:
    """
    Get impact metrics for dashboard
    
    Returns:
        Impact data for visualization
    """
    if not LOGS_FILE.exists():
        return {
            "farmers_helped": 0,
            "crops_diagnosed": [],
            "hotspot_regions": [],
            "crisis_severity": "none"
        }
    
    try:
        diagnoses = []
        with open(LOGS_FILE, "r", encoding="utf-8") as f:
            for line in f:
                if line.strip():
                    diagnoses.append(json.loads(line))
        
        crops = set()
        regions = defaultdict(int)
        severe_count = 0
        
        for diagnosis in diagnoses:
            crop = diagnosis.get("crop_type", "unknown")
            if crop != "unknown":
                crops.add(crop)
            
            region = diagnosis.get("region", "unknown")
            regions[region] += 1
            
            severity = diagnosis.get("severity", "").lower()
            if severity == "severe":
                severe_count += 1
        
        # Determine crisis level
        total = len(diagnoses)
        severe_percentage = (severe_count / total * 100) if total > 0 else 0
        
        if severe_percentage > 50:
            crisis = "high"
        elif severe_percentage > 25:
            crisis = "moderate"
        else:
            crisis = "low"
        
        hotspots = sorted(regions.items(), key=lambda x: x[1], reverse=True)[:5]
        
        return {
            "farmers_helped": total,
            "unique_crops_diagnosed": list(crops),
            "crop_count": len(crops),
            "disease_hotspot_regions": [{"region": r[0], "diagnoses": r[1]} for r in hotspots],
            "overall_crisis_severity": crisis,
            "severe_cases_percentage": round(severe_percentage, 2),
            "estimated_yield_saved": f"${total * 50}-${total * 150}" if total > 0 else "$0"
        }
    except Exception as e:
        print(f"❌ Error getting impact metrics: {str(e)}")
        return {"error": str(e)}


async def get_all_data() -> List[Dict]:
    """
    Get all raw diagnosis data (for admin/debug)
    
    Returns:
        List of all diagnoses
    """
    if not LOGS_FILE.exists():
        return []
    
    try:
        diagnoses = []
        with open(LOGS_FILE, "r", encoding="utf-8") as f:
            for line in f:
                if line.strip():
                    diagnoses.append(json.loads(line))
        return diagnoses
    except Exception as e:
        print(f"❌ Error getting all data: {str(e)}")
        return []
