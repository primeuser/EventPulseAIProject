# serializers.py
from rest_framework import serializers
from .models import Event, Session

class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = ['id', 'event', 'title', 'description', 'speaker_name', 'speaker_bio', 'room', 'start_time', 'end_time', 'tags', 'created_at']
        read_only_fields = ['id', 'created_at']


class EventSerializer(serializers.ModelSerializer):
    # Nested sessions so fetching an event also returns its sessions
    sessions = SessionSerializer(many=True, read_only=True)

    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'location', 'start_date', 'end_date', 'sessions', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']