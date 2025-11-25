"""Pytest configuration and fixtures for AgriVoice backend tests."""
import os
import json
import tempfile
from pathlib import Path
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock

# Set test environment variables
os.environ['VITE_JWT_SECRET'] = 'test-secret-key-12345'
os.environ['VITE_JWT_ALGORITHM'] = 'HS256'
os.environ['VITE_ACCESS_TOKEN_EXPIRY'] = '1440'
os.environ['VITE_REFRESH_TOKEN_EXPIRY'] = '10080'

from app.main import app
from app.config import settings


@pytest.fixture
def client():
    """Fixture that provides a TestClient for the FastAPI app."""
    return TestClient(app)


@pytest.fixture
def temp_data_dir(tmp_path):
    """Fixture that creates a temporary data directory for tests."""
    data_dir = tmp_path / "data"
    data_dir.mkdir()
    (data_dir / "users.json").write_text(json.dumps({}))
    (data_dir / "history").mkdir()
    (data_dir / "images").mkdir()
    
    return data_dir


@pytest.fixture
def mock_azure_services():
    """Fixture that mocks Azure cognitive services."""
    with patch('app.services.vision.ComputerVisionClient') as mock_vision, \
         patch('app.services.speech.SpeechService') as mock_speech, \
         patch('app.services.gpt4.OpenAI') as mock_openai:
        
        # Mock Vision service response
        mock_vision_instance = MagicMock()
        mock_vision.return_value = mock_vision_instance
        mock_vision_instance.analyze_image_by_url.return_value = MagicMock(
            tags=[MagicMock(name='disease', confidence=0.95)],
            description=MagicMock(captions=[MagicMock(text='A diseased leaf')])
        )
        
        # Mock Speech service
        mock_speech_instance = MagicMock()
        mock_speech.return_value = mock_speech_instance
        mock_speech_instance.synthesize_speech.return_value = b'mock_audio_data'
        
        # Mock GPT-4 service
        mock_openai_instance = MagicMock()
        mock_openai.return_value = mock_openai_instance
        mock_openai_instance.chat.completions.create.return_value = MagicMock(
            choices=[MagicMock(message=MagicMock(content='This crop needs treatment.'))]
        )
        
        yield {
            'vision': mock_vision_instance,
            'speech': mock_speech_instance,
            'openai': mock_openai_instance
        }


@pytest.fixture
def test_user_data():
    """Fixture with test user data."""
    return {
        'username': 'testuser',
        'email': 'test@example.com',
        'password': 'TestPassword123!',
        'full_name': 'Test User'
    }


@pytest.fixture
def test_diagnosis_data():
    """Fixture with test diagnosis data."""
    return {
        'query': 'Why are my leaves turning yellow?',
        'language': 'en',
        'detected_tags': ['yellowing', 'chlorosis', 'nutritional_deficiency'],
        'diagnosis_text': 'Your crop appears to have chlorosis, likely due to iron or nitrogen deficiency.',
        'image_url': 'https://example.com/crop.jpg'
    }


@pytest.fixture(autouse=True)
def mock_settings(monkeypatch, temp_data_dir):
    """Fixture that patches settings for tests."""
    monkeypatch.setattr(settings, 'data_dir', str(temp_data_dir))
    monkeypatch.setattr(settings, 'jwt_secret', 'test-secret-key-12345')
    monkeypatch.setattr(settings, 'jwt_algorithm', 'HS256')
