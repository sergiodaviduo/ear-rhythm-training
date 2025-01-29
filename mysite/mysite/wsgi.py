"""
WSGI config for mysite project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

IS_HEROKU_APP = "DYNO" in os.environ and "CI" not in os.environ

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mysite.settings')

if IS_HEROKU_APP:
    application = get_wsgi_application()
