from django.shortcuts import render

# views.py
from rest_framework import viewsets
from .models import Event, Session
from .serializers import EventSerializer, SessionSerializer

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all().prefetch_related('sessions')
    serializer_class = EventSerializer


class SessionViewSet(viewsets.ModelViewSet):
    queryset = Session.objects.all().select_related('event')
    serializer_class = SessionSerializer