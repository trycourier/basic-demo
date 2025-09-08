from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from backend.courier_client import CourierAPIClient


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_templates(request):
    """
    Get all templates from Courier.
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
def get_template(request, template_id):
    """
    Get a specific template from Courier.
    """
    courier_client = CourierAPIClient()
    
    try:
        template = courier_client.get_template(template_id)
        
        return Response({
            'template': template
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {'error': f'Failed to get template: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_template(request):
    """
    Create a new template in Courier.
    """
    courier_client = CourierAPIClient()
    
    try:
        template_data = request.data
        
        # Validate required fields
        required_fields = ['name', 'subject', 'blocks']
        for field in required_fields:
            if field not in template_data:
                return Response(
                    {'error': f'Missing required field: {field}'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        response = courier_client.create_template(template_data)
        
        return Response({
            'template_id': response.get('templateId'),
            'status': 'created',
            'message': 'Template created successfully'
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response(
            {'error': f'Failed to create template: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['PUT'])
@permission_classes([permissions.IsAuthenticated])
def update_template(request, template_id):
    """
    Update an existing template in Courier.
    """
    courier_client = CourierAPIClient()
    
    try:
        template_data = request.data
        
        response = courier_client.update_template(template_id, template_data)
        
        return Response({
            'template_id': template_id,
            'status': 'updated',
            'message': 'Template updated successfully'
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {'error': f'Failed to update template: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def delete_template(request, template_id):
    """
    Delete a template from Courier.
    """
    courier_client = CourierAPIClient()
    
    try:
        courier_client.delete_template(template_id)
        
        return Response({
            'template_id': template_id,
            'status': 'deleted',
            'message': 'Template deleted successfully'
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {'error': f'Failed to delete template: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_brands(request):
    """
    Get all brands from Courier.
    """
    courier_client = CourierAPIClient()
    
    try:
        brands = courier_client.get_brands()
        
        return Response({
            'brands': brands.get('results', []),
            'count': len(brands.get('results', []))
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {'error': f'Failed to get brands: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_brand(request, brand_id):
    """
    Get a specific brand from Courier.
    """
    courier_client = CourierAPIClient()
    
    try:
        brand = courier_client.get_brand(brand_id)
        
        return Response({
            'brand': brand
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {'error': f'Failed to get brand: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
