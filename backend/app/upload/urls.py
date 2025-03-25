from django.urls import path # type: ignore
from . import views

urlpatterns = [
    path('', views.upload_file, name='upload_file'),  # Maps the root of /upload/ to the upload_file view
    path('visualize/', views.visualize_data, name='visualize_following')
]
