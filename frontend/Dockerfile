# ---------- Build Stage ----------
FROM node:18-alpine AS builder
WORKDIR /app

ENV CI=true

COPY package*.json ./
RUN npm ci

COPY . .

# Pass API URL at build time
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ---------- Production Stage ----------
FROM nginx:1.25-alpine

# Copy built files from Vite build
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
