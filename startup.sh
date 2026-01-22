#!/usr/bin/env sh

set -e

docker compose down --remove-orphans

for port in 8080 8081 8082; do
  lsof -ti tcp:"$port" | xargs -r kill -9
  lsof -ti tcp6:"$port" | xargs -r kill -9
done

docker compose up -d

if [ -z "$NVM_DIR" ]; then
  export NVM_DIR="$HOME/.nvm"
fi

if [ ! -s "$NVM_DIR/nvm.sh" ]; then
  echo "nvm is not installed. Please install nvm first."
  exit 1
fi

. "$NVM_DIR/nvm.sh"

cd third-party-apps || exit 1

echo "Running Solid Cinema..."
cd solid-file-manager || exit 1
nvm use 22
npm install
npm run dev &

SOLID_PID=$!

cd ..

echo "Running Media Kraken..."
cd media-kraken || exit 1
nvm use 14.15.0
npm install --legacy-peer-deps
npm run serve &

wait $SOLID_PID


echo ""
echo "Community Solid server running in http://localhost:3000"
echo "Media kraken running in http://localhost:8080"
echo "Solid cinema running in http://localhost:8081"
echo "Solid file manager running in http://localhost:8082"
echo ""
