"""
Microsoft Fabric Integration Service
Logs diagnosis events to Microsoft Fabric OneLake for analytics dashboard
"""

import json
from datetime import datetime
from typing import Dict
import requests
from app.config import settings


async def log_diagnosis_event(data: Dict) -> None:
    """
    Log a diagnosis event to Microsoft Fabric.
    
    MVP: Logs to console (JSON format)
    Production: Send to Fabric OneLake table
    
    Args:
        data: Dictionary containing diagnosis event details
    """
    
    # Create structured log entry
    log_entry = {
        "timestamp": datetime.now().isoformat(),
        "event_type": "diagnosis",
        "data": data
    }
    
    # PHASE 1 (MVP): Print to console for hackathon demo
    print("\n" + "="*80)
    print("📊 DIAGNOSIS EVENT - FABRIC LOG")
    print("="*80)
    print(json.dumps(log_entry, indent=2))
    print("="*80 + "\n")
    
    # PHASE 2 (Production): Send to actual Fabric workspace
    # Uncomment and configure after getting Fabric credentials
    try:
        await _ingest_to_fabric_onelake(log_entry)
    except Exception as e:
        print(f"Note: Fabric ingestion not configured. Using console logging. Error: {str(e)}")


async def _ingest_to_fabric_onelake(log_entry: Dict) -> None:
    """
    Internal function to ingest data to Microsoft Fabric OneLake.
    
    Configuration needed:
    1. FABRIC_WORKSPACE_ID - From Azure Portal
    2. FABRIC_LAKEHOUSE_ID - From Fabric workspace
    3. FABRIC_TABLE_NAME - Table in lakehouse
    4. Azure authentication (Managed Identity or Service Principal)
    
    This is scaffolding for future implementation.
    """
    
    # Check if Fabric is configured
    if not all([
        getattr(settings, 'FABRIC_WORKSPACE_ID', None),
        getattr(settings, 'FABRIC_LAKEHOUSE_ID', None)
    ]):
        # Not configured - skip production ingestion
        return
    
    try:
        # Example: Fabric REST API endpoint
        # URL format: https://api.fabric.microsoft.com/v1/workspaces/{workspace_id}/lakehouses/{lakehouse_id}/tables/{table_name}/rows
        
        workspace_id = getattr(settings, 'FABRIC_WORKSPACE_ID')
        lakehouse_id = getattr(settings, 'FABRIC_LAKEHOUSE_ID')
        table_name = getattr(settings, 'FABRIC_TABLE_NAME', 'diagnoses')
        
        # This would be called after authentication is set up
        # For now, this is a placeholder
        print(f"[FABRIC] Would ingest to {workspace_id}/{lakehouse_id}/{table_name}")
        
    except Exception as e:
        print(f"Fabric ingestion error: {str(e)}")


async def get_impact_stats() -> Dict:
    """
    Retrieve impact statistics from Fabric for dashboard.
    
    Returns:
        Dictionary with aggregated statistics
    """
    
    # MVP: Return mock data
    stats = {
        "total_diagnoses": 0,
        "by_disease": {},
        "by_region": {},
        "success_rate": 0,
        "note": "Data will populate from Fabric after real ingestion is configured"
    }
    
    # TODO: Query actual Fabric data once configured
    # Example query:
    # SELECT COUNT(*), disease_name, region FROM diagnoses 
    # WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
    # GROUP BY disease_name, region
    
    return stats


def _create_fabric_schema() -> Dict:
    """
    Define the schema for diagnoses table in Fabric.
    
    Use this to create the table in your Fabric lakehouse:
    """
    schema = {
        "table_name": "diagnoses",
        "columns": [
            {"name": "id", "type": "string", "nullable": False},
            {"name": "timestamp", "type": "datetime", "nullable": False},
            {"name": "user_id", "type": "string", "nullable": True},
            {"name": "crop_type", "type": "string", "nullable": True},
            {"name": "region", "type": "string", "nullable": True},
            {"name": "detected_tags", "type": "string", "nullable": True},  # JSON array as string
            {"name": "diagnosis_text", "type": "string", "nullable": False},
            {"name": "language", "type": "string", "nullable": False},
            {"name": "source", "type": "string", "nullable": False},  # 'web', 'copilot', etc.
            {"name": "outcome", "type": "string", "nullable": True},  # Future: user feedback
        ]
    }
    return schema

