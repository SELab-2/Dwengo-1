FROM node:22 AS build-stage

# install simple http server for serving static content
RUN npm install -g http-server

WORKDIR /app

# Install dependencies

COPY package*.json ./
COPY ./frontend/package.json ./frontend/

RUN npm install --silent

# Build the frontend

# Root tsconfig.json
COPY tsconfig.json ./
COPY assets ./assets/

WORKDIR /app/frontend

COPY frontend ./

RUN npx vite build

FROM nginx:stable AS production-stage

COPY config/nginx/nginx.conf /etc/nginx/nginx.conf

COPY --from=build-stage /app/assets /usr/share/nginx/html/assets
COPY --from=build-stage /app/frontend/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
