import uuid
from django.db import models
from django.contrib.auth.models import User


class Event(models.Model):
    """
    Core Event model holding event details and metadata.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    description = models.TextField()
    location = models.CharField(max_length=255)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'events'
        ordering = ['-start_date']
        indexes = [
            models.Index(fields=['start_date']),
        ]

    def __str__(self):
        return self.title


class Session(models.Model):
    """
    Individual tracks/sessions within an event.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='sessions')
    title = models.CharField(max_length=255)
    description = models.TextField()
    speaker_name = models.CharField(max_length=150)
    speaker_bio = models.TextField(blank=True, null=True)
    room = models.CharField(max_length=100, blank=True, null=True)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    tags = models.JSONField(default=list, help_text="List of topic tags for AI matching")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'event_sessions'
        ordering = ['start_time']
        indexes = [
            models.Index(fields=['event', 'start_time']),
        ]

    def __str__(self):
        return f"{self.title} ({self.event.title})"


class AttendeeProfile(models.Model):
    """
    Extended user profile for event attendees, storing preferences for AI matching.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='attendee_profile')
    job_title = models.CharField(max_length=150, blank=True, null=True)
    company = models.CharField(max_length=150, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    interests = models.JSONField(default=list, help_text="List of technical interests/topics")
    registered_events = models.ManyToManyField(Event, related_name='attendees', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'attendee_profiles'

    def __str__(self):
        return f"{self.user.get_full_name() or self.user.username} - {self.job_title or 'Attendee'}"


class SessionFeedback(models.Model):
    """
    Feedback submitted by attendees, stored along with AI sentiment analysis outputs.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    session = models.ForeignKey(Session, on_delete=models.CASCADE, related_name='feedbacks')
    attendee = models.ForeignKey(AttendeeProfile, on_delete=models.CASCADE, related_name='feedbacks')
    rating = models.PositiveSmallIntegerField(choices=[(i, str(i)) for i in range(1, 6)])  # 1 to 5 scale
    comment = models.TextField()
    
    # AI Sentiment Analysis Fields (populated asynchronously)
    sentiment_score = models.FloatField(blank=True, null=True)  # e.g., -1.0 to 1.0
    sentiment_label = models.CharField(max_length=50, blank=True, null=True)  # POSITIVE, NEUTRAL, NEGATIVE
    ai_key_takeaways = models.JSONField(default=list, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'session_feedbacks'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['session', 'created_at']),
        ]

    def __str__(self):
        return f"Rating {self.rating}/5 for {self.session.title}"


class AIRecommendation(models.Model):
    """
    Stores pre-generated AI session recommendations for attendees.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    attendee = models.ForeignKey(AttendeeProfile, on_delete=models.CASCADE, related_name='ai_recommendations')
    recommended_session = models.ForeignKey(Session, on_delete=models.CASCADE)
    match_score = models.FloatField(help_text="Match score between 0.0 and 1.0")
    reasoning = models.TextField(help_text="AI explanation for why this session was recommended")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'ai_recommendations'
        ordering = ['-match_score']
        indexes = [
            models.Index(fields=['attendee', 'match_score']),
        ]

    def __str__(self):
        return f"{self.attendee.user.username} -> {self.recommended_session.title} ({self.match_score})"