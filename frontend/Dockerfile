# ── Stage 1: Build ──────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json .
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build

# ── Stage 2: Serve ──────────────────────────────────
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Security: non-root
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
