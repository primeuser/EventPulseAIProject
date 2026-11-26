### 2. Backend Setup (Django)
Create and activate a virtual environment, install dependencies, and run database migrations:

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install django djangorestframework django-cors-headers

# Apply migrations and start the development server
python manage.py makemigrations EventPulseAIapp
python manage.py migrate
python manage.py runserver
# EventPulse AI

A full-stack event and session scheduling app that helps organizers build agendas and catch scheduling problems before they happen.

![Screenshot](docs/events.png)
![Analyzer](docs/analyzer.png)

## What It Does
- **Events and nested sessions:** create events (title, description, location, dates) and add speaker sessions directly under each one, with the UI updating instantly.
- **Schedule Analyzer** (`/events/<id>/analyze/`): checks an agenda for
  - overlapping sessions
  - speaker double-bookings
  - sessions outside the event's dates
  
  It returns a schedule health score, conflict and warning lists, and a plain-English summary. Gemini (`gemini-2.5-flash`) writes the summary when an API key is set; otherwise a rule-based fallback is used, so the app works without one.

## Tech Stack
- **Backend:** Python, Django, Django REST Framework, django-cors-headers, SQLite, optional google-genai
- **Frontend:** React, Vite, JavaScript (Fetch API)

## Project Structure
- `EventPulseAIapp`: models, serializers, API views, analyzer logic
- `core`: Django project settings
- `client`: React + Vite frontend

## Run Locally
**Backend**
1. `python -m venv venv && source venv/bin/activate`
2. `pip install -r requirements.txt`
3. `python manage.py migrate`
4. `python manage.py runserver` (http://127.0.0.1:8000)

**Frontend**
1. `cd client && npm install`
2. `npm run dev` (http://localhost:5173)

**Optional AI summaries:** set `GEMINI_API_KEY` in your environment.

## Roadmap
- [Deploy a live demo, add unit tests for the analyzer, add auth]
