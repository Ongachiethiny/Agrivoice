"""Tests for authentication endpoints."""
import json
import pytest
from datetime import datetime, timedelta


class TestAuthEndpoints:
    """Test suite for authentication endpoints."""
    
    def test_register_success(self, client, test_user_data):
        """Test successful user registration."""
        response = client.post('/api/auth/register', json=test_user_data)
        assert response.status_code == 201
        data = response.json()
        assert data['success'] is True
        assert 'message' in data
        assert 'User registered successfully' in data['message']
    
    def test_register_duplicate_email(self, client, test_user_data):
        """Test registration fails with duplicate email."""
        # First registration
        client.post('/api/auth/register', json=test_user_data)
        
        # Second registration with same email
        response = client.post('/api/auth/register', json=test_user_data)
        assert response.status_code == 409
        data = response.json()
        assert data['success'] is False
        assert 'already exists' in data['message'] or 'already registered' in data['message']
    
    def test_register_missing_fields(self, client):
        """Test registration fails with missing fields."""
        response = client.post('/api/auth/register', json={
            'email': 'test@example.com'
        })
        assert response.status_code == 422  # Validation error
    
    def test_register_invalid_email(self, client):
        """Test registration fails with invalid email."""
        response = client.post('/api/auth/register', json={
            'username': 'testuser',
            'email': 'invalid-email',
            'password': 'Password123!',
            'full_name': 'Test User'
        })
        assert response.status_code == 422
    
    def test_login_success(self, client, test_user_data):
        """Test successful login."""
        # Register first
        client.post('/api/auth/register', json=test_user_data)
        
        # Login
        response = client.post('/api/auth/login', json={
            'email': test_user_data['email'],
            'password': test_user_data['password']
        })
        assert response.status_code == 200
        data = response.json()
        assert data['success'] is True
        assert 'access_token' in data['data']
        assert 'refresh_token' in data['data']
        assert data['data']['token_type'] == 'bearer'
    
    def test_login_invalid_email(self, client):
        """Test login fails with non-existent email."""
        response = client.post('/api/auth/login', json={
            'email': 'nonexistent@example.com',
            'password': 'Password123!'
        })
        assert response.status_code == 401
        data = response.json()
        assert data['success'] is False
    
    def test_login_invalid_password(self, client, test_user_data):
        """Test login fails with wrong password."""
        # Register first
        client.post('/api/auth/register', json=test_user_data)
        
        # Login with wrong password
        response = client.post('/api/auth/login', json={
            'email': test_user_data['email'],
            'password': 'WrongPassword123!'
        })
        assert response.status_code == 401
        data = response.json()
        assert data['success'] is False
    
    def test_refresh_token_success(self, client, test_user_data):
        """Test successful token refresh."""
        # Register and login
        client.post('/api/auth/register', json=test_user_data)
        login_response = client.post('/api/auth/login', json={
            'email': test_user_data['email'],
            'password': test_user_data['password']
        })
        refresh_token = login_response.json()['data']['refresh_token']
        
        # Refresh token
        response = client.post('/api/auth/refresh', json={
            'refresh_token': refresh_token
        })
        assert response.status_code == 200
        data = response.json()
        assert data['success'] is True
        assert 'access_token' in data['data']
    
    def test_refresh_token_invalid(self, client):
        """Test token refresh fails with invalid token."""
        response = client.post('/api/auth/refresh', json={
            'refresh_token': 'invalid-token-xyz'
        })
        assert response.status_code == 401
        data = response.json()
        assert data['success'] is False
    
    def test_get_profile_authenticated(self, client, test_user_data):
        """Test getting profile with valid token."""
        # Register and login
        client.post('/api/auth/register', json=test_user_data)
        login_response = client.post('/api/auth/login', json={
            'email': test_user_data['email'],
            'password': test_user_data['password']
        })
        access_token = login_response.json()['data']['access_token']
        
        # Get profile
        response = client.get(
            '/api/auth/profile',
            headers={'Authorization': f'Bearer {access_token}'}
        )
        assert response.status_code == 200
        data = response.json()
        assert data['success'] is True
        assert data['data']['email'] == test_user_data['email']
        assert data['data']['username'] == test_user_data['username']
    
    def test_get_profile_unauthenticated(self, client):
        """Test getting profile without token fails."""
        response = client.get('/api/auth/profile')
        assert response.status_code == 401
    
    def test_get_profile_invalid_token(self, client):
        """Test getting profile with invalid token fails."""
        response = client.get(
            '/api/auth/profile',
            headers={'Authorization': 'Bearer invalid-token'}
        )
        assert response.status_code == 401
    
    def test_logout(self, client, test_user_data):
        """Test logout endpoint."""
        # Register and login
        client.post('/api/auth/register', json=test_user_data)
        login_response = client.post('/api/auth/login', json={
            'email': test_user_data['email'],
            'password': test_user_data['password']
        })
        access_token = login_response.json()['data']['access_token']
        
        # Logout
        response = client.post(
            '/api/auth/logout',
            headers={'Authorization': f'Bearer {access_token}'}
        )
        assert response.status_code == 200
        data = response.json()
        assert data['success'] is True
