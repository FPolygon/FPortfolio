# Variables
DC=docker compose
DC_DEV=$(DC) -f docker-compose.yml -f docker-compose.dev.yml
DC_PROD=$(DC) -f docker-compose.yml -f docker-compose.prod.yml

BACKEND_SERVICE=backend
FRONTEND_SERVICE=frontend

.PHONY: dev-logs-backend

# Development commands
.PHONY: dev-backend
dev-backend:
	$(DC_DEV) up $(BACKEND_SERVICE)

.PHONY: dev-frontend
dev-frontend:
	$(DC_DEV) up $(FRONTEND_SERVICE)

.PHONY: dev-build
dev-build:
	$(DC_DEV) build

.PHONY: dev-up
dev-up:
	$(DC_DEV) up

.PHONY: dev-down
dev-down:
	$(DC_DEV) down

.PHONY: dev
dev: dev-build dev-up

# Production commands
.PHONY: prod-build
prod-build:
	$(DC_PROD) build

.PHONY: prod-up
prod-up:
	$(DC_PROD) up -d

.PHONY: prod-down
prod-down:
	$(DC_PROD) down

.PHONY: prod
prod: prod-build prod-up

# Database commands
.PHONY: migrate
migrate:
	$(DC_DEV) exec $(BACKEND_SERVICE) poetry run python manage.py migrate

.PHONY: makemigrations
migrations:
	$(DC_DEV) exec $(BACKEND_SERVICE) poetry run python manage.py makemigrations

.PHONY: shell
shell:
	$(DC_DEV) exec $(BACKEND_SERVICE) poetry run python manage.py shell

dbshell:
	$(DC_DEV) exec $(BACKEND_SERVICE) poetry run python manage.py dbshell

bash:
	$(DC_DEV) exec $(BACKEND_SERVICE) bash

.PHONY: superuser
superuser:
	$(DC_DEV) exec $(BACKEND_SERVICE) poetry run python manage.py createsuperuser

.PHONY: check
check:
	$(DC_DEV) exec $(BACKEND_SERVICE) poetry run python manage.py check

# Cleanup commands
.PHONY: clean
clean:
	$(DC) down -v --remove-orphans

.PHONY: prune
prune:
	docker system prune -af

.PHONY: restart
restart:
	$(DC_DEV) restart

# Logs
.PHONY: logs
logs:
	$(DC_DEV) logs -f
dev-logs-backend:
	$(DC_DEV) logs -f $(BACKEND_SERVICE)

.PHONY: dev-logs-frontend
dev-logs-frontend:
	$(DC_DEV) logs -f $(FRONTEND_SERVICE)

.PHONY: ps
ps:
	$(DC_DEV) ps

# Tests
.PHONY: test-backend
test-backend:
	$(DC_DEV) exec $(BACKEND_SERVICE) python manage.py test

.PHONY: test-frontend
test-frontend:
	$(DC_DEV) exec $(FRONTEND_SERVICE) npm test
