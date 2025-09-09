from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from unittest.mock import patch

User = get_user_model()


class MessagingViewsTestCase(APITestCase):
    """Test cases for messaging API views."""
    
    def setUp(self):
        """Set up test data."""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User',
            courier_user_id='demo_user_testuser'
        )
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
    
    @patch('config.courier_client.CourierAPIClient.send_message')
    def test_send_message_success(self, mock_send_message):
        """Test successful message sending."""
        mock_send_message.return_value = {'requestId': 'msg-123'}
        
        data = {
            'recipient': 'test@example.com',
            'template': 'test-template',
            'data': {'name': 'Test User'}
        }
        
        response = self.client.post('/api/messaging/send/', data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message_id'], 'msg-123')
        self.assertEqual(response.data['status'], 'sent')
        mock_send_message.assert_called_once()
    
    def test_send_message_missing_recipient(self):
        """Test message sending with missing recipient field."""
        data = {
            'template': 'test-template',
            'data': {'name': 'Test User'}
        }
        
        response = self.client.post('/api/messaging/send/', data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Missing required field: recipient', response.data['error'])
    
    def test_send_message_missing_template(self):
        """Test message sending with missing template field."""
        data = {
            'recipient': 'test@example.com',
            'data': {'name': 'Test User'}
        }
        
        response = self.client.post('/api/messaging/send/', data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Missing required field: template', response.data['error'])
    
    def test_send_message_missing_data(self):
        """Test message sending with missing data field."""
        data = {
            'recipient': 'test@example.com',
            'template': 'test-template'
        }
        
        response = self.client.post('/api/messaging/send/', data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Missing required field: data', response.data['error'])
    
    @patch('config.courier_client.CourierAPIClient.send_message')
    def test_send_message_courier_error(self, mock_send_message):
        """Test message sending when Courier API fails."""
        mock_send_message.side_effect = Exception('Courier API error')
        
        data = {
            'recipient': 'test@example.com',
            'template': 'test-template',
            'data': {'name': 'Test User'}
        }
        
        response = self.client.post('/api/messaging/send/', data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertIn('Failed to send message', response.data['error'])
    
    def test_send_message_unauthenticated(self):
        """Test message sending without authentication."""
        self.client.credentials()  # Remove authentication
        
        data = {
            'recipient': 'test@example.com',
            'template': 'test-template',
            'data': {'name': 'Test User'}
        }
        
        response = self.client.post('/api/messaging/send/', data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
