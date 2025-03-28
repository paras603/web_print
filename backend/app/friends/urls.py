from django.urls import path
from . import views

urlpatterns = [
    # path('', views.friends),
    path('visualize/', views.visualize_data, name='visualize_friends_data')
]
