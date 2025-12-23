# ---------- Build Stage ----------
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
# RUN npm ci --only=production
RUN npm ci


# Copy source code
COPY . .

# ---------- Runtime Stage ----------
FROM node:18-alpine AS runtime
WORKDIR /app

# Copy app and node_modules from builder
COPY --from=builder /app /app

# Set environment
ENV NODE_ENV=production
ENV PORT=8000

EXPOSE 8000

# Start the backend
CMD ["node", "index.js"]
