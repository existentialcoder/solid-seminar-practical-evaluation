.PHONY: build build-media-kraken build-solid-file-manager build-solid-cinema run

build-media-kraken:
	docker build -t media-kraken ./apps/media-kraken

build-solid-cinema:
	docker build -t solid-cinema ./apps/solid-cinema-vue

build-solid-file-manager:
	docker build -t solid-file-manager ./apps/solid-file-manager

build: build-media-kraken build-solid-cinema build-solid-file-manager

run:
	docker compose -f docker-compose.yml up -d

down:
	docker compose down
