from django.db import models
from django.contrib.auth.models import AbstractUser


class DemoUser(AbstractUser):
    """
    Extended user model for the Courier demo.
    Stores minimal local data while leveraging Courier for profile management.
    """
    courier_user_id = models.CharField(
        max_length=255,
        unique=True,
        help_text="User ID in Courier system"
    )
    phone_number = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        help_text="Phone number for SMS notifications"
    )
    preferred_language = models.CharField(
        max_length=10,
        default='en',
        help_text="Preferred language for notifications"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'demo_users'
    
    def __str__(self):
        return f"{self.username} ({self.courier_user_id})"
