# ===== Stage 1: build da SPA (Vite) =====
FROM node:20-alpine AS build
WORKDIR /app

# VITE_API_URL e embutido em tempo de build (variavel do navegador)
ARG VITE_API_URL=http://localhost:8080
ENV VITE_API_URL=$VITE_API_URL

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ===== Stage 2: servir estaticos com nginx =====
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
