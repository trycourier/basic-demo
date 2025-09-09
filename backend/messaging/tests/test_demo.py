from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from unittest.mock import patch

User = get_user_model()


class DemoNotificationTestCase(APITestCase):
    """Test cases for demo notification functionality."""
    
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
    def test_send_demo_notification_order_confirmation(self, mock_send_message):
        """Test sending order confirmation demo notification."""
        mock_send_message.return_value = {'requestId': 'demo-123'}
        
        data = {'type': 'order_confirmation'}
        response = self.client.post('/api/messaging/send-demo/', data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message_id'], 'demo-123')
        self.assertEqual(response.data['type'], 'order_confirmation')
        
        # Verify the message data structure
        call_args = mock_send_message.call_args[0][0]
        self.assertEqual(call_args['message']['template'], 'order-confirmation-template')
        self.assertEqual(call_args['message']['data']['order_number'], 'DEMO-12345')
        self.assertEqual(call_args['message']['data']['total_amount'], '$99.99')
    
    @patch('config.courier_client.CourierAPIClient.send_message')
    def test_send_demo_notification_shipping_update(self, mock_send_message):
        """Test sending shipping update demo notification."""
        mock_send_message.return_value = {'requestId': 'demo-456'}
        
        data = {'type': 'shipping_update'}
        response = self.client.post('/api/messaging/send-demo/', data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message_id'], 'demo-456')
        self.assertEqual(response.data['type'], 'shipping_update')
        
        # Verify the message data structure
        call_args = mock_send_message.call_args[0][0]
        self.assertEqual(call_args['message']['template'], 'shipping-update-template')
        self.assertEqual(call_args['message']['data']['tracking_number'], 'TRK-67890')
        self.assertEqual(call_args['message']['data']['status'], 'Shipped')
    
    @patch('config.courier_client.CourierAPIClient.send_message')
    def test_send_demo_notification_general(self, mock_send_message):
        """Test sending general demo notification."""
        mock_send_message.return_value = {'requestId': 'demo-789'}
        
        data = {'type': 'general'}
        response = self.client.post('/api/messaging/send-demo/', data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message_id'], 'demo-789')
        self.assertEqual(response.data['type'], 'general')
        
        # Verify the message data structure
        call_args = mock_send_message.call_args[0][0]
        self.assertEqual(call_args['message']['template'], 'general-notification-template')
        self.assertIn('This is a demo notification', call_args['message']['data']['message'])
    
    @patch('config.courier_client.CourierAPIClient.send_message')
    def test_send_demo_notification_default_type(self, mock_send_message):
        """Test sending demo notification with default type."""
        mock_send_message.return_value = {'requestId': 'demo-default'}
        
        response = self.client.post('/api/messaging/send-demo/', {}, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['type'], 'general')
    
    @patch('config.courier_client.CourierAPIClient.send_message')
    def test_send_demo_notification_courier_error(self, mock_send_message):
        """Test demo notification sending when Courier API fails."""
        mock_send_message.side_effect = Exception('Courier API error')
        
        data = {'type': 'order_confirmation'}
        response = self.client.post('/api/messaging/send-demo/', data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertIn('Failed to send demo notification', response.data['error'])
    
    def test_send_demo_notification_unauthenticated(self):
        """Test demo notification sending without authentication."""
        self.client.credentials()  # Remove authentication
        
        data = {'type': 'order_confirmation'}
        response = self.client.post('/api/messaging/send-demo/', data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
