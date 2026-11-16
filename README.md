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
