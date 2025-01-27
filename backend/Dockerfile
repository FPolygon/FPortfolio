ARG PYTHON_VERSION=3.11
ARG APP_HOME=/app

# Base stage
FROM python:${PYTHON_VERSION}-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    POETRY_VERSION=1.7.1 \
    POETRY_HOME="/opt/poetry" \
    POETRY_VIRTUALENVS_IN_PROJECT=true \
    POETRY_NO_INTERACTION=1

WORKDIR ${APP_HOME}

# System dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       curl \
       build-essential \
       libpq-dev \
       postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry
RUN curl -sSL https://install.python-poetry.org | python3 -
ENV PATH="${POETRY_HOME}/bin:$PATH"

# Copy only dependency files first
COPY pyproject.toml poetry.lock ./

# Development stage
FROM base AS development
RUN poetry install --no-root --with dev
COPY . .
CMD ["poetry", "run", "python", "manage.py", "runserver", "0.0.0.0:8000"]

# Builder stage
FROM base AS builder
ARG APP_HOME=/app

WORKDIR ${APP_HOME}
RUN mkdir -p ${APP_HOME}

COPY . .

RUN echo "Contents of /app:" && ls -la ${APP_HOME}

ENV DJANGO_SECRET_KEY="dummy_secret_key_for_prod_build"

# Install production dependencies
RUN poetry install --no-root --only main

COPY . .
RUN poetry run python manage.py collectstatic --noinput && ls -la /app

# Debug: ensure .venv is actually there
RUN ls -la /app || echo "/app not found!"

# Production stage
FROM python:${PYTHON_VERSION}-slim AS production
ARG APP_HOME=/app
WORKDIR ${APP_HOME}

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# System dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Copy from builder
COPY --from=builder ${APP_HOME} ${APP_HOME}

# Expose virtualenv path
ENV PATH="${APP_HOME}/.venv/bin:$PATH"

# Entrypoint
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 8000
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "3", "backend.wsgi:application"]
