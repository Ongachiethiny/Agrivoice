"""Integration tests for the complete authentication and diagnosis workflow."""
import pytest
from datetime import datetime


class TestAuthDiagnosisFlow:
    """End-to-end integration tests for auth → diagnosis → history → export workflow."""
    
    def test_complete_user_workflow(self, client):
        """Test complete workflow: register → login → diagnose → history → export."""
        
        # Step 1: User Registration
        user_data = {
            'username': 'workflow_user',
            'email': 'workflow@example.com',
            'password': 'WorkflowPass123!',
            'full_name': 'Workflow Test User'
        }
        
        reg_response = client.post('/api/auth/register', json=user_data)
        assert reg_response.status_code == 201
        assert reg_response.json()['success'] is True
        
        # Step 2: User Login
        login_response = client.post('/api/auth/login', json={
            'email': user_data['email'],
            'password': user_data['password']
        })
        assert login_response.status_code == 200
        login_data = login_response.json()
        assert login_data['success'] is True
        access_token = login_data['data']['access_token']
        refresh_token = login_data['data']['refresh_token']
        
        # Step 3: Get Profile
        profile_response = client.get(
            '/api/auth/profile',
            headers={'Authorization': f'Bearer {access_token}'}
        )
        assert profile_response.status_code == 200
        profile_data = profile_response.json()
        assert profile_data['data']['email'] == user_data['email']
        
        # Step 4: Save Diagnoses
        diagnoses_saved = []
        for i in range(3):
            diagnosis_data = {
                'query': f'Crop issue {i}: Why is this happening?',
                'language': 'en' if i % 2 == 0 else 'sw',
                'detected_tags': [f'tag_{i}', f'issue_{i}'],
                'diagnosis_text': f'Diagnosis for issue {i}. Recommended treatment...',
                'translated_text': f'Translation for issue {i}' if i % 2 == 1 else None,
                'image_base64': 'data:image/png;base64,iVBORw0KGg...',
                'audio_base64': 'data:audio/mp3;base64,//MUxDIAAANIAAAAAExBTUUzLjk...'
            }
            
            save_response = client.post(
                '/api/history/save',
                json=diagnosis_data,
                headers={'Authorization': f'Bearer {access_token}'}
            )
            assert save_response.status_code == 201
            diagnosis_id = save_response.json()['data']['diagnosis_id']
            diagnoses_saved.append(diagnosis_id)
        
        # Step 5: Retrieve History
        history_response = client.get(
            '/api/history/list',
            headers={'Authorization': f'Bearer {access_token}'}
        )
        assert history_response.status_code == 200
        history_data = history_response.json()
        assert len(history_data['data']) == 3
        
        # Step 6: Get Individual Diagnosis
        diagnosis_response = client.get(
            f'/api/history/get/{diagnoses_saved[0]}',
            headers={'Authorization': f'Bearer {access_token}'}
        )
        assert diagnosis_response.status_code == 200
        diagnosis_detail = diagnosis_response.json()['data']
        assert diagnosis_detail['id'] == diagnoses_saved[0]
        
        # Step 7: Get Statistics
        stats_response = client.get(
            '/api/history/stats',
            headers={'Authorization': f'Bearer {access_token}'}
        )
        assert stats_response.status_code == 200
        stats = stats_response.json()['data']
        assert stats['total_diagnoses'] == 3
        
        # Step 8: Export Single Diagnosis as PDF
        export_single_response = client.post(
            f'/api/export/diagnosis/{diagnoses_saved[0]}/pdf',
            headers={'Authorization': f'Bearer {access_token}'}
        )
        assert export_single_response.status_code == 200
        assert export_single_response.headers['content-type'] == 'application/pdf'
        assert len(export_single_response.content) > 0
        
        # Step 9: Export History as PDF
        export_history_response = client.post(
            '/api/export/history/pdf',
            headers={'Authorization': f'Bearer {access_token}'}
        )
        assert export_history_response.status_code == 200
        assert export_history_response.headers['content-type'] == 'application/pdf'
        assert len(export_history_response.content) > 0
        
        # Step 10: Get PDF Preview (Base64)
        preview_response = client.get(
            f'/api/export/diagnosis/{diagnoses_saved[0]}/preview',
            headers={'Authorization': f'Bearer {access_token}'}
        )
        assert preview_response.status_code == 200
        preview_data = preview_response.json()
        assert preview_data['success'] is True
        assert 'base64_pdf' in preview_data['data']
        
        # Step 11: Delete One Diagnosis
        delete_response = client.delete(
            f'/api/history/delete/{diagnoses_saved[0]}',
            headers={'Authorization': f'Bearer {access_token}'}
        )
        assert delete_response.status_code == 200
        
        # Step 12: Verify Deletion
        verify_response = client.get(
            f'/api/history/get/{diagnoses_saved[0]}',
            headers={'Authorization': f'Bearer {access_token}'}
        )
        assert verify_response.status_code == 404
        
        # Step 13: Verify Stats Updated
        updated_stats_response = client.get(
            '/api/history/stats',
            headers={'Authorization': f'Bearer {access_token}'}
        )
        updated_stats = updated_stats_response.json()['data']
        assert updated_stats['total_diagnoses'] == 2
        
        # Step 14: Token Refresh
        refresh_response = client.post('/api/auth/refresh', json={
            'refresh_token': refresh_token
        })
        assert refresh_response.status_code == 200
        new_token = refresh_response.json()['data']['access_token']
        
        # Step 15: Use New Token
        verify_new_token = client.get(
            '/api/auth/profile',
            headers={'Authorization': f'Bearer {new_token}'}
        )
        assert verify_new_token.status_code == 200
        
        # Step 16: Logout
        logout_response = client.post(
            '/api/auth/logout',
            headers={'Authorization': f'Bearer {new_token}'}
        )
        assert logout_response.status_code == 200
    
    def test_multi_user_isolation(self, client):
        """Test that different users' data is properly isolated."""
        
        # Create two users
        user1 = {
            'username': 'user_iso_1',
            'email': 'iso1@example.com',
            'password': 'IsoPass1!',
            'full_name': 'User Iso 1'
        }
        user2 = {
            'username': 'user_iso_2',
            'email': 'iso2@example.com',
            'password': 'IsoPass2!',
            'full_name': 'User Iso 2'
        }
        
        # Register and login both users
        client.post('/api/auth/register', json=user1)
        token1_resp = client.post('/api/auth/login', json={
            'email': user1['email'],
            'password': user1['password']
        })
        token1 = token1_resp.json()['data']['access_token']
        
        client.post('/api/auth/register', json=user2)
        token2_resp = client.post('/api/auth/login', json={
            'email': user2['email'],
            'password': user2['password']
        })
        token2 = token2_resp.json()['data']['access_token']
        
        # User 1 saves diagnosis
        user1_diagnosis = {
            'query': 'User 1 question',
            'language': 'en',
            'detected_tags': ['user1_tag'],
            'diagnosis_text': 'User 1 diagnosis',
            'translated_text': None,
            'image_base64': 'data',
            'audio_base64': 'data'
        }
        user1_save = client.post(
            '/api/history/save',
            json=user1_diagnosis,
            headers={'Authorization': f'Bearer {token1}'}
        )
        user1_diagnosis_id = user1_save.json()['data']['diagnosis_id']
        
        # User 2 saves diagnosis
        user2_diagnosis = {
            'query': 'User 2 question',
            'language': 'en',
            'detected_tags': ['user2_tag'],
            'diagnosis_text': 'User 2 diagnosis',
            'translated_text': None,
            'image_base64': 'data',
            'audio_base64': 'data'
        }
        user2_save = client.post(
            '/api/history/save',
            json=user2_diagnosis,
            headers={'Authorization': f'Bearer {token2}'}
        )
        user2_diagnosis_id = user2_save.json()['data']['diagnosis_id']
        
        # User 1 should see only their diagnosis
        user1_list = client.get(
            '/api/history/list',
            headers={'Authorization': f'Bearer {token1}'}
        )
        user1_diagnoses = user1_list.json()['data']
        assert len(user1_diagnoses) == 1
        assert user1_diagnoses[0]['id'] == user1_diagnosis_id
        
        # User 2 should see only their diagnosis
        user2_list = client.get(
            '/api/history/list',
            headers={'Authorization': f'Bearer {token2}'}
        )
        user2_diagnoses = user2_list.json()['data']
        assert len(user2_diagnoses) == 1
        assert user2_diagnoses[0]['id'] == user2_diagnosis_id
        
        # User 1 should not be able to access User 2's diagnosis
        user1_access_user2 = client.get(
            f'/api/history/get/{user2_diagnosis_id}',
            headers={'Authorization': f'Bearer {token1}'}
        )
        assert user1_access_user2.status_code == 404
        
        # User 2 should not be able to delete User 1's diagnosis
        user2_delete_user1 = client.delete(
            f'/api/history/delete/{user1_diagnosis_id}',
            headers={'Authorization': f'Bearer {token2}'}
        )
        assert user2_delete_user1.status_code == 404
        
        # Verify User 1's diagnosis still exists
        user1_verify = client.get(
            f'/api/history/get/{user1_diagnosis_id}',
            headers={'Authorization': f'Bearer {token1}'}
        )
        assert user1_verify.status_code == 200
