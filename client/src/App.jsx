import React, { useState, useEffect } from 'react';
import EventForm from './components/EventForm';
import EventList from './components/EventList';

export default function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all events from Django backend
  const fetchEvents = () => {
    fetch('http://127.0.0.1:8000/events/')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Callback triggered when EventForm successfully posts a new event
  const handleEventCreated = (newEvent) => {
    // Instantly prepend the new event to the top of the list
    setEvents([newEvent, ...events]);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', paddingBottom: '40px', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ background: '#ffffff', padding: '20px 40px', borderBottom: '1px solid #e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#111827' }}>
          🚀 EventPulse AI Dashboard
        </h1>
        <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: '#6b7280' }}>
          Full-Stack Event Management & AI Analytics Platform
        </p>
      </header>
      
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
        {/* Form component receives the callback */}
        <EventForm onEventCreated={handleEventCreated} />

        {/* EventList component receives events, loading, and error states as props */}
        <EventList events={events} loading={loading} error={error} />
      </main>
    </div>
  );
}