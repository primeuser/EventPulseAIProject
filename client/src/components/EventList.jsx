import React, { useState } from 'react';
import SessionForm from './SessionForm';

export default function EventList({ events, loading, error, onEventUpdated }) {
  const [activeEventId, setActiveEventId] = useState(null);

  if (loading) return <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>Loading live events...</div>;
  if (error) return <div style={{ padding: '20px', color: '#991b1b', background: '#fee2e2', borderRadius: '6px' }}>Error loading events: {error}</div>;

  const handleSessionAdded = (eventId, newSession) => {
    // Update the specific event's sessions array locally without refetching
    const updatedEvents = events.map((ev) => {
      if (ev.id === eventId) {
        const currentSessions = ev.sessions || ev.session_set || [];
        return {
          ...ev,
          sessions: [...currentSessions, newSession]
        };
      }
      return ev;
    });
    if (onEventUpdated) {
      onEventUpdated(updatedEvents);
    }
    setActiveEventId(null); // Close form on success
  };

  return (
    <div>
      <h3 style={{ margin: '0 0 15px 0', color: '#111827' }}>📋 Upcoming Events ({events.length})</h3>
      {events.length === 0 ? (
        <p style={{ color: '#6b7280', fontStyle: 'italic' }}>No events found. Use the form above to publish your first event!</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {events.map((event) => {
            const sessions = event.sessions || event.session_set || [];
            const isAddingSession = activeEventId === event.id;

            return (
              <li 
                key={event.id} 
                style={{ 
                  background: '#ffffff',
                  border: '1px solid #e1e4e8', 
                  borderRadius: '8px', 
                  padding: '20px', 
                  marginBottom: '20px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ margin: '0 0 8px 0', color: '#0366d6', fontSize: '1.15rem' }}>{event.title}</h4>
                    <p style={{ color: '#4b5563', margin: '0 0 12px 0', fontSize: '0.95rem' }}>{event.description}</p>
                  </div>
                  <button
                    onClick={() => setActiveEventId(isAddingSession ? null : event.id)}
                    style={{
                      background: isAddingSession ? '#e5e7eb' : '#f0fdf4',
                      color: isAddingSession ? '#374151' : '#166534',
                      border: '1px solid',
                      borderColor: isAddingSession ? '#d1d5db' : '#bbf7d0',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    {isAddingSession ? 'Cancel' : '+ Add Session'}
                  </button>
                </div>

                <div style={{ fontSize: '0.85rem', color: '#6b7280', display: 'flex', flexWrap: 'wrap', gap: '15px', marginBottom: '16px' }}>
                  <span>📍 <strong>Location:</strong> {event.location}</span>
                  <span>🕒 <strong>Starts:</strong> {new Date(event.start_date).toLocaleString()}</span>
                  {event.end_date && <span>🏁 <strong>Ends:</strong> {new Date(event.end_date).toLocaleString()}</span>}
                </div>

                {/* Nested Sessions Section */}
                <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '14px', marginTop: '10px' }}>
                  <h5 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                    🎤 Event Sessions ({sessions.length})
                  </h5>

                  {sessions.length === 0 && !isAddingSession ? (
                    <p style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: '#9ca3af', fontStyle: 'italic' }}>
                      No sessions scheduled for this event yet.
                    </p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
                      {sessions.map((session) => (
                        <div 
                          key={session.id}
                          style={{
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            borderRadius: '6px',
                            padding: '10px 14px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '8px'
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '0.92rem' }}>{session.title}</div>
                            {session.speaker && <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>👤 Speaker: {session.speaker}</div>}
                          </div>
                          {session.start_time && (
                            <span style={{ fontSize: '0.8rem', background: '#e0f2fe', color: '#0369a1', padding: '4px 8px', borderRadius: '4px', fontWeight: '500' }}>
                              ⏰ {new Date(session.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Toggleable Session Form */}
                  {isAddingSession && (
                    <SessionForm 
                      eventId={event.id} 
                      onSessionCreated={(newSession) => handleSessionAdded(event.id, newSession)} 
                    />
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}