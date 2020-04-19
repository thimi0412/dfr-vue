from django.urls import path, include
from rest_framework import routers

from . import views

routers = routers.DefaultRouter()
routers.register('book', views.BookViewSet)

app_name = 'apiv1'
urlpatterns = [
    path('', include(routers.urls))
]
