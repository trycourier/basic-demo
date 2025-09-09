from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from unittest.mock import patch

User = get_user_model()


class TemplateCRUDTestCase(APITestCase):
    """Test cases for template CRUD operations."""
    
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
    def test_get_templates_success(self, mock_get_templates):
        """Test successful template retrieval."""
        mock_templates = {
            'results': [
                {'id': 'template-1', 'name': 'Welcome Template'},
                {'id': 'template-2', 'name': 'Order Confirmation'}
            ]
        }
        mock_get_templates.return_value = mock_templates
        
        response = self.client.get('/api/templates/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['templates']), 2)
        self.assertEqual(response.data['count'], 2)
        self.assertEqual(response.data['templates'][0]['id'], 'template-1')
    
    @patch('config.courier_client.CourierAPIClient.get_template')
    def test_get_template_success(self, mock_get_template):
        """Test successful single template retrieval."""
        mock_template = {
            'id': 'template-1',
            'name': 'Welcome Template',
            'subject': 'Welcome!',
            'blocks': []
        }
        mock_get_template.return_value = mock_template
        
        response = self.client.get('/api/templates/template-1/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['template']['id'], 'template-1')
        self.assertEqual(response.data['template']['name'], 'Welcome Template')
        mock_get_template.assert_called_once_with('template-1')
    
    @patch('config.courier_client.CourierAPIClient.create_template')
    def test_create_template_success(self, mock_create_template):
        """Test successful template creation."""
        mock_create_template.return_value = {'templateId': 'new-template-123'}
        
        template_data = {
            'name': 'New Template',
            'subject': 'Test Subject',
            'blocks': [
                {
                    'type': 'text',
                    'text': 'Hello {{first_name}}!'
                }
            ]
        }
        
        response = self.client.post('/api/templates/create/', template_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['template_id'], 'new-template-123')
        self.assertEqual(response.data['status'], 'created')
        self.assertEqual(response.data['message'], 'Template created successfully')
        mock_create_template.assert_called_once_with(template_data)
    
    @patch('config.courier_client.CourierAPIClient.update_template')
    def test_update_template_success(self, mock_update_template):
        """Test successful template update."""
        mock_update_template.return_value = {'templateId': 'template-123'}
        
        template_data = {
            'name': 'Updated Template',
            'subject': 'Updated Subject',
            'blocks': []
        }
        
        response = self.client.put('/api/templates/template-123/update/', template_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['template_id'], 'template-123')
        self.assertEqual(response.data['status'], 'updated')
        self.assertEqual(response.data['message'], 'Template updated successfully')
        mock_update_template.assert_called_once_with('template-123', template_data)
    
    @patch('config.courier_client.CourierAPIClient.delete_template')
    def test_delete_template_success(self, mock_delete_template):
        """Test successful template deletion."""
        mock_delete_template.return_value = {'templateId': 'template-123'}
        
        response = self.client.delete('/api/templates/template-123/delete/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['template_id'], 'template-123')
        self.assertEqual(response.data['status'], 'deleted')
        self.assertEqual(response.data['message'], 'Template deleted successfully')
        mock_delete_template.assert_called_once_with('template-123')
