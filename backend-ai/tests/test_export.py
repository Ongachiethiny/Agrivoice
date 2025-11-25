"""Tests for PDF export endpoints."""
import json
import pytest
import base64


class TestExportEndpoints:
    """Test suite for PDF export endpoints."""
    
    def setup_method(self, method):
        """Setup for each test - create authenticated user with history."""
        self.test_user = {
            'username': 'exportuser',
            'email': 'export@example.com',
            'password': 'ExportPass123!',
            'full_name': 'Export User'
        }
        self.access_token = None
        self.diagnosis_id = None
    
    def _setup_user_with_diagnosis(self, client):
        """Helper to setup authenticated user with a saved diagnosis."""
        # Register and login
        client.post('/api/auth/register', json=self.test_user)
        response = client.post('/api/auth/login', json={
            'email': self.test_user['email'],
            'password': self.test_user['password']
        })
        self.access_token = response.json()['data']['access_token']
        
        # Save a diagnosis
        diagnosis_data = {
            'query': 'What disease is this?',
            'language': 'en',
            'detected_tags': ['fungal_disease', 'leaf_spot'],
            'diagnosis_text': 'This appears to be a fungal leaf spot disease. Recommended treatment includes fungicide application.',
            'translated_text': None,
            'image_base64': 'base64imagedata',
            'audio_base64': 'base64audiodata'
        }
        save_response = client.post(
            '/api/history/save',
            json=diagnosis_data,
            headers={'Authorization': f'Bearer {self.access_token}'}
        )
        self.diagnosis_id = save_response.json()['data']['diagnosis_id']
        return self.access_token, self.diagnosis_id
    
    def test_export_diagnosis_pdf_success(self, client):
        """Test successful PDF export of a single diagnosis."""
        token, diagnosis_id = self._setup_user_with_diagnosis(client)
        
        response = client.post(
            f'/api/export/diagnosis/{diagnosis_id}/pdf',
            headers={'Authorization': f'Bearer {token}'}
        )
        
        assert response.status_code == 200
        assert response.headers['content-type'] == 'application/pdf'
        assert len(response.content) > 0
    
    def test_export_diagnosis_pdf_not_found(self, client):
        """Test PDF export fails for non-existent diagnosis."""
        token, _ = self._setup_user_with_diagnosis(client)
        
        response = client.post(
            '/api/export/diagnosis/non-existent-id/pdf',
            headers={'Authorization': f'Bearer {token}'}
        )
        
        assert response.status_code == 404
        data = response.json()
        assert data['success'] is False
    
    def test_export_diagnosis_pdf_unauthenticated(self, client):
        """Test PDF export fails without authentication."""
        response = client.post('/api/export/diagnosis/some-id/pdf')
        assert response.status_code == 401
    
    def test_export_history_pdf_success(self, client):
        """Test successful PDF export of entire history."""
        token, _ = self._setup_user_with_diagnosis(client)
        
        # Add another diagnosis
        diagnosis_data = {
            'query': 'Another question',
            'language': 'en',
            'detected_tags': ['bacterial_disease'],
            'diagnosis_text': 'This is a bacterial infection.',
            'translated_text': None,
            'image_base64': 'data',
            'audio_base64': 'data'
        }
        client.post(
            '/api/history/save',
            json=diagnosis_data,
            headers={'Authorization': f'Bearer {token}'}
        )
        
        response = client.post(
            '/api/export/history/pdf',
            headers={'Authorization': f'Bearer {token}'}
        )
        
        assert response.status_code == 200
        assert response.headers['content-type'] == 'application/pdf'
        assert len(response.content) > 0
    
    def test_export_history_pdf_empty(self, client):
        """Test PDF export of empty history."""
        client.post('/api/auth/register', json=self.test_user)
        response = client.post('/api/auth/login', json={
            'email': self.test_user['email'],
            'password': self.test_user['password']
        })
        token = response.json()['data']['access_token']
        
        response = client.post(
            '/api/export/history/pdf',
            headers={'Authorization': f'Bearer {token}'}
        )
        
        assert response.status_code == 200
        assert response.headers['content-type'] == 'application/pdf'
    
    def test_export_history_pdf_unauthenticated(self, client):
        """Test history PDF export fails without authentication."""
        response = client.post('/api/export/history/pdf')
        assert response.status_code == 401
    
    def test_diagnosis_pdf_preview_success(self, client):
        """Test PDF preview for single diagnosis (base64)."""
        token, diagnosis_id = self._setup_user_with_diagnosis(client)
        
        response = client.get(
            f'/api/export/diagnosis/{diagnosis_id}/preview',
            headers={'Authorization': f'Bearer {token}'}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data['success'] is True
        assert 'base64_pdf' in data['data']
        # Verify it's valid base64
        try:
            base64.b64decode(data['data']['base64_pdf'])
        except Exception as e:
            pytest.fail(f"Invalid base64 in preview: {e}")
    
    def test_diagnosis_pdf_preview_not_found(self, client):
        """Test PDF preview fails for non-existent diagnosis."""
        token, _ = self._setup_user_with_diagnosis(client)
        
        response = client.get(
            '/api/export/diagnosis/non-existent/preview',
            headers={'Authorization': f'Bearer {token}'}
        )
        
        assert response.status_code == 404
    
    def test_history_pdf_preview_success(self, client):
        """Test PDF preview for entire history (base64)."""
        token, _ = self._setup_user_with_diagnosis(client)
        
        response = client.get(
            '/api/export/history/preview',
            headers={'Authorization': f'Bearer {token}'}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data['success'] is True
        assert 'base64_pdf' in data['data']
        # Verify it's valid base64
        try:
            base64.b64decode(data['data']['base64_pdf'])
        except Exception as e:
            pytest.fail(f"Invalid base64 in preview: {e}")
    
    def test_history_pdf_preview_unauthenticated(self, client):
        """Test history PDF preview fails without authentication."""
        response = client.get('/api/export/history/preview')
        assert response.status_code == 401
    
    def test_export_with_multilingual_content(self, client):
        """Test PDF export with multilingual diagnoses."""
        token, _ = self._setup_user_with_diagnosis(client)
        
        # Add diagnosis in different language
        diagnosis_data = {
            'query': 'Ni nini kimetembea na mbegu yangu?',
            'language': 'sw',
            'detected_tags': ['msitu_wa_juhudi'],
            'diagnosis_text': 'Hii ni ugonjwa wa kuvu.',
            'translated_text': 'This is a fungal disease.',
            'image_base64': 'data',
            'audio_base64': 'data'
        }
        client.post(
            '/api/history/save',
            json=diagnosis_data,
            headers={'Authorization': f'Bearer {token}'}
        )
        
        response = client.post(
            '/api/export/history/pdf',
            headers={'Authorization': f'Bearer {token}'}
        )
        
        assert response.status_code == 200
        assert len(response.content) > 0
