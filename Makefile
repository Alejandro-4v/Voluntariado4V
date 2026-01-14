.PHONY: up down restart build shell start stop install clean load-mock-data

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
	docker exec php symfony server:start --daemon --allow-all-ip --port 80
	@echo "$(BLUE)Display the logs using make log$(RESET)"

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

load-mock-data:
	@echo "$(BLUE)Loading mock data$(RESET)"
	docker exec -it php php bin/console app:load-mock-data
	@echo "$(GREEN)Mock data loaded$(RESET)"