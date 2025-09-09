from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from unittest.mock import patch

User = get_user_model()


class WelcomeMessageTestCase(APITestCase):
    """Test cases for welcome message functionality."""
    
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
    def test_send_welcome_message_success(self, mock_send_message):
        """Test successful welcome message sending."""
        mock_send_message.return_value = {'requestId': 'welcome-123'}
        
        response = self.client.post('/api/messaging/send-welcome/', {}, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message_id'], 'welcome-123')
        self.assertEqual(response.data['status'], 'sent')
        self.assertEqual(response.data['message'], 'Welcome message sent successfully')
        
        # Verify the message data structure
        call_args = mock_send_message.call_args[0][0]
        self.assertEqual(call_args['message']['to']['user_id'], self.user.courier_user_id)
        self.assertEqual(call_args['message']['template'], 'welcome-template')
        self.assertEqual(call_args['message']['data']['first_name'], 'Test')
        self.assertEqual(call_args['message']['data']['email'], 'test@example.com')
    
    @patch('config.courier_client.CourierAPIClient.send_message')
    def test_send_welcome_message_courier_error(self, mock_send_message):
        """Test welcome message sending when Courier API fails."""
        mock_send_message.side_effect = Exception('Courier API error')
        
        response = self.client.post('/api/messaging/send-welcome/', {}, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertIn('Failed to send welcome message', response.data['error'])
    
    def test_send_welcome_message_unauthenticated(self):
        """Test welcome message sending without authentication."""
        self.client.credentials()  # Remove authentication
        
        response = self.client.post('/api/messaging/send-welcome/', {}, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
