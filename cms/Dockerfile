FROM node:20-slim

# publish.js shells out to the real `git` binary (clone/fetch/reset/add/commit/push) --
# Railway's default Railpack/Nixpacks Node image doesn't include it, so build our own image.
RUN apt-get update && apt-get install -y --no-install-recommends git ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .

ENV NODE_ENV=production
CMD ["node", "server.js"]
