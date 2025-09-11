"""
Courier API client using the official trycourier SDK.
"""
import logging
import requests
from typing import Dict, Any, Optional
from django.conf import settings
from decouple import config
import courier
from courier.client import Courier

logger = logging.getLogger(__name__)


class CourierAPIClient:
    """
    Courier API client using the official trycourier SDK.
    """
    
    def __init__(self):
        """Initialize the Courier client with API key from settings."""
        self.api_key = config('COURIER_API_KEY', default='')
        
        if not self.api_key:
            logger.warning("Courier API key not configured. Courier features will be disabled.")
            self.client = None
            return
            
        try:
            self.client = Courier(authorization_token=self.api_key)
            logger.info("✅ Courier API key configured. Courier features enabled.")
        except Exception as e:
            logger.error(f"Failed to initialize Courier client: {e}")
            self.client = None
    
    def is_available(self) -> bool:
        """Check if Courier client is available and configured."""
        return self.client is not None
    
    def create_user(self, user_id: str, email: str, name: str = None) -> Dict[str, Any]:
        """
        Create a user in Courier.
        
        Args:
            user_id (str): Unique user identifier
            email (str): User's email address
            name (str, optional): User's display name
        
        Returns:
            dict: User creation response
        """
        if not self.client:
            raise ValueError("Courier client not available")
        
        try:
            # Create user profile
            profile_data = {
                "email": email,
                "name": name or email.split('@')[0]
            }
            
            response = self.client.profiles.replace(
                user_id=user_id,
                profile=profile_data
            )
            
            logger.info(f"Created Courier user: {user_id}")
            return {"success": True, "user_id": user_id}
            
        except Exception as e:
            logger.error(f"Failed to create Courier user {user_id}: {e}")
            raise
    
    def update_user_profile(self, user_id: str, profile_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update user profile in Courier.
        
        Args:
            user_id (str): User identifier
            profile_data (dict): Profile data to update
        
        Returns:
            dict: Update response
        """
        if not self.client:
            raise ValueError("Courier client not available")
        
        try:
            response = self.client.profiles.replace(
                user_id=user_id,
                profile=profile_data
            )
            
            logger.info(f"Updated Courier user profile: {user_id}")
            return {"success": True, "user_id": user_id}
            
        except Exception as e:
            logger.error(f"Failed to update Courier user profile {user_id}: {e}")
            raise
    
    def send_notification(self, user_id: str, template_id: str, data: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Send a notification using Courier.
        
        Args:
            user_id (str): Recipient user ID
            template_id (str): Template ID to use
            data (dict, optional): Template data
        
        Returns:
            dict: Send response
        """
        if not self.client:
            raise ValueError("Courier client not available")
        
        try:
            response = self.client.send(
                message=courier.ContentMessage(
                    to=courier.UserRecipient(user_id=user_id),
                    template=courier.TemplateMessage(template_id=template_id),
                    data=data or {},
                    routing=courier.Routing(method="all", channels=["inbox", "email"])
                )
            )
            
            logger.info(f"Sent notification to {user_id} using template {template_id}")
            return response
            
        except Exception as e:
            logger.error(f"Failed to send notification to {user_id}: {e}")
            raise
    
    def send_direct_message(self, user_id: str, title: str, body: str, data: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Send a direct message without a template.
        
        Args:
            user_id (str): Recipient user ID
            title (str): Message title
            body (str): Message body
            data (dict, optional): Additional data
        
        Returns:
            dict: Send response
        """
        if not self.client:
            raise ValueError("Courier client not available")
        
        try:
            response = self.client.send(
                message=courier.ContentMessage(
                    to=courier.UserRecipient(user_id=user_id),
                    content=courier.ElementalContentSugar(
                        title=title,
                        body=body
                    ),
                    data=data or {},
                    routing=courier.Routing(method="all", channels=["inbox", "email"])
                )
            )
            
            logger.info(f"Sent direct message to {user_id}: {title}")
            return response
            
        except Exception as e:
            logger.error(f"Failed to send direct message to {user_id}: {e}")
            raise
    
    def get_templates(self) -> Dict[str, Any]:
        """
        Get all templates for the tenant using tenant-specific endpoint.
        
        Returns:
            dict: Templates response
        """
        if not self.api_key:
            raise ValueError("Courier API key not available")
        
        tenant_id = getattr(settings, 'COURIER_TENANT_ID', None)
        if not tenant_id:
            raise ValueError("COURIER_TENANT_ID not configured")
        
        try:
            # Use tenant-specific templates endpoint
            url = f"https://api.courier.com/tenants/{tenant_id}/templates"
            headers = {
                "Authorization": f"Bearer {self.api_key}"
            }
            
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            result = response.json()
            
            return result
            
        except Exception as e:
            logger.error(f"Failed to get templates: {e}")
            # Return empty results instead of failing
            return {'results': [], 'count': 0}
    
    def get_template(self, template_id: str) -> Dict[str, Any]:
        """
        Get a specific template using tenant-specific endpoint.
        
        Args:
            template_id (str): Template ID
        
        Returns:
            dict: Template data
        """
        if not self.api_key:
            raise ValueError("Courier API key not available")
        
        tenant_id = getattr(settings, 'COURIER_TENANT_ID', None)
        if not tenant_id:
            raise ValueError("COURIER_TENANT_ID not configured")
        
        try:
            url = f"https://api.courier.com/tenants/{tenant_id}/templates/{template_id}"
            headers = {
                "Authorization": f"Bearer {self.api_key}"
            }
            
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            result = response.json()
            
            return result
            
        except Exception as e:
            logger.error(f"Failed to get template {template_id}: {e}")
            raise
    
    def create_template(self, template_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a new template using tenant-specific endpoint.
        
        Args:
            template_data (dict): Template data
        
        Returns:
            dict: Created template response
        """
        if not self.api_key:
            raise ValueError("Courier API key not available")
        
        tenant_id = getattr(settings, 'COURIER_TENANT_ID', None)
        if not tenant_id:
            raise ValueError("COURIER_TENANT_ID not configured")
        
        try:
            url = "https://api.courier.com/templates"
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            response = requests.post(url, json=template_data, headers=headers)
            response.raise_for_status()
            result = response.json()
            
            return result
            
        except Exception as e:
            logger.error(f"Failed to create template: {e}")
            raise
    
    def issue_jwt_token(self, scopes: list, expires_in: str = "30 days") -> Dict[str, Any]:
        """
        Issue a JWT token from Courier's API.
        
        Args:
            scopes (list): List of scopes for the token
            expires_in (str): Token expiration time (e.g., "30 days", "24h")
        
        Returns:
            dict: JWT token data
        """
        if not self.api_key:
            raise ValueError("Courier API key not available")
        
        try:
            # Use direct API call since SDK doesn't expose auth endpoints
            import requests
            
            url = "https://api.courier.com/auth/issue-token"
            payload = {
                "scope": " ".join(scopes),
                "expires_in": expires_in
            }
            
            headers = {
                "Accept": "application/json",
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            response = requests.post(url, json=payload, headers=headers)
            response.raise_for_status()
            return response.json()
            
        except Exception as e:
            logger.error(f"Failed to issue JWT token: {e}")
            raise