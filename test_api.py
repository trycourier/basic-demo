#!/usr/bin/env python3
"""
Test script for Courier Demo API endpoints
"""

import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_api_endpoints():
    """Test the main API endpoints"""
    
    print("🚀 Testing Courier Demo API Endpoints")
    print("=" * 50)
    
    # Test 1: Check if server is running
    try:
        response = requests.get(f"{BASE_URL}/users/")
        print(f"✅ Server is running (Status: {response.status_code})")
    except requests.exceptions.ConnectionError:
        print("❌ Server is not running. Please start the Django server first.")
        return
    
    # Test 2: Test user registration
    print("\n📝 Testing User Registration...")
    user_data = {
        "username": "testuser",
        "email": "test@example.com",
        "first_name": "Test",
        "last_name": "User",
        "password": "testpass123",
        "password_confirm": "testpass123",
        "phone_number": "+1234567890",
        "preferred_language": "en"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/users/register/", json=user_data)
        if response.status_code == 201:
            print("✅ User registration successful")
            user_info = response.json()
            print(f"   User ID: {user_info['user']['id']}")
            print(f"   Courier User ID: {user_info['user']['courier_user_id']}")
            token = user_info['token']
        else:
            print(f"❌ User registration failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return
    except Exception as e:
        print(f"❌ User registration error: {e}")
        return
    
    # Test 3: Test JWT token generation
    print("\n🔑 Testing JWT Token Generation...")
    headers = {"Authorization": f"Token {token}"}
    
    try:
        response = requests.get(f"{BASE_URL}/users/inbox-jwt/", headers=headers)
        if response.status_code == 200:
            print("✅ Inbox JWT token generated successfully")
            jwt_data = response.json()
            print(f"   JWT Token: {jwt_data['jwt_token'][:50]}...")
        else:
            print(f"❌ Inbox JWT generation failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Inbox JWT error: {e}")
    
    try:
        response = requests.get(f"{BASE_URL}/users/create-jwt/", headers=headers)
        if response.status_code == 200:
            print("✅ Create JWT token generated successfully")
            jwt_data = response.json()
            print(f"   JWT Token: {jwt_data['jwt_token'][:50]}...")
        else:
            print(f"❌ Create JWT generation failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Create JWT error: {e}")
    
    # Test 4: Test message sending
    print("\n📨 Testing Message Sending...")
    
    try:
        response = requests.post(f"{BASE_URL}/messaging/send-welcome/", headers=headers)
        if response.status_code == 200:
            print("✅ Welcome message sent successfully")
            message_data = response.json()
            print(f"   Message ID: {message_data['message_id']}")
        else:
            print(f"❌ Welcome message failed: {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ Welcome message error: {e}")
    
    # Test 5: Test demo notification
    print("\n🔔 Testing Demo Notification...")
    
    try:
        demo_data = {"type": "general"}
        response = requests.post(f"{BASE_URL}/messaging/send-demo/", json=demo_data, headers=headers)
        if response.status_code == 200:
            print("✅ Demo notification sent successfully")
            notification_data = response.json()
            print(f"   Notification Type: {notification_data['type']}")
        else:
            print(f"❌ Demo notification failed: {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ Demo notification error: {e}")
    
    # Test 6: Test user profile
    print("\n👤 Testing User Profile...")
    
    try:
        response = requests.get(f"{BASE_URL}/users/profile/", headers=headers)
        if response.status_code == 200:
            print("✅ User profile retrieved successfully")
            profile_data = response.json()
            print(f"   Username: {profile_data['username']}")
            print(f"   Email: {profile_data['email']}")
        else:
            print(f"❌ User profile failed: {response.status_code}")
    except Exception as e:
        print(f"❌ User profile error: {e}")
    
    print("\n🎉 API Testing Complete!")
    print("=" * 50)

if __name__ == "__main__":
    test_api_endpoints()
