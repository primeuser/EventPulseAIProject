import React from 'react';

export default function EventList({ events, loading, error }) {
  if (loading) return <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>Loading live events...</div>;
  if (error) return <div style={{ padding: '20px', color: '#991b1b', background: '#fee2e2', borderRadius: '6px' }}>Error loading events: {error}</div>;

  return (
    <div>
      <h3 style={{ margin: '0 0 15px 0', color: '#111827' }}>📋 Upcoming Events ({events.length})</h3>
      {events.length === 0 ? (
        <p style={{ color: '#6b7280', fontStyle: 'italic' }}>No events found. Use the form above to publish your first event!</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {events.map((event) => (
            <li 
              key={event.id} 
              style={{ 
                background: '#ffffff',
                border: '1px solid #e1e4e8', 
                borderRadius: '8px', 
                padding: '20px', 
                marginBottom: '15px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}
            >
              <h4 style={{ margin: '0 0 8px 0', color: '#0366d6', fontSize: '1.1rem' }}>{event.title}</h4>
              <p style={{ color: '#4b5563', margin: '0 0 12px 0', fontSize: '0.95rem' }}>{event.description}</p>
              <div style={{ fontSize: '0.85rem', color: '#6b7280', display: 'flex', gap: '15px' }}>
                <span>📍 <strong>Location:</strong> {event.location}</span>
                <span>🕒 <strong>Starts:</strong> {new Date(event.start_date).toLocaleString()}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}