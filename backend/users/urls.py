from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.UserRegistrationView.as_view(), name='user-register'),
    path('login/', views.UserLoginView.as_view(), name='user-login'),
    path('logout/', views.logout_view, name='user-logout'),
    path('profile/', views.UserProfileView.as_view(), name='user-profile'),
    path('inbox-jwt/', views.user_inbox_jwt, name='user-inbox-jwt'),
    path('create-jwt/', views.user_create_jwt, name='user-create-jwt'),
]
