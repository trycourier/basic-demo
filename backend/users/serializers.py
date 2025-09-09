from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import DemoUser
from config.courier_client import CourierAPIClient
from config.jwt_utils import generate_inbox_jwt, generate_create_jwt


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration.
    Creates both local user and Courier user profile.
    """
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = DemoUser
        fields = [
            'username', 'email', 'first_name', 'last_name',
            'password', 'password_confirm', 'phone_number', 'preferred_language'
        ]
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs
    
    def create(self, validated_data):
        # Remove password_confirm from validated_data
        validated_data.pop('password_confirm')
        
        # Create Courier user ID
        courier_user_id = f"demo_user_{validated_data['username']}"
        
        # Create local user
        user = DemoUser.objects.create_user(
            courier_user_id=courier_user_id,
            **validated_data
        )
        
        # Create user profile in Courier
        courier_client = CourierAPIClient()
        courier_profile = {
            'email': user.email,
            'phone_number': user.phone_number,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'preferred_language': user.preferred_language,
        }
        
        try:
            courier_client.create_user(courier_user_id, courier_profile)
        except Exception as e:
            # If Courier creation fails, check if we're in development mode
            from django.conf import settings
            if not courier_client.is_available():
                # Courier not available, just log the warning
                print(f"Warning: Courier integration disabled - no API credentials configured")
            else:
                # If Courier creation fails in production, delete local user
                user.delete()
                raise serializers.ValidationError(f"Failed to create Courier user: {str(e)}")
        
        return user


class UserLoginSerializer(serializers.Serializer):
    """
    Serializer for user login.
    """
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError('Invalid credentials')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled')
            attrs['user'] = user
        else:
            raise serializers.ValidationError('Must include username and password')
        
        return attrs


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for user profile data.
    """
    inbox_jwt = serializers.SerializerMethodField()
    create_jwt = serializers.SerializerMethodField()
    
    class Meta:
        model = DemoUser
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'phone_number', 'preferred_language', 'courier_user_id',
            'created_at', 'updated_at', 'inbox_jwt', 'create_jwt'
        ]
        read_only_fields = ['id', 'courier_user_id', 'created_at', 'updated_at']
    
    def get_inbox_jwt(self, obj):
        """Generate JWT token for Courier Inbox access."""
        return generate_inbox_jwt(obj.courier_user_id)
    
    def get_create_jwt(self, obj):
        """Generate JWT token for Courier Create access."""
        return generate_create_jwt(obj.courier_user_id)


class UserUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating user profile.
    Updates both local and Courier profiles.
    """
    
    class Meta:
        model = DemoUser
        fields = [
            'email', 'first_name', 'last_name',
            'phone_number', 'preferred_language'
        ]
    
    def update(self, instance, validated_data):
        # Update local user
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update Courier profile
        courier_client = CourierAPIClient()
        courier_profile = {
            'email': instance.email,
            'phone_number': instance.phone_number,
            'first_name': instance.first_name,
            'last_name': instance.last_name,
            'preferred_language': instance.preferred_language,
        }
        
        try:
            courier_client.update_user_profile(instance.courier_user_id, courier_profile)
        except Exception as e:
            # Log error but don't fail the update
            print(f"Failed to update Courier profile: {str(e)}")
        
        return instance
