"""
Azure Computer Vision Service
Handles image analysis and crop disease detection
"""
import os
from typing import List
import requests
from azure.cognitiveservices.vision.computervision import ComputerVisionClient
from azure.identity import DefaultAzureCredential


class VisionService:
    def __init__(self):
        self.endpoint = os.getenv("AZURE_VISION_ENDPOINT")
        self.key = os.getenv("AZURE_VISION_KEY")
        self.client = ComputerVisionClient(
            endpoint=self.endpoint,
            credentials=DefaultAzureCredential()
        )
    
    async def analyze_image(self, image_path: str) -> dict:
        """
        Analyze crop image using Azure Computer Vision.
        Returns tags and features detected in the image.
        """
        try:
            with open(image_path, "rb") as image_file:
                results = self.client.analyze_image_in_stream(
                    image=image_file,
                    visual_features=["Tags", "Objects", "Description"]
                )
            
            return {
                "tags": [tag.name for tag in results.tags],
                "objects": [obj.object_name for obj in results.objects],
                "description": results.description.captions[0].text if results.description.captions else "",
                "confidence": results.tags[0].confidence if results.tags else 0
            }
        except Exception as e:
            raise Exception(f"Vision API Error: {str(e)}")
    
    async def analyze_image_url(self, image_url: str) -> dict:
        """
        Analyze crop image from URL using Azure Computer Vision.
        """
        try:
            results = self.client.analyze_image(
                url=image_url,
                visual_features=["Tags", "Objects", "Description"]
            )
            
            return {
                "tags": [tag.name for tag in results.tags],
                "objects": [obj.object_name for obj in results.objects],
                "description": results.description.captions[0].text if results.description.captions else "",
                "confidence": results.tags[0].confidence if results.tags else 0
            }
        except Exception as e:
            raise Exception(f"Vision API Error: {str(e)}")
