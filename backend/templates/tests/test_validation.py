from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token

User = get_user_model()


class TemplateValidationTestCase(APITestCase):
    """Test cases for template validation."""
    
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
    
    def test_create_template_missing_name(self):
        """Test template creation with missing name field."""
        template_data = {
            'subject': 'Test Subject',
            'blocks': []
        }
        
        response = self.client.post('/api/templates/create/', template_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Missing required field: name', response.data['error'])
    
    def test_create_template_missing_subject(self):
        """Test template creation with missing subject field."""
        template_data = {
            'name': 'New Template',
            'blocks': []
        }
        
        response = self.client.post('/api/templates/create/', template_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Missing required field: subject', response.data['error'])
    
    def test_create_template_missing_blocks(self):
        """Test template creation with missing blocks field."""
        template_data = {
            'name': 'New Template',
            'subject': 'Test Subject'
        }
        
        response = self.client.post('/api/templates/create/', template_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Missing required field: blocks', response.data['error'])
    
    def test_create_template_unauthenticated(self):
        """Test template creation without authentication."""
        self.client.credentials()  # Remove authentication
        
        template_data = {
            'name': 'New Template',
            'subject': 'Test Subject',
            'blocks': []
        }
        
        response = self.client.post('/api/templates/create/', template_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_get_templates_unauthenticated(self):
        """Test template retrieval without authentication."""
        self.client.credentials()  # Remove authentication
        
        response = self.client.get('/api/templates/')
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_get_template_unauthenticated(self):
        """Test single template retrieval without authentication."""
        self.client.credentials()  # Remove authentication
        
        response = self.client.get('/api/templates/template-1/')
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_update_template_unauthenticated(self):
        """Test template update without authentication."""
        self.client.credentials()  # Remove authentication
        
        template_data = {
            'name': 'Updated Template',
            'subject': 'Updated Subject',
            'blocks': []
        }
        
        response = self.client.put('/api/templates/template-123/update/', template_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_delete_template_unauthenticated(self):
        """Test template deletion without authentication."""
        self.client.credentials()  # Remove authentication
        
        response = self.client.delete('/api/templates/template-123/delete/')
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
