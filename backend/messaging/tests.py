from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from unittest.mock import patch, Mock
import json

User = get_user_model()


class CourierAPIClientTestCase(TestCase):
    """Test cases for CourierAPIClient."""
    
    def setUp(self):
        from backend.courier_client import CourierAPIClient
        self.client = CourierAPIClient()
    
    @patch('requests.put')
    def test_create_user(self, mock_put):
        """Test creating a user in Courier."""
        mock_response = Mock()
        mock_response.json.return_value = {'id': 'test-user'}
        mock_response.raise_for_status.return_value = None
        mock_put.return_value = mock_response
        
        user_id = 'test-user'
        profile = {'email': 'test@example.com', 'name': 'Test User'}
        
        result = self.client.create_user(user_id, profile)
        
        self.assertEqual(result['id'], 'test-user')
        mock_put.assert_called_once()
    
    @patch('requests.post')
    def test_send_message(self, mock_post):
        """Test sending a message through Courier."""
        mock_response = Mock()
        mock_response.json.return_value = {'requestId': 'msg-123'}
        mock_response.raise_for_status.return_value = None
        mock_post.return_value = mock_response
        
        message = {
            'to': {'user_id': 'test-user'},
            'template': 'test-template',
            'data': {'name': 'Test'}
        }
        
        result = self.client.send_message(message)
        
        self.assertEqual(result['requestId'], 'msg-123')
        mock_post.assert_called_once()
    
    @patch('requests.get')
    def test_get_templates(self, mock_get):
        """Test retrieving templates from Courier."""
        mock_response = Mock()
        mock_response.json.return_value = {'results': [{'id': 'template-1'}]}
        mock_response.raise_for_status.return_value = None
        mock_get.return_value = mock_response
        
        result = self.client.get_templates()
        
        self.assertIn('results', result)
        self.assertEqual(len(result['results']), 1)
        mock_get.assert_called_once()
    
    @patch('requests.get')
    def test_get_user_profile(self, mock_get):
        """Test retrieving user profile from Courier."""
        mock_response = Mock()
        mock_response.json.return_value = {'id': 'test-user', 'profile': {'email': 'test@example.com'}}
        mock_response.raise_for_status.return_value = None
        mock_get.return_value = mock_response
        
        result = self.client.get_user_profile('test-user')
        
        self.assertEqual(result['id'], 'test-user')
        self.assertIn('profile', result)
        mock_get.assert_called_once()
    
    @patch('requests.patch')
    def test_update_user_profile(self, mock_patch):
        """Test updating user profile in Courier."""
        mock_response = Mock()
        mock_response.json.return_value = {'id': 'test-user'}
        mock_response.raise_for_status.return_value = None
        mock_patch.return_value = mock_response
        
        user_id = 'test-user'
        profile = {'email': 'updated@example.com'}
        
        result = self.client.update_user_profile(user_id, profile)
        
        self.assertEqual(result['id'], 'test-user')
        mock_patch.assert_called_once()
    
    @patch('requests.delete')
    def test_delete_template(self, mock_delete):
        """Test deleting a template from Courier."""
        mock_response = Mock()
        mock_response.json.return_value = {'id': 'template-1'}
        mock_response.raise_for_status.return_value = None
        mock_delete.return_value = mock_response
        
        result = self.client.delete_template('template-1')
        
        self.assertEqual(result['id'], 'template-1')
        mock_delete.assert_called_once()