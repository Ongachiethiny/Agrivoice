"""
Azure OpenAI GPT-4 Service
Handles crop diagnosis and organic solution recommendations
"""

import requests
from typing import List
from app.config import settings


async def get_agronomist_advice(tags: List[str], user_query: str, language: str) -> str:
    """
    Get agronomist advice using Azure OpenAI GPT-4.
    
    Args:
        tags: List of detected image tags
        user_query: User's question about the crop
        language: Target language code (e.g., 'en', 'sw', 'ar')
    
    Returns:
        Advice text in the specified language (under 100 words)
    """
    if not settings.AZURE_OPENAI_KEY or not settings.AZURE_OPENAI_ENDPOINT:
        raise ValueError("Azure OpenAI credentials not configured")
    
    url = f"{settings.AZURE_OPENAI_ENDPOINT}/openai/deployments/{settings.AZURE_OPENAI_DEPLOYMENT}/chat/completions"
    
    headers = {
        "api-key": settings.AZURE_OPENAI_KEY,
        "Content-Type": "application/json"
    }
    
    params = {
        "api-version": settings.AZURE_OPENAI_API_VERSION
    }
    
    system_prompt = """You are AgriVoice, an expert agronomist specializing in organic farming for African smallholder farmers.

YOUR ROLE:
- Diagnose crop diseases and pest problems from visual symptoms
- Provide ONLY affordable, organic/natural solutions accessible to small farmers
- Give actionable, immediate steps farmers can take TODAY
- Be encouraging and supportive - farmers are your partners, not clients

DIAGNOSIS APPROACH:
1. Identify the likely disease/pest from visual clues (tags)
2. Assess severity (mild/moderate/severe)
3. Provide 2-3 immediate actions
4. Suggest prevention for next season

REMEDIES (Approved organic solutions):
- Neem oil spray (pest control)
- Ash/lime dusting (fungal diseases)
- Compost/manure (soil health)
- Companion planting (pest prevention)
- Hand-picking (for larger pests)
- Water management (prevent fungal issues)
- Plant spacing (improve airflow)
- Crop rotation (disease prevention)

TONE:
- Friendly and encouraging
- Use simple, direct language
- Show understanding of farmer constraints (budget, access)
- Suggest low-cost alternatives

CONSTRAINTS:
- NEVER recommend synthetic chemicals or expensive treatments
- Keep response under 100 words
- Be specific about quantities and timing
- Include timeline for expected improvement"""
    
    user_message = f"""VISUAL SYMPTOMS DETECTED: {', '.join(tags)}

FARMER'S CONCERN: {user_query}

Based on these visual indicators, provide a diagnosis with specific organic remedies the farmer can apply immediately. Be practical and encouraging."""
    
    payload = {
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ],
        "temperature": 0.7,
        "max_tokens": 150
    }
    
    try:
        response = requests.post(url, headers=headers, params=params, json=payload)
        response.raise_for_status()
        
        data = response.json()
        advice = data["choices"][0]["message"]["content"]
        
        return advice
        
    except requests.exceptions.RequestException as e:
        print(f"Error calling Azure OpenAI API: {str(e)}")
        raise Exception(f"Diagnosis failed: {str(e)}")
