"""
WSGI entry point for production (gunicorn).
Usage: gunicorn wsgi:app --bind 0.0.0.0:$PORT --workers 2 --timeout 300
"""
from app import create_app

app = create_app()
