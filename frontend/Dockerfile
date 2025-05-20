#syntax=docker/dockerfile:1.7-labs

FROM node:22 AS build-stage

# install simple http server for serving static content
RUN npm install -g http-server

WORKDIR /app/dwengo

# Install dependencies

COPY package*.json ./
COPY ./frontend/package.json ./frontend/
# Frontend depends on common
COPY common/package.json ./common/

RUN npm install --silent

# Build the frontend

# Root tsconfig.json
COPY tsconfig.json tsconfig.build.json ./

COPY assets ./assets
COPY common ./common

RUN npm run build --workspace=common

WORKDIR /app/dwengo/frontend

COPY --exclude=frontend/tests/ frontend ./

RUN npx vite build

FROM nginx:stable AS production-stage

COPY config/nginx/nginx.conf /etc/nginx/nginx.conf

COPY --from=build-stage /app/dwengo/assets /usr/share/nginx/html/assets
COPY --from=build-stage /app/dwengo/frontend/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
