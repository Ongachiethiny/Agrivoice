"""
Azure Speech Services and Translator Integration
Handles text translation and text-to-speech for farmers
"""

import requests
import base64
from typing import Tuple
from app.config import settings


async def translate_text(text: str, target_lang: str) -> str:
    """
    Translate text using Azure Translator.
    
    Args:
        text: Text to translate
        target_lang: Target language code (e.g., 'sw', 'ar', 'en')
    
    Returns:
        Translated text
    """
    if not settings.AZURE_TRANSLATOR_KEY or not settings.AZURE_TRANSLATOR_ENDPOINT:
        raise ValueError("Azure Translator credentials not configured")
    
    url = f"{settings.AZURE_TRANSLATOR_ENDPOINT}/translate"
    
    headers = {
        "Ocp-Apim-Subscription-Key": settings.AZURE_TRANSLATOR_KEY,
        "Ocp-Apim-Subscription-Region": settings.AZURE_TRANSLATOR_REGION,
        "Content-Type": "application/xml"
    }
    
    params = {
        "api-version": "3.0",
        "to": target_lang
    }
    
    body = f'<string xmlns="http://schemas.microsoft.com/2003/10/Serialization/">{text}</string>'
    
    try:
        response = requests.post(url, headers=headers, params=params, data=body)
        response.raise_for_status()
        
        # Parse XML response
        import xml.etree.ElementTree as ET
        root = ET.fromstring(response.text)
        
        # Extract translated text from XML
        namespace = {'': 'http://schemas.microsoft.com/2003/10/Serialization/'}
        translated_text = root.text
        
        return translated_text
        
    except requests.exceptions.RequestException as e:
        print(f"Error calling Azure Translator API: {str(e)}")
        raise Exception(f"Translation failed: {str(e)}")


async def generate_audio(text: str, language: str) -> str:
    """
    Generate speech audio using Azure Text-to-Speech.
    
    Args:
        text: Text to convert to speech
        language: Language code (e.g., 'en-US', 'sw', 'ar')
    
    Returns:
        Base64 encoded audio string
    """
    if not settings.AZURE_SPEECH_KEY or not settings.AZURE_SPEECH_REGION:
        raise ValueError("Azure Speech credentials not configured")
    
    url = f"https://{settings.AZURE_SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1"
    
    headers = {
        "Ocp-Apim-Subscription-Key": settings.AZURE_SPEECH_KEY,
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": "audio-16khz-32kbitrate-mono-mp3"
    }
    
    # Map language codes to voice names
    voice_map = {
        "en": "en-US-AvaNeural",
        "sw": "sw-KE-ZuriNeural",  # Swahili Kenya
        "ar": "ar-SA-FatimahNeural",  # Arabic Saudi Arabia
        "fr": "fr-FR-DeniseNeural",  # French
        "es": "es-ES-AlvaroNeural",  # Spanish
        "pt": "pt-BR-FranciscaNeural",  # Portuguese Brazil
    }
    
    voice = voice_map.get(language, "en-US-AvaNeural")
    
    ssml = f"""<speak version='1.0' xml:lang='{language}'>
        <voice name='{voice}'>
            {text}
        </voice>
    </speak>"""
    
    try:
        response = requests.post(url, headers=headers, data=ssml.encode('utf-8'))
        response.raise_for_status()
        
        # Encode audio to base64
        audio_base64 = base64.b64encode(response.content).decode('utf-8')
        
        return audio_base64
        
    except requests.exceptions.RequestException as e:
        print(f"Error calling Azure Speech API: {str(e)}")
        raise Exception(f"Audio generation failed: {str(e)}")


async def speech_to_text(audio_bytes: bytes, language: str = "en") -> str:
    """
    Convert speech audio to text using Azure Speech-to-Text.
    
    Args:
        audio_bytes: Raw audio file bytes (WAV, MP3, OGG)
        language: Language code (e.g., 'en-US', 'sw', 'ar')
    
    Returns:
        Transcribed text
    """
    if not settings.AZURE_SPEECH_KEY or not settings.AZURE_SPEECH_REGION:
        raise ValueError("Azure Speech credentials not configured")
    
    url = f"https://{settings.AZURE_SPEECH_REGION}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1"
    
    headers = {
        "Ocp-Apim-Subscription-Key": settings.AZURE_SPEECH_KEY,
        "Content-Type": "audio/wav"  # Can be audio/mp3, audio/ogg, etc.
    }
    
    params = {
        "language": language,
        "format": "json"
    }
    
    try:
        response = requests.post(url, headers=headers, params=params, data=audio_bytes)
        response.raise_for_status()
        
        data = response.json()
        
        if data.get("RecognitionStatus") == "Success":
            return data.get("DisplayText", "")
        else:
            error_msg = data.get("DisplayText", "Speech recognition failed")
            raise Exception(f"Speech recognition error: {error_msg}")
            
    except requests.exceptions.RequestException as e:
        print(f"Error calling Azure Speech-to-Text API: {str(e)}")
        raise Exception(f"Speech-to-text failed: {str(e)}")
