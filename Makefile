# Makefile for DrishtiAI

.PHONY: help install dev build deploy clean

help:
	@echo "DrishtiAI - Smart Vision Assistant"
	@echo "================================="
	@echo "Available commands:"
	@echo "  make install      - Install all dependencies"
	@echo "  make dev          - Start development servers"
	@echo "  make build        - Build for production"
	@echo "  make docker-build - Build Docker images"
	@echo "  make docker-up    - Start Docker containers"
	@echo "  make docker-down  - Stop Docker containers"
	@echo "  make test         - Run all tests"
	@echo "  make clean        - Clean build artifacts"

install:
	@echo "Installing dependencies..."
	cd backend && npm install
	cd ../frontend && npm install
	cd ../ai-service && pip install -r requirements.txt
	cd ../mobile-app && npm install

dev:
	@echo "Starting development servers..."
	cd backend && npm run dev &
	cd ../ai-service && python app.py &
	cd ../frontend && npm start

build:
	@echo "Building for production..."
	cd backend && npm run build
	cd ../frontend && npm run build
	@echo "Build complete!"

docker-build:
	@echo "Building Docker images..."
	docker-compose build

docker-up:
	@echo "Starting Docker containers..."
	docker-compose up -d
	docker-compose ps

docker-down:
	@echo "Stopping Docker containers..."
	docker-compose down

test:
	@echo "Running tests..."
	cd backend && npm test
	cd ../frontend && npm test

clean:
	@echo "Cleaning build artifacts..."
	rm -rf backend/dist backend/node_modules
	rm -rf frontend/dist frontend/build frontend/node_modules
	rm -rf ai-service/__pycache__ ai-service/venv
	rm -rf mobile-app/node_modules

format:
	@echo "Formatting code..."
	cd backend && npx prettier --write "src/**/*.js"
	cd ../frontend && npx prettier --write "src/**/*.jsx"

lint:
	@echo "Linting code..."
	cd backend && npx eslint src/
	cd ../frontend && npx eslint src/

db-reset:
	@echo "Resetting database..."
	mongo drishti --eval "db.dropDatabase()"
	@echo "Database reset complete!"

logs:
	@echo "Viewing Docker logs..."
	docker-compose logs -f

.DEFAULT_GOAL := help
