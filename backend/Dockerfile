# Builder stage: Install dependencies and build the application
FROM python:3.11-slim AS builder

# Set build-time arguments and environment variables for Python and Django
ARG DEBIAN_FRONTEND=noninteractive
ARG DJANGO_SECRET_KEY
ARG DJANGO_DEBUG
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    DJANGO_SECRET_KEY=${DJANGO_SECRET_KEY} \
    DJANGO_DEBUG=${DJANGO_DEBUG}

# Set working directory for the build
WORKDIR /app

# Install system build tools and update pip
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    gcc \
    python3-dev \
    libpq-dev \
    postgresql-client && \
    rm -rf /var/lib/apt/lists/* && \
    pip install --upgrade pip setuptools wheel

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn

# Copy the application source code
COPY . .

# Collect static files
RUN mkdir -p staticfiles && \
    python manage.py collectstatic --noinput

# Final stage: Prepare runtime environment
FROM python:3.11-slim

# Set runtime environment variables for Python and Django security
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/backend \
    DJANGO_SECURE_SSL_REDIRECT=True \
    DJANGO_SESSION_COOKIE_SECURE=True \
    DJANGO_CSRF_COOKIE_SECURE=True

# Set working directory for runtime
WORKDIR /backend

# Install runtime dependencies and configure directory structure
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    libpq5 \
    curl && \
    rm -rf /var/lib/apt/lists/* && \
    useradd -m -u 1000 appuser && \
    mkdir -p /backend/staticfiles && \
    chown -R appuser:appuser /backend

# Copy built application and static files from builder stage
COPY --from=builder /usr/local /usr/local
COPY --from=builder /app /backend
COPY --from=builder /app/staticfiles /backend/staticfiles

# Set permissions for application files
RUN chown -R appuser:appuser /backend

# Run application as non-root user
USER appuser

# Add health check for the application
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/api/health/ || exit 1

# Expose the application port
EXPOSE 8000

# Mount volume for static files
VOLUME ["/backend/staticfiles"]

# Create and configure startup script for Gunicorn
RUN echo '#!/bin/sh\n\
WORKERS=$((2 * $(nproc) + 1))\n\
exec gunicorn --bind 0.0.0.0:8000 \\\n\
    --workers $WORKERS \\\n\
    --worker-class gthread \\\n\
    --threads 3 \\\n\
    --timeout 60 \\\n\
    --keep-alive 5 \\\n\
    --max-requests 1000 \\\n\
    --max-requests-jitter 50 \\\n\
    backend.wsgi:application\n'\
    > /backend/start.sh && \
    chmod +x /backend/start.sh

# Define the container's startup command
CMD ["/backend/start.sh"]
