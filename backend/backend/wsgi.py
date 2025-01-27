import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "settings.production")  # Use production by default for WSGI
application = get_wsgi_application()
