from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_templates, name='get-templates'),
    path('<str:template_id>/', views.get_template, name='get-template'),
    path('create/', views.create_template, name='create-template'),
    path('<str:template_id>/update/', views.update_template, name='update-template'),
    path('<str:template_id>/delete/', views.delete_template, name='delete-template'),
    path('brands/', views.get_brands, name='get-brands'),
    path('brands/<str:brand_id>/', views.get_brand, name='get-brand'),
]
