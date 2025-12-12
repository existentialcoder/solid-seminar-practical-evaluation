.PHONY: build build-media-kraken build-solid-cinema run

build-media-kraken:
	docker build -t media-kraken ./apps/media-kraken

build-solid-cinema:
	docker build -t solid-cinema ./apps/solid-cinema

build: build-media-kraken build-solid-cinema

run: build
	docker compose -f docker-compose.yml up -d
