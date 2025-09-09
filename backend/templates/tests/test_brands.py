from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from unittest.mock import patch

User = get_user_model()


class BrandTestCase(APITestCase):
    """Test cases for brand functionality."""
    
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
    
    @patch('config.courier_client.CourierAPIClient.get_brands')
    def test_get_brands_success(self, mock_get_brands):
        """Test successful brand retrieval."""
        mock_brands = {
            'results': [
                {'id': 'brand-1', 'name': 'Brand One'},
                {'id': 'brand-2', 'name': 'Brand Two'}
            ]
        }
        mock_get_brands.return_value = mock_brands
        
        response = self.client.get('/api/templates/brands/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['brands']), 2)
        self.assertEqual(response.data['count'], 2)
        self.assertEqual(response.data['brands'][0]['id'], 'brand-1')
        self.assertEqual(response.data['brands'][0]['name'], 'Brand One')
    
    @patch('config.courier_client.CourierAPIClient.get_brands')
    def test_get_brands_empty(self, mock_get_brands):
        """Test brand retrieval with empty results."""
        mock_get_brands.return_value = {'results': []}
        
        response = self.client.get('/api/templates/brands/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['brands']), 0)
        self.assertEqual(response.data['count'], 0)
    
    @patch('config.courier_client.CourierAPIClient.get_brands')
    def test_get_brands_courier_error(self, mock_get_brands):
        """Test brand retrieval when Courier API fails."""
        mock_get_brands.side_effect = Exception('Courier API error')
        
        response = self.client.get('/api/templates/brands/')
        
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertIn('Failed to get brands', response.data['error'])
    
    def test_get_brands_unauthenticated(self):
        """Test brand retrieval without authentication."""
        self.client.credentials()  # Remove authentication
        
        response = self.client.get('/api/templates/brands/')
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    @patch('config.courier_client.CourierAPIClient.get_brand')
    def test_get_brand_success(self, mock_get_brand):
        """Test successful single brand retrieval."""
        mock_brand = {
            'id': 'brand-1',
            'name': 'Brand One',
            'settings': {}
        }
        mock_get_brand.return_value = mock_brand
        
        response = self.client.get('/api/templates/brands/brand-1/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['brand']['id'], 'brand-1')
        self.assertEqual(response.data['brand']['name'], 'Brand One')
        mock_get_brand.assert_called_once_with('brand-1')
    
    @patch('config.courier_client.CourierAPIClient.get_brand')
    def test_get_brand_courier_error(self, mock_get_brand):
        """Test single brand retrieval when Courier API fails."""
        mock_get_brand.side_effect = Exception('Brand not found')
        
        response = self.client.get('/api/templates/brands/nonexistent-brand/')
        
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertIn('Failed to get brand', response.data['error'])
    
    def test_get_brand_unauthenticated(self):
        """Test single brand retrieval without authentication."""
        self.client.credentials()  # Remove authentication
        
        response = self.client.get('/api/templates/brands/brand-1/')
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
