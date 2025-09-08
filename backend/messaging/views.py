from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from backend.courier_client import CourierAPIClient
from users.models import DemoUser


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def send_message(request):
    """
    Send a message through Courier.
    """
    courier_client = CourierAPIClient()
    
    try:
        # Get message data from request
        message_data = request.data
        
        # Validate required fields
        required_fields = ['recipient', 'template', 'data']
        for field in required_fields:
            if field not in message_data:
                return Response(
                    {'error': f'Missing required field: {field}'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Send message through Courier
        response = courier_client.send_message(message_data)
        
        return Response({
            'message_id': response.get('requestId'),
            'status': 'sent',
            'message': 'Message sent successfully'
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {'error': f'Failed to send message: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def send_welcome_message(request):
    """
    Send a welcome message to a new user.
    """
    courier_client = CourierAPIClient()
    user = request.user
    
    try:
        message_data = {
            'message': {
                'to': {
                    'user_id': user.courier_user_id
                },
                'template': 'welcome-template',
                'data': {
                    'first_name': user.first_name or user.username,
                    'email': user.email
                }
            }
        }
        
        response = courier_client.send_message(message_data)
        
        return Response({
            'message_id': response.get('requestId'),
            'status': 'sent',
            'message': 'Welcome message sent successfully'
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {'error': f'Failed to send welcome message: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def send_demo_notification(request):
    """
    Send a demo notification to showcase Courier features.
    """
    courier_client = CourierAPIClient()
    user = request.user
    
    try:
        # Get notification type from request
        notification_type = request.data.get('type', 'general')
        
        # Prepare message data based on type
        if notification_type == 'order_confirmation':
            message_data = {
                'message': {
                    'to': {
                        'user_id': user.courier_user_id
                    },
                    'template': 'order-confirmation-template',
                    'data': {
                        'first_name': user.first_name or user.username,
                        'order_number': 'DEMO-12345',
                        'total_amount': '$99.99',
                        'items': ['Demo Product 1', 'Demo Product 2']
                    }
                }
            }
        elif notification_type == 'shipping_update':
            message_data = {
                'message': {
                    'to': {
                        'user_id': user.courier_user_id
                    },
                    'template': 'shipping-update-template',
                    'data': {
                        'first_name': user.first_name or user.username,
                        'tracking_number': 'TRK-67890',
                        'status': 'Shipped',
                        'estimated_delivery': '2024-01-15'
                    }
                }
            }
        else:  # general notification
            message_data = {
                'message': {
                    'to': {
                        'user_id': user.courier_user_id
                    },
                    'template': 'general-notification-template',
                    'data': {
                        'first_name': user.first_name or user.username,
                        'message': 'This is a demo notification from Courier!',
                        'timestamp': '2024-01-10 10:30:00'
                    }
                }
            }
        
        response = courier_client.send_message(message_data)
        
        return Response({
            'message_id': response.get('requestId'),
            'status': 'sent',
            'message': f'{notification_type} notification sent successfully',
            'type': notification_type
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {'error': f'Failed to send demo notification: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_message_templates(request):
    """
    Get available message templates from Courier.
    """
    courier_client = CourierAPIClient()
    
    try:
        templates = courier_client.get_templates()
        
        return Response({
            'templates': templates.get('results', []),
            'count': len(templates.get('results', []))
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {'error': f'Failed to get templates: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_user_messages(request):
    """
    Get user's message history from Courier.
    """
    courier_client = CourierAPIClient()
    user = request.user
    
    try:
        # This would typically use Courier's message history API
        # For demo purposes, we'll return a mock response
        mock_messages = [
            {
                'id': 'msg-001',
                'template': 'welcome-template',
                'status': 'delivered',
                'created_at': '2024-01-10T10:00:00Z',
                'channels': ['email', 'in-app']
            },
            {
                'id': 'msg-002',
                'template': 'order-confirmation-template',
                'status': 'delivered',
                'created_at': '2024-01-10T11:30:00Z',
                'channels': ['email', 'sms']
            }
        ]
        
        return Response({
            'messages': mock_messages,
            'user_id': user.courier_user_id,
            'count': len(mock_messages)
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {'error': f'Failed to get user messages: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
