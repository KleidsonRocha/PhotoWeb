# Estágio de build
FROM node:18 AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Estágio de produção
FROM nginx:stable-alpine AS production-stage
# No Vite, o diretório de build padrão é 'dist'
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Configuração inline do Nginx para React Router
RUN echo 'server { \
    listen 90; \
    server_name localhost; \
    \
    # Importante: configuração para o subpath \
    location /processamento-imagem/ { \
        alias /usr/share/nginx/html/; \
        index index.html; \
        try_files $uri $uri/ /processamento-imagem/index.html; \
        \
        # Configuração correta dos tipos MIME \
        location ~* \.(js|jsx)$ { \
            types { \
                application/javascript js jsx; \
            } \
        } \
        \
        location ~* \.(css)$ { \
            types { \
                text/css css; \
            } \
        } \
    } \
    \
    # Redirecionamento da raiz para o subpath \
    location = / { \
        return 301 /processamento-imagem/; \
    } \
    \
    # Configurações de performance \
    gzip on; \
    gzip_vary on; \
    gzip_min_length 10240; \
    gzip_proxied expired no-cache no-store private auth; \
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/javascript application/xml application/json; \
    gzip_disable "MSIE [1-6]\."; \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 90
CMD ["nginx", "-g", "daemon off;"]