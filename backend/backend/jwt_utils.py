import jwt
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
        scopes = ['user_id:{}'.format(user_id), 'read:messages']
    
    # Calculate expiration time
    exp_time = datetime.utcnow() + timedelta(hours=settings.JWT_EXPIRATION_HOURS)
    
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
    Generate JWT token specifically for Courier Inbox access.
    
    Args:
        user_id (str): The user ID for Courier
    
    Returns:
        str: JWT token with inbox scopes
    """
    scopes = [
        'user_id:{}'.format(user_id),
        'read:messages'
    ]
    return generate_courier_jwt(user_id, scopes)


def generate_create_jwt(user_id, brand_id=None):
    """
    Generate JWT token for Courier Create template designer access.
    
    Args:
        user_id (str): The user ID for Courier
        brand_id (str, optional): Specific brand ID for restricted access
    
    Returns:
        str: JWT token with create scopes
    """
    scopes = [
        'user_id:{}'.format(user_id),
        'read:brands',
        'write:brands'
    ]
    
    if brand_id:
        scopes.extend([
            'read:brands:{}'.format(brand_id),
            'write:brands:{}'.format(brand_id)
        ])
    
    return generate_courier_jwt(user_id, scopes)


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
