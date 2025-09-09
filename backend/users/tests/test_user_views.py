from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from unittest.mock import patch, Mock
import json

User = get_user_model()


class UserModelTestCase(TestCase):
    """Test cases for the DemoUser model."""
    
    def setUp(self):
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'first_name': 'Test',
            'last_name': 'User',
            'password': 'testpass123',
            'phone_number': '+1234567890',
            'preferred_language': 'en',
            'courier_user_id': 'demo_user_testuser'
        }
    
    def test_create_user(self):
        """Test creating a user with all required fields."""
        user = User.objects.create_user(**self.user_data)
        self.assertEqual(user.username, 'testuser')
        self.assertEqual(user.email, 'test@example.com')
        self.assertEqual(user.courier_user_id, 'demo_user_testuser')
        self.assertTrue(user.check_password('testpass123'))
    
    def test_user_str_representation(self):
        """Test the string representation of a user."""
        user = User.objects.create_user(**self.user_data)
        self.assertEqual(str(user), 'testuser (demo_user_testuser)')
    
    def test_user_required_fields(self):
        """Test that required fields are enforced."""
        with self.assertRaises(ValueError):
            User.objects.create_user(username='', email='test@example.com')


class UserRegistrationTestCase(APITestCase):
    """Test cases for user registration API."""
    
    def setUp(self):
        self.registration_url = reverse('user-register')
        self.valid_data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'first_name': 'New',
            'last_name': 'User',
            'password': 'newpass123',
            'password_confirm': 'newpass123',
            'phone_number': '+1234567890',
            'preferred_language': 'en'
        }
    
    @patch('config.courier_client.CourierAPIClient.create_user')
    def test_successful_registration(self, mock_create_user):
        """Test successful user registration."""
        mock_create_user.return_value = {'id': 'demo_user_newuser'}
        
        response = self.client.post(self.registration_url, self.valid_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('user', response.data)
        self.assertIn('token', response.data)
        self.assertEqual(response.data['user']['username'], 'newuser')
    
    def test_registration_password_mismatch(self):
        """Test registration with mismatched passwords."""
        invalid_data = self.valid_data.copy()
        invalid_data['password_confirm'] = 'differentpass'
        
        response = self.client.post(self.registration_url, invalid_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Passwords don\'t match', str(response.data))
    
    def test_registration_missing_fields(self):
        """Test registration with missing required fields."""
        incomplete_data = {
            'username': 'incomplete',
            'email': 'incomplete@example.com'
        }
        
        response = self.client.post(self.registration_url, incomplete_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    @patch('config.courier_client.CourierAPIClient.create_user')
    def test_registration_courier_failure(self, mock_create_user):
        """Test registration when Courier user creation fails."""
        mock_create_user.side_effect = Exception('Courier API Error')
        
        response = self.client.post(self.registration_url, self.valid_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Failed to create Courier user', str(response.data))


class UserLoginTestCase(APITestCase):
    """Test cases for user login API."""
    
    def setUp(self):
        self.login_url = reverse('user-login')
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            courier_user_id='demo_user_testuser'
        )
    
    def test_successful_login(self):
        """Test successful user login."""
        login_data = {
            'username': 'testuser',
            'password': 'testpass123'
        }
        
        response = self.client.post(self.login_url, login_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('user', response.data)
        self.assertIn('token', response.data)
        self.assertEqual(response.data['user']['username'], 'testuser')
    
    def test_login_invalid_credentials(self):
        """Test login with invalid credentials."""
        login_data = {
            'username': 'testuser',
            'password': 'wrongpassword'
        }
        
        response = self.client.post(self.login_url, login_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Invalid credentials', str(response.data))
    
    def test_login_missing_fields(self):
        """Test login with missing fields."""
        incomplete_data = {'username': 'testuser'}
        
        response = self.client.post(self.login_url, incomplete_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class UserProfileTestCase(APITestCase):
    """Test cases for user profile API."""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            courier_user_id='demo_user_testuser'
        )
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        self.profile_url = reverse('user-profile')
    
    def test_get_profile(self):
        """Test retrieving user profile."""
        response = self.client.get(self.profile_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'testuser')
        self.assertIn('inbox_jwt', response.data)
        self.assertIn('create_jwt', response.data)
    
    @patch('config.courier_client.CourierAPIClient.update_user_profile')
    def test_update_profile(self, mock_update_profile):
        """Test updating user profile."""
        mock_update_profile.return_value = {'id': 'demo_user_testuser'}
        
        update_data = {
            'first_name': 'Updated',
            'last_name': 'Name',
            'phone_number': '+9876543210'
        }
        
        response = self.client.patch(self.profile_url, update_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['first_name'], 'Updated')
    
    def test_profile_unauthorized(self):
        """Test accessing profile without authentication."""
        self.client.credentials()
        response = self.client.get(self.profile_url)
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class JWTGenerationTestCase(TestCase):
    """Test cases for JWT token generation."""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            courier_user_id='demo_user_testuser'
        )
    
    def test_inbox_jwt_generation(self):
        """Test JWT generation for inbox access."""
        from config.jwt_utils import generate_inbox_jwt
        
        jwt_token = generate_inbox_jwt(self.user.courier_user_id)
        
        self.assertIsInstance(jwt_token, str)
        self.assertTrue(len(jwt_token) > 0)
    
    def test_create_jwt_generation(self):
        """Test JWT generation for create access."""
        from config.jwt_utils import generate_create_jwt
        
        jwt_token = generate_create_jwt(self.user.courier_user_id)
        
        self.assertIsInstance(jwt_token, str)
        self.assertTrue(len(jwt_token) > 0)
    
    def test_jwt_verification(self):
        """Test JWT token verification."""
        from config.jwt_utils import generate_courier_jwt, verify_courier_jwt
        
        jwt_token = generate_courier_jwt(self.user.courier_user_id)
        payload = verify_courier_jwt(jwt_token)
        
        self.assertIsNotNone(payload)
        self.assertEqual(payload['sub'], self.user.courier_user_id)


class UserViewsIntegrationTestCase(APITestCase):
    """Integration tests for user views."""
    
    @patch('config.courier_client.CourierAPIClient.create_user')
    def test_full_user_lifecycle(self, mock_create_user):
        """Test complete user lifecycle: register -> login -> profile -> logout."""
        mock_create_user.return_value = {'id': 'demo_user_lifecycle'}
        
        # 1. Register user
        registration_data = {
            'username': 'lifecycle',
            'email': 'lifecycle@example.com',
            'first_name': 'Life',
            'last_name': 'Cycle',
            'password': 'lifecycle123',
            'password_confirm': 'lifecycle123',
            'phone_number': '+1111111111',
            'preferred_language': 'en'
        }
        
        register_response = self.client.post('/api/users/register/', registration_data, format='json')
        self.assertEqual(register_response.status_code, status.HTTP_201_CREATED)
        
        token = register_response.data['token']
        
        # 2. Login user
        login_data = {
            'username': 'lifecycle',
            'password': 'lifecycle123'
        }
        
        login_response = self.client.post('/api/users/login/', login_data, format='json')
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        
        # 3. Get profile
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token}')
        profile_response = self.client.get('/api/users/profile/')
        self.assertEqual(profile_response.status_code, status.HTTP_200_OK)
        
        # 4. Logout
        logout_response = self.client.post('/api/users/logout/')
        self.assertEqual(logout_response.status_code, status.HTTP_200_OK)
        
        # 5. Verify logout worked
        profile_response_after_logout = self.client.get('/api/users/profile/')
        self.assertEqual(profile_response_after_logout.status_code, status.HTTP_401_UNAUTHORIZED)