# ==============================
# 1️⃣ Build stage (TypeScript)
# ==============================
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependencies first for caching
COPY package*.json ./
RUN npm ci

# Copy all source files
COPY . .

# Build the TypeScript project
RUN npm run build


# ==============================
# 2️⃣ Runtime stage (production)
# ==============================
FROM node:20-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production

# Copy only required files from builder
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev

# Copy compiled output (dist) only
COPY --from=builder /app/dist ./dist

COPY src/infrastructure/database/migrations ./dist/infrastructure/database/migrations

COPY src/infrastructure/database/seeders ./dist/infrastructure/database/seeders

# Copy env file if you need it inside container (optional)
# COPY .env .env

COPY .sequelizerc .sequelizerc

EXPOSE 5000
# CMD ["npm", "run", "start"]
CMD ["node", "dist/index.js"]
