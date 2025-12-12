.PHONY: build build-media-kraken build-solid-cinema run

build-media-kraken:
	docker build -t media-kraken ./apps/media-kraken

build-solid-cinema:
	docker build -t solid-cinema ./apps/solid-cinema-vue

build: build-media-kraken build-solid-cinema

run:
	docker compose -f docker-compose.yml up -d

down:
	docker compose down
