from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import login
from .models import DemoUser
from .serializers import (
    UserRegistrationSerializer,
    UserLoginSerializer,
    UserProfileSerializer,
    UserUpdateSerializer
)


class UserRegistrationView(generics.CreateAPIView):
    """
    Register a new user.
    Creates both local user and Courier user profile.
    """
    queryset = DemoUser.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Create auth token
        token, created = Token.objects.get_or_create(user=user)
        
        # Return user data with token
        user_serializer = UserProfileSerializer(user)
        return Response({
            'user': user_serializer.data,
            'token': token.key
        }, status=status.HTTP_201_CREATED)


class UserLoginView(generics.GenericAPIView):
    """
    Login a user and return authentication token.
    """
    serializer_class = UserLoginSerializer
    permission_classes = [permissions.AllowAny]
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        
        # Create or get auth token
        token, created = Token.objects.get_or_create(user=user)
        
        # Login user
        login(request, user)
        
        # Return user data with token
        user_serializer = UserProfileSerializer(user)
        return Response({
            'user': user_serializer.data,
            'token': token.key
        }, status=status.HTTP_200_OK)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    Retrieve and update user profile.
    """
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return UserProfileSerializer
        return UserUpdateSerializer


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout_view(request):
    """
    Logout user by deleting their token.
    """
    try:
        request.user.auth_token.delete()
        return Response({'message': 'Successfully logged out'}, status=status.HTTP_200_OK)
    except:
        return Response({'error': 'Error logging out'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_inbox_jwt(request):
    """
    Get JWT token for Courier Inbox access.
    """
    from config.jwt_utils import generate_inbox_jwt
    
    user = request.user
    jwt_token = generate_inbox_jwt(user.courier_user_id)
    
    return Response({
        'jwt_token': jwt_token,
        'user_id': user.courier_user_id
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_create_jwt(request):
    """
    Get JWT token for Courier Create access.
    """
    from config.jwt_utils import generate_create_jwt
    
    user = request.user
    jwt_token = generate_create_jwt(user.courier_user_id)
    
    return Response({
        'jwt_token': jwt_token,
        'user_id': user.courier_user_id
    }, status=status.HTTP_200_OK)
