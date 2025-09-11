import jwt
import requests
from datetime import datetime, timedelta
from django.conf import settings


def generate_courier_jwt(user_id, scopes=None):
    """
    Generate a JWT token for Courier authentication with the correct scopes.
    
    Args:
        user_id (str): The user ID for Courier
        scopes (list): List of scopes to include in the token
    
    Returns:
        str: JWT token
    """
    if scopes is None:
        scopes = ['user_id:{}'.format(user_id), 'tenants:read']
    
    # Calculate expiration time (30 days to match Courier API reference)
    exp_time = datetime.utcnow() + timedelta(days=30)
    
    # Create payload
    payload = {
        'sub': user_id,
        'iss': 'basic-demo-backend',
        'aud': 'courier',
        'exp': exp_time,
        'iat': datetime.utcnow(),
        'scope': ' '.join(scopes)
    }
    
    # Generate token
    token = jwt.encode(
        payload,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM
    )
    
    return token


def generate_inbox_jwt(user_id):
    """
    Generate JWT token specifically for Courier Inbox access using Courier's API.
    
    Args:
        user_id (str): The user ID for Courier
    
    Returns:
        str: JWT token from Courier API
    """
    api_key = getattr(settings, 'COURIER_API_KEY', None)
    if not api_key:
        raise ValueError("COURIER_API_KEY not configured")
    
    tenant_id = getattr(settings, 'COURIER_TENANT_ID', None)
    if not tenant_id:
        raise ValueError("COURIER_TENANT_ID not configured")
    
    scopes = [
        'user_id:{}'.format(user_id),
        'tenants:read',
        'tenants:notifications:read',
        'tenants:notifications:write',
        'tenant:{}:read'.format(tenant_id),
        'tenant:{}:notification:read'.format(tenant_id),
        'tenant:{}:notification:write'.format(tenant_id)
    ]
    
    url = "https://api.courier.com/auth/issue-token"
    payload = {
        "scope": " ".join(scopes),
        "expires_in": "30 days",
        "tenant_id": tenant_id
    }
    
    headers = {
        "Accept": "application/json",
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    response = requests.post(url, json=payload, headers=headers)
    response.raise_for_status()
    result = response.json()
    
    return result.get('token')


def generate_create_jwt(user_id, brand_id=None):
    """
    Generate JWT token for Courier Create template designer access using Courier's API.
    
    Args:
        user_id (str): The user ID for Courier
        brand_id (str, optional): Specific brand ID for restricted access
    
    Returns:
        str: JWT token from Courier API
    """
    api_key = getattr(settings, 'COURIER_API_KEY', None)
    if not api_key:
        raise ValueError("COURIER_API_KEY not configured")
    
    tenant_id = getattr(settings, 'COURIER_TENANT_ID', None)
    if not tenant_id:
        raise ValueError("COURIER_TENANT_ID not configured")
    
    scopes = [
        'user_id:{}'.format(user_id),
        'tenants:read',
        'tenants:notifications:read',
        'tenants:notifications:write',
        'tenants:brand:read',
        'tenant:{}:read'.format(tenant_id),
        'tenant:{}:notification:read'.format(tenant_id),
        'tenant:{}:notification:write'.format(tenant_id),
        'tenant:{}:brand:read'.format(tenant_id),
        'tenant:{}:brand:write'.format(tenant_id)
    ]
    
    if brand_id:
        scopes.extend([
            'read:brands:{}'.format(brand_id),
            'write:brands:{}'.format(brand_id)
        ])
    
    url = "https://api.courier.com/auth/issue-token"
    payload = {
        "scope": " ".join(scopes),
        "expires_in": "30 days",
        "tenant_id": tenant_id
    }
    
    headers = {
        "Accept": "application/json",
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    response = requests.post(url, json=payload, headers=headers)
    response.raise_for_status()
    result = response.json()
    
    return result.get('token')


def verify_courier_jwt(token):
    """
    Verify and decode a Courier JWT token.
    
    Args:
        token (str): JWT token to verify
    
    Returns:
        dict: Decoded payload if valid, None if invalid
    """
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
            audience='courier'
        )
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
