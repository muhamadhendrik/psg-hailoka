# Stage 1: Build
FROM node:20-alpine AS build

# Install pnpm globally
RUN npm install -g pnpm

WORKDIR /app

# Copy files
COPY pnpm-lock.yaml ./
COPY package.json ./

# Install dependencies using pnpm
RUN pnpm install

# Copy all project files
COPY . .

# Build for production
RUN pnpm run build

# Stage 2: Run with Nginx
FROM nginx:alpine

# Copy built files to Nginx html folder
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 5173

CMD ["nginx", "-g", "daemon off;"]
