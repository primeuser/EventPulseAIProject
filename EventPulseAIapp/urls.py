from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventViewSet, SessionViewSet
app_name = "EventPulseAIapp"
router = DefaultRouter()
router.register(r'events', EventViewSet, basename='event')
router.register(r'sessions', SessionViewSet, basename='session')

urlpatterns = [
    path('', include(router.urls)),
]

