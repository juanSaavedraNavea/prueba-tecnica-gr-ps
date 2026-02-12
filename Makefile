.PHONY: help install install-back install-front start start-back start-front

help:
	@echo "Usos: make install    # instala back y front"
	@echo "      make start      # ejecuta back y front concurrentemente"

install: install-back install-front

install-back:
	npm install

install-front:
	cd client && npm install

start:
	@echo "Iniciando backend y frontend (concurrently)..."
	npx concurrently "npm run dev" "npm --prefix client run dev"

start-back:
	npm run dev

start-front:
	npm --prefix client run dev
