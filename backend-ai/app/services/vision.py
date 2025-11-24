"""
Azure Computer Vision Service Integration
Analyzes crop images to extract tags and descriptions
"""

import requests
from typing import List
from app.config import settings


async def analyze_image(image_bytes: bytes) -> List[str]:
    """
    Analyze an image using Azure Computer Vision.
    
    Args:
        image_bytes: Raw image bytes to analyze
    
    Returns:
        List of detected tags/features from the image
    """
    if not settings.AZURE_VISION_KEY or not settings.AZURE_VISION_ENDPOINT:
        raise ValueError("Azure Vision credentials not configured")
    
    # Azure Computer Vision API v3.2
    url = f"{settings.AZURE_VISION_ENDPOINT}analyze"
    
    headers = {
        "Ocp-Apim-Subscription-Key": settings.AZURE_VISION_KEY,
        "Content-Type": "application/octet-stream"
    }
    
    params = {
        "features": "tags,description",
        "model-version": "latest"
    }
    
    try:
        response = requests.post(url, headers=headers, params=params, data=image_bytes)
        response.raise_for_status()
        
        data = response.json()
        
        # Extract tags from response
        tags = []
        
        # Get tags
        if "tags" in data:
            tags.extend([tag["name"] for tag in data["tags"]])
        
        # Get description
        if "description" in data and "captions" in data["description"]:
            for caption in data["description"]["captions"]:
                # Add caption text as a tag
                words = caption["text"].lower().split()
                tags.extend([w for w in words if len(w) > 2])
        
        return list(set(tags))  # Remove duplicates
        
    except requests.exceptions.RequestException as e:
        print(f"Error calling Azure Vision API: {str(e)}")
        raise Exception(f"Vision analysis failed: {str(e)}")
