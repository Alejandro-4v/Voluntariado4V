.PHONY: up down restart build shell start stop install clean load-mock-data load-db init

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

generate-keys:
	@echo "$(BLUE)Generating JWT keys$(RESET)"
	docker exec php mkdir -p config/jwt
	docker exec php openssl genpkey -out config/jwt/private.pem -aes256 -algorithm rsa -pkeyopt rsa_keygen_bits:4096 -pass pass:2e414ac83c14890447ec817d3b8f067f0f4d0082b9947534e27c875c0d37cacd
	docker exec php openssl pkey -in config/jwt/private.pem -out config/jwt/public.pem -pubout -passin pass:2e414ac83c14890447ec817d3b8f067f0f4d0082b9947534e27c875c0d37cacd
	@echo "$(GREEN)Keys generated$(RESET)"

load-db:
	@echo "$(BLUE)Loading database scripts$(RESET)"
	docker compose exec -T -e MYSQL_PWD=root mysql mysql -u root API --default-character-set=utf8mb4 < db_scripts/init.sql
	docker compose exec -T -e MYSQL_PWD=root mysql mysql -u root API --default-character-set=utf8mb4 < db_scripts/mock_populate.sql
	@echo "$(GREEN)Database scripts loaded$(RESET)"

init: install generate-keys load-db
	@echo "$(GREEN)Initialization complete$(RESET)"