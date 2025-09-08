from django.urls import path
from . import views

urlpatterns = [
    path('send/', views.send_message, name='send-message'),
    path('send-welcome/', views.send_welcome_message, name='send-welcome'),
    path('send-demo/', views.send_demo_notification, name='send-demo'),
    path('templates/', views.get_message_templates, name='get-templates'),
    path('messages/', views.get_user_messages, name='get-messages'),
]
