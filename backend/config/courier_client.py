import requests
from django.conf import settings
from typing import Dict, Any, Optional


class CourierAPIClient:
    """
    Client for interacting with Courier's API.
    """
    
    def __init__(self):
        self.api_key = getattr(settings, 'COURIER_API_KEY', None)
        self.base_url = "https://api.courier.com"
        self.headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json'
        }
        
        # Check if we have valid credentials
        if not self.api_key or self.api_key == 'your_courier_api_key_here':
            self.api_key = None
            print("Warning: Courier API key not configured. Courier features will be disabled.")
        else:
            print("✅ Courier API key configured. Courier features enabled.")
    
    def is_available(self) -> bool:
        """Check if Courier API is available (has valid credentials)."""
        return self.api_key is not None
    
    def create_user(self, user_id: str, profile: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create or update a user in Courier.
        
        Args:
            user_id (str): Unique identifier for the user
            profile (dict): User profile data
        
        Returns:
            dict: API response
        """
        url = f"{self.base_url}/users/{user_id}"
        data = {
            'profile': profile
        }
        
        response = requests.put(url, json=data, headers=self.headers)
        response.raise_for_status()
        
        # Handle 204 No Content responses
        if response.status_code == 204:
            return {'user_id': user_id, 'status': 'created'}
        
        return response.json()
    
    def send_message(self, message: Dict[str, Any]) -> Dict[str, Any]:
        """
        Send a message through Courier.
        
        Args:
            message (dict): Message data including recipient, template, and data
        
        Returns:
            dict: API response with message ID
        """
        url = f"{self.base_url}/send"
        
        response = requests.post(url, json=message, headers=self.headers)
        response.raise_for_status()
        return response.json()
    
    def get_user_profile(self, user_id: str) -> Dict[str, Any]:
        """
        Get user profile from Courier.
        
        Args:
            user_id (str): User identifier
        
        Returns:
            dict: User profile data
        """
        url = f"{self.base_url}/users/{user_id}"
        
        response = requests.get(url, headers=self.headers)
        response.raise_for_status()
        return response.json()
    
    def update_user_profile(self, user_id: str, profile: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update user profile in Courier.
        
        Args:
            user_id (str): User identifier
            profile (dict): Updated profile data
        
        Returns:
            dict: API response
        """
        url = f"{self.base_url}/users/{user_id}"
        data = {
            'profile': profile
        }
        
        response = requests.patch(url, json=data, headers=self.headers)
        response.raise_for_status()
        
        # Handle 204 No Content responses
        if response.status_code == 204:
            return {'user_id': user_id, 'status': 'updated'}
        
        return response.json()
    
    def get_templates(self) -> Dict[str, Any]:
        """
        Get all templates from Courier.
        
        Returns:
            dict: Templates data
        """
        url = f"{self.base_url}/templates"
        
        response = requests.get(url, headers=self.headers)
        response.raise_for_status()
        return response.json()
    
    def get_template(self, template_id: str) -> Dict[str, Any]:
        """
        Get a specific template from Courier.
        
        Args:
            template_id (str): Template identifier
        
        Returns:
            dict: Template data
        """
        url = f"{self.base_url}/templates/{template_id}"
        
        response = requests.get(url, headers=self.headers)
        response.raise_for_status()
        return response.json()
    
    def create_template(self, template_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a new template in Courier.
        
        Args:
            template_data (dict): Template data
        
        Returns:
            dict: API response with template ID
        """
        url = f"{self.base_url}/templates"
        
        response = requests.post(url, json=template_data, headers=self.headers)
        response.raise_for_status()
        return response.json()
    
    def update_template(self, template_id: str, template_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update an existing template in Courier.
        
        Args:
            template_id (str): Template identifier
            template_data (dict): Updated template data
        
        Returns:
            dict: API response
        """
        url = f"{self.base_url}/templates/{template_id}"
        
        response = requests.put(url, json=template_data, headers=self.headers)
        response.raise_for_status()
        return response.json()
    
    def delete_template(self, template_id: str) -> Dict[str, Any]:
        """
        Delete a template from Courier.
        
        Args:
            template_id (str): Template identifier
        
        Returns:
            dict: API response
        """
        url = f"{self.base_url}/templates/{template_id}"
        
        response = requests.delete(url, headers=self.headers)
        response.raise_for_status()
        return response.json()
    
    def get_brands(self) -> Dict[str, Any]:
        """
        Get all brands from Courier.
        
        Returns:
            dict: Brands data
        """
        url = f"{self.base_url}/brands"
        
        response = requests.get(url, headers=self.headers)
        response.raise_for_status()
        return response.json()
    
    def get_brand(self, brand_id: str) -> Dict[str, Any]:
        """
        Get a specific brand from Courier.
        
        Args:
            brand_id (str): Brand identifier
        
        Returns:
            dict: Brand data
        """
        url = f"{self.base_url}/brands/{brand_id}"
        
        response = requests.get(url, headers=self.headers)
        response.raise_for_status()
        return response.json()
    
    def create_brand(self, brand_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a new brand in Courier.
        
        Args:
            brand_data (dict): Brand data
        
        Returns:
            dict: API response with brand ID
        """
        url = f"{self.base_url}/brands"
        
        response = requests.post(url, json=brand_data, headers=self.headers)
        response.raise_for_status()
        return response.json()
    
    def update_brand(self, brand_id: str, brand_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update an existing brand in Courier.
        
        Args:
            brand_id (str): Brand identifier
            brand_data (dict): Updated brand data
        
        Returns:
            dict: API response
        """
        url = f"{self.base_url}/brands/{brand_id}"
        
        response = requests.put(url, json=brand_data, headers=self.headers)
        response.raise_for_status()
        return response.json()
