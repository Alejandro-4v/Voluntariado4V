.PHONY: up down restart build shell start stop install clean m-entity m-controller load-mock-data

BLUE := \033[0;34m
RED := \033[0;31m
RESET := \033[0m

up:
	@echo "$(BLUE)Starting containers"
	docker compose --profile api up -d
	@echo "$(GREEN)Containers started"

down:
	@echo "$(BLUE)Stopping containers"
	docker compose down php mysql
	@echo "$(GREEN)Containers stopped"

restart:
	@echo "$(BLUE)Restarting containers"
	docker compose restart
	@echo "$(GREEN)Containers restarted"

build:
	@echo "$(BLUE)Building image"
	docker compose build --no-cache php
	@echo "$(GREEN)Image built"

shell:
	docker exec -it php bash

start:
	@echo "$(BLUE)Starting server$(RESET)"
	docker exec php symfony server:start --daemon --allow-all-ip

log: start
	@echo "$(BLUE)Starting server$(RESET)"
	docker exec php symfony server:log

stop:
	@echo "$(BLUE)Stopping server$(RESET)"
	docker exec php symfony server:stop
	@echo "$(GREEN)Server stopped"

install:
	@echo "$(BLUE)Installing dependencies"
	docker exec php composer install
	@echo "$(GREEN)Dependencies installed"

clean: down
	@echo "$(BLUE)Cleaning Docker resources"
	docker compose down -v --rmi local
	@echo "$(GREEN)Docker resources cleaned"

m-entity:
	docker exec -it php php bin/console make:entity

m-controller:
	docker exec -it php php bin/console make:controller

migrate:
	@echo "$(BLUE)Building migration$(RESET)"
	docker exec -it php php bin/console make:migration
	@echo "$(GREEN)Migration built"
	@echo "$(BLUE)Launching migration to DB"
	docker exec -it php php bin/console doctrine:migrations:migrate
	@echo "$(GREEN)Migrated successfully$(RESET)"

load-mock-data:
	@echo "$(BLUE)Loading mock data$(RESET)"
	docker exec -it php php bin/console app:load-mock-data
	@echo "$(GREEN)Mock data loaded$(RESET)"