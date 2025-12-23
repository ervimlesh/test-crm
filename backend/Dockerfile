# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

# Runtime
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app /app
ENV NODE_ENV=production
ENV PORT=8000
EXPOSE 8000
CMD ["node", "index.js"]
