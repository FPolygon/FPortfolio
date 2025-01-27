from .base import TEMPLATES, INSTALLED_APPS, MIDDLEWARE, BASE_DIR, os, REST_FRAMEWORK

# Debug settings
DEBUG = True
TEMPLATES[0]["OPTIONS"]["debug"] = DEBUG

# Development apps
INSTALLED_APPS += [
    "django_extensions",
    "debug_toolbar",
]

# Development middleware
MIDDLEWARE = [
    "debug_toolbar.middleware.DebugToolbarMiddleware",
] + MIDDLEWARE

# CORS settings
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

# Debug Toolbar settings
INTERNAL_IPS = [
    "127.0.0.1",
]

# Email backend for development
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

# Static files
STATICFILES_DIRS = [BASE_DIR / "static"]

# Media files
MEDIA_ROOT = BASE_DIR / "media"

# Disable password validation in development
AUTH_PASSWORD_VALIDATORS = []

# File upload settings
FILE_UPLOAD_MAX_MEMORY_SIZE = 52428800  # 50MB
DATA_UPLOAD_MAX_MEMORY_SIZE = 52428800  # 50MB

# Logging configuration
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
        },
    },
    "root": {
        "handlers": ["console"],
        "level": "INFO",
    },
    "loggers": {
        "django": {
            "handlers": ["console"],
            "level": os.getenv("DJANGO_LOG_LEVEL", "INFO"),
            "propagate": False,
        },
        "django.db.backends": {
            "level": "DEBUG",
            "handlers": ["console"],
        },
    },
}

# Django REST Framework settings for development
REST_FRAMEWORK = {
    **REST_FRAMEWORK,  # Include base settings
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.SessionAuthentication",
        "rest_framework.authentication.BasicAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.AllowAny",
    ],
    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
        "rest_framework.renderers.BrowsableAPIRenderer",
    ],
}

# Cache settings (use local memory cache in development)
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
    }
}

# Session settings
SESSION_ENGINE = "django.contrib.sessions.backends.db"

# Security settings for development (relaxed)
CSRF_COOKIE_SECURE = False
SESSION_COOKIE_SECURE = False
SECURE_SSL_REDIRECT = False
