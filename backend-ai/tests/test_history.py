"""Tests for diagnosis history endpoints."""
import json
import pytest
from datetime import datetime


class TestHistoryEndpoints:
    """Test suite for diagnosis history endpoints."""
    
    def setup_method(self, method):
        """Setup for each test - create authenticated user."""
        self.test_user = {
            'username': 'historyuser',
            'email': 'history@example.com',
            'password': 'HistoryPass123!',
            'full_name': 'History User'
        }
        self.access_token = None
    
    def _register_and_login(self, client):
        """Helper to register and login a user."""
        client.post('/api/auth/register', json=self.test_user)
        response = client.post('/api/auth/login', json={
            'email': self.test_user['email'],
            'password': self.test_user['password']
        })
        self.access_token = response.json()['data']['access_token']
        return self.access_token
    
    def test_save_diagnosis_success(self, client):
        """Test saving a diagnosis successfully."""
        token = self._register_and_login(client)
        
        diagnosis_data = {
            'query': 'Why are my leaves yellow?',
            'language': 'en',
            'detected_tags': ['yellowing', 'chlorosis'],
            'diagnosis_text': 'Iron deficiency chlorosis detected.',
            'translated_text': None,
            'image_base64': 'base64data...',
            'audio_base64': 'audiodata...'
        }
        
        response = client.post(
            '/api/history/save',
            json=diagnosis_data,
            headers={'Authorization': f'Bearer {token}'}
        )
        
        assert response.status_code == 201
        data = response.json()
        assert data['success'] is True
        assert 'diagnosis_id' in data['data']
    
    def test_save_diagnosis_unauthenticated(self, client):
        """Test saving diagnosis without authentication fails."""
        diagnosis_data = {
            'query': 'Why are my leaves yellow?',
            'language': 'en'
        }
        
        response = client.post('/api/history/save', json=diagnosis_data)
        assert response.status_code == 401
    
    def test_list_history_empty(self, client):
        """Test listing history when empty."""
        token = self._register_and_login(client)
        
        response = client.get(
            '/api/history/list',
            headers={'Authorization': f'Bearer {token}'}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data['success'] is True
        assert data['data'] == []
    
    def test_list_history_with_records(self, client):
        """Test listing history with saved records."""
        token = self._register_and_login(client)
        
        # Save multiple diagnoses
        for i in range(3):
            diagnosis_data = {
                'query': f'Question {i}',
                'language': 'en',
                'detected_tags': ['tag1', 'tag2'],
                'diagnosis_text': f'Diagnosis {i}',
                'translated_text': None,
                'image_base64': 'data',
                'audio_base64': 'data'
            }
            client.post(
                '/api/history/save',
                json=diagnosis_data,
                headers={'Authorization': f'Bearer {token}'}
            )
        
        # List history
        response = client.get(
            '/api/history/list',
            headers={'Authorization': f'Bearer {token}'}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data['success'] is True
        assert len(data['data']) == 3
    
    def test_get_diagnosis_success(self, client):
        """Test retrieving a specific diagnosis."""
        token = self._register_and_login(client)
        
        # Save a diagnosis
        diagnosis_data = {
            'query': 'Test question',
            'language': 'en',
            'detected_tags': ['test'],
            'diagnosis_text': 'Test diagnosis',
            'translated_text': None,
            'image_base64': 'data',
            'audio_base64': 'data'
        }
        save_response = client.post(
            '/api/history/save',
            json=diagnosis_data,
            headers={'Authorization': f'Bearer {token}'}
        )
        diagnosis_id = save_response.json()['data']['diagnosis_id']
        
        # Get the diagnosis
        response = client.get(
            f'/api/history/get/{diagnosis_id}',
            headers={'Authorization': f'Bearer {token}'}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data['success'] is True
        assert data['data']['id'] == diagnosis_id
        assert data['data']['query'] == 'Test question'
    
    def test_get_diagnosis_not_found(self, client):
        """Test retrieving non-existent diagnosis."""
        token = self._register_and_login(client)
        
        response = client.get(
            '/api/history/get/non-existent-id',
            headers={'Authorization': f'Bearer {token}'}
        )
        
        assert response.status_code == 404
        data = response.json()
        assert data['success'] is False
    
    def test_delete_diagnosis_success(self, client):
        """Test deleting a diagnosis."""
        token = self._register_and_login(client)
        
        # Save a diagnosis
        diagnosis_data = {
            'query': 'To be deleted',
            'language': 'en',
            'detected_tags': ['test'],
            'diagnosis_text': 'This will be deleted',
            'translated_text': None,
            'image_base64': 'data',
            'audio_base64': 'data'
        }
        save_response = client.post(
            '/api/history/save',
            json=diagnosis_data,
            headers={'Authorization': f'Bearer {token}'}
        )
        diagnosis_id = save_response.json()['data']['diagnosis_id']
        
        # Delete the diagnosis
        response = client.delete(
            f'/api/history/delete/{diagnosis_id}',
            headers={'Authorization': f'Bearer {token}'}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data['success'] is True
        
        # Verify it's deleted
        get_response = client.get(
            f'/api/history/get/{diagnosis_id}',
            headers={'Authorization': f'Bearer {token}'}
        )
        assert get_response.status_code == 404
    
    def test_get_stats(self, client):
        """Test retrieving history statistics."""
        token = self._register_and_login(client)
        
        # Save diagnoses
        for i in range(2):
            diagnosis_data = {
                'query': f'Question {i}',
                'language': 'en' if i == 0 else 'sw',
                'detected_tags': ['common_tag'],
                'diagnosis_text': f'Diagnosis {i}',
                'translated_text': None,
                'image_base64': 'data',
                'audio_base64': 'data'
            }
            client.post(
                '/api/history/save',
                json=diagnosis_data,
                headers={'Authorization': f'Bearer {token}'}
            )
        
        # Get stats
        response = client.get(
            '/api/history/stats',
            headers={'Authorization': f'Bearer {token}'}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data['success'] is True
        assert data['data']['total_diagnoses'] == 2
        assert 'en' in data['data']['languages_used']
        assert 'sw' in data['data']['languages_used']
    
    def test_isolated_user_history(self, client):
        """Test that each user only sees their own history."""
        # Create two users
        user1 = {
            'username': 'user1',
            'email': 'user1@example.com',
            'password': 'Pass123!',
            'full_name': 'User 1'
        }
        user2 = {
            'username': 'user2',
            'email': 'user2@example.com',
            'password': 'Pass123!',
            'full_name': 'User 2'
        }
        
        # Register and get tokens
        client.post('/api/auth/register', json=user1)
        token1_response = client.post('/api/auth/login', json={
            'email': user1['email'],
            'password': user1['password']
        })
        token1 = token1_response.json()['data']['access_token']
        
        client.post('/api/auth/register', json=user2)
        token2_response = client.post('/api/auth/login', json={
            'email': user2['email'],
            'password': user2['password']
        })
        token2 = token2_response.json()['data']['access_token']
        
        # User 1 saves a diagnosis
        diagnosis_data = {
            'query': 'User 1 question',
            'language': 'en',
            'detected_tags': ['tag1'],
            'diagnosis_text': 'User 1 diagnosis',
            'translated_text': None,
            'image_base64': 'data',
            'audio_base64': 'data'
        }
        client.post(
            '/api/history/save',
            json=diagnosis_data,
            headers={'Authorization': f'Bearer {token1}'}
        )
        
        # User 2 should not see User 1's diagnosis
        response = client.get(
            '/api/history/list',
            headers={'Authorization': f'Bearer {token2}'}
        )
        data = response.json()
        assert len(data['data']) == 0
