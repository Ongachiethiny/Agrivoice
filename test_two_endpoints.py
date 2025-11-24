#!/usr/bin/env python
"""Quick test for Vision and OpenAI endpoints"""

import os
import sys
import requests
from pathlib import Path
from dotenv import load_dotenv
import json

load_dotenv(Path(__file__).parent / "backend-ai" / ".env")

def test_vision():
    print("\n" + "="*70)
    print("TESTING AZURE COMPUTER VISION")
    print("="*70 + "\n")
    
    endpoint = os.getenv("AZURE_VISION_ENDPOINT")
    key = os.getenv("AZURE_VISION_KEY")
    region = os.getenv("AZURE_VISION_REGION")
    
    print(f"Endpoint: {endpoint}")
    print(f"Region: {region}\n")
    
    url = f"{endpoint}analyze"
    headers = {"Ocp-Apim-Subscription-Key": key, "Content-Type": "application/json"}
    params = {"features": "tags", "model-version": "latest"}
    data = {"url": "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-sample-data-files/master/ComputerVision/Images/landmark.jpg"}
    
    print(f"URL: {url}\n")
    
    try:
        response = requests.post(url, headers=headers, params=params, json=data, timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text[:300]}\n")
        
        if response.status_code == 200:
            print("✅ VISION API WORKING!\n")
            return True
        else:
            print("❌ VISION API FAILED\n")
            return False
    except Exception as e:
        print(f"❌ Exception: {e}\n")
        return False

def test_openai():
    print("="*70)
    print("TESTING AZURE OPENAI")
    print("="*70 + "\n")
    
    endpoint = os.getenv("AZURE_OPENAI_ENDPOINT").rstrip("/")
    key = os.getenv("AZURE_OPENAI_KEY")
    deployment = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME")
    
    print(f"Endpoint: {endpoint}")
    print(f"Deployment: {deployment}\n")
    
    url = f"{endpoint}/openai/deployments/{deployment}/chat/completions"
    headers = {"api-key": key, "Content-Type": "application/json"}
    params = {"api-version": "2024-02-15-preview"}
    data = {
        "messages": [{"role": "user", "content": "Hello"}],
        "temperature": 0.7,
        "max_tokens": 50
    }
    
    print(f"URL: {url}\n")
    
    try:
        response = requests.post(url, headers=headers, params=params, json=data, timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text[:300]}\n")
        
        if response.status_code == 200:
            print("✅ OPENAI API WORKING!\n")
            return True
        else:
            print("❌ OPENAI API FAILED\n")
            return False
    except Exception as e:
        print(f"❌ Exception: {e}\n")
        return False

if __name__ == "__main__":
    vision_ok = test_vision()
    openai_ok = test_openai()
    
    print("="*70)
    print("RESULTS SUMMARY")
    print("="*70)
    print(f"Vision API:  {'✅ PASS' if vision_ok else '❌ FAIL'}")
    print(f"OpenAI API:  {'✅ PASS' if openai_ok else '❌ FAIL'}")
    print("="*70 + "\n")
