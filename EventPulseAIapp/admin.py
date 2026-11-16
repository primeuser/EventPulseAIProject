from django.contrib import admin
from .models import Event, Session, AttendeeProfile, SessionFeedback, AIRecommendation

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'location', 'start_date', 'end_date')
    search_fields = ('title', 'location')

@admin.register(Session)
class SessionAdmin(admin.ModelAdmin):
    list_display = ('title', 'event', 'speaker_name', 'start_time', 'room')
    list_filter = ('event', 'start_time')
    search_fields = ('title', 'speaker_name')

@admin.register(AttendeeProfile)
class AttendeeProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'job_title', 'company')
    search_fields = ('user__username', 'user__email', 'company')

@admin.register(SessionFeedback)
class SessionFeedbackAdmin(admin.ModelAdmin):
    list_display = ('session', 'attendee', 'rating', 'sentiment_label', 'created_at')
    list_filter = ('rating', 'sentiment_label')

@admin.register(AIRecommendation)
class AIRecommendationAdmin(admin.ModelAdmin):
    list_display = ('attendee', 'recommended_session', 'match_score', 'created_at')