import os
from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "settings.production")  # Use production by default for ASGI
application = get_asgi_application()
