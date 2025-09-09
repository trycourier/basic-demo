from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from unittest.mock import patch

User = get_user_model()


class MessageHistoryTestCase(APITestCase):
    """Test cases for message history functionality."""
    
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
    
    @patch('config.courier_client.CourierAPIClient.get_templates')
    def test_get_message_templates_success(self, mock_get_templates):
        """Test successful template retrieval."""
        mock_templates = {
            'results': [
                {'id': 'template-1', 'name': 'Welcome Template'},
                {'id': 'template-2', 'name': 'Order Confirmation'}
            ]
        }
        mock_get_templates.return_value = mock_templates
        
        response = self.client.get('/api/messaging/templates/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['templates']), 2)
        self.assertEqual(response.data['count'], 2)
        self.assertEqual(response.data['templates'][0]['id'], 'template-1')
    
    @patch('config.courier_client.CourierAPIClient.get_templates')
    def test_get_message_templates_empty(self, mock_get_templates):
        """Test template retrieval with empty results."""
        mock_get_templates.return_value = {'results': []}
        
        response = self.client.get('/api/messaging/templates/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['templates']), 0)
        self.assertEqual(response.data['count'], 0)
    
    @patch('config.courier_client.CourierAPIClient.get_templates')
    def test_get_message_templates_courier_error(self, mock_get_templates):
        """Test template retrieval when Courier API fails."""
        mock_get_templates.side_effect = Exception('Courier API error')
        
        response = self.client.get('/api/messaging/templates/')
        
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertIn('Failed to get templates', response.data['error'])
    
    def test_get_message_templates_unauthenticated(self):
        """Test template retrieval without authentication."""
        self.client.credentials()  # Remove authentication
        
        response = self.client.get('/api/messaging/templates/')
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_get_user_messages_success(self):
        """Test successful user message retrieval."""
        response = self.client.get('/api/messaging/messages/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['messages']), 2)
        self.assertEqual(response.data['count'], 2)
        self.assertEqual(response.data['user_id'], self.user.courier_user_id)
        
        # Verify message structure
        first_message = response.data['messages'][0]
        self.assertIn('id', first_message)
        self.assertIn('template', first_message)
        self.assertIn('status', first_message)
        self.assertIn('created_at', first_message)
        self.assertIn('channels', first_message)
    
    def test_get_user_messages_unauthenticated(self):
        """Test user message retrieval without authentication."""
        self.client.credentials()  # Remove authentication
        
        response = self.client.get('/api/messaging/messages/')
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
