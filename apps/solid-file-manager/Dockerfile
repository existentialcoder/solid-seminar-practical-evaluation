# ---------------------------
# 1. Build stage
# ---------------------------
FROM node:20-alpine AS build

WORKDIR /app

# Install system deps (needed by some node tools)
RUN apk add --no-cache python3 make g++

# Copy dependency files first (better caching)
COPY package*.json ./

# Install deps
RUN npm install

# Copy source
COPY . .

# Build LDO + Next.js
RUN npm run build


# ---------------------------
# 2. Runtime stage
# ---------------------------
FROM node:20-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production

# Copy only what is needed to run Next.js
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/next.config.* ./ 2>/dev/null || true

# Expose Next.js port
EXPOSE 8082

# Start Next.js
CMD ["npm", "run", "start"]
