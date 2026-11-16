import React, { useState } from 'react';

export default function SessionForm({ eventId, onSessionCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    speaker: '',
    start_time: '',
    end_time: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // POST request to Django backend sessions endpoint (adjust URL prefix if using /api/)
    fetch('http://127.0.0.1:8000/sessions/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        event: eventId // Links the session to this specific parent event ID
      }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errData) => {
            throw new Error(JSON.stringify(errData));
          });
        }
        return response.json();
      })
      .then((newSession) => {
        setSubmitting(false);
        setFormData({ title: '', speaker: '', start_time: '', end_time: '' });
        if (onSessionCreated) {
          onSessionCreated(newSession);
        }
      })
      .catch((err) => {
        setSubmitting(false);
        setError(err.message);
      });
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      style={{ 
        background: '#f8fafc', 
        border: '1px solid #e2e8f0', 
        borderRadius: '6px', 
        padding: '12px 16px', 
        marginTop: '12px' 
      }}
    >
      <h6 style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
        ➕ Add Session to Event
      </h6>

      {error && (
        <div style={{ color: '#991b1b', background: '#fee2e2', padding: '6px', borderRadius: '4px', fontSize: '0.8rem', marginBottom: '8px' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Session Title (e.g., Keynote)"
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
        />
        <input
          type="text"
          name="speaker"
          value={formData.speaker}
          onChange={handleChange}
          placeholder="Speaker Name"
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
        />
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: '2px' }}>Start Time</label>
          <input
            type="datetime-local"
            name="start_time"
            value={formData.start_time}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: '2px' }}>End Time</label>
          <input
            type="datetime-local"
            name="end_time"
            value={formData.end_time}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        style={{
          background: submitting ? '#9ca3af' : '#0284c7',
          color: 'white',
          border: 'none',
          padding: '6px 12px',
          borderRadius: '4px',
          fontSize: '0.8rem',
          fontWeight: 'bold',
          cursor: submitting ? 'not-allowed' : 'pointer'
        }}
      >
        {submitting ? 'Saving...' : 'Save Session'}
      </button>
    </form>
  );
}