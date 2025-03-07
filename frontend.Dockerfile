# build stage
FROM node:22 AS build-stage
WORKDIR /app
COPY ./frontend/package*.json ./
RUN npm install
COPY ./frontend ./frontend
COPY ./assets ./assets
WORKDIR /app/frontend
RUN npm run build

# production stage
FROM nginx:stable AS production-stage
COPY --from=build-stage /app/frontend/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]