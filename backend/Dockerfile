FROM node:22 AS build-stage

WORKDIR /app/dwengo

# Install dependencies

COPY package*.json ./
COPY backend/package.json ./backend/
# Backend depends on common
COPY common/package.json ./common/

RUN npm install --silent

# Build the backend

# Root tsconfig.json
COPY tsconfig.json tsconfig.build.json ./

COPY backend ./backend
COPY common ./common
COPY docs ./docs

RUN npm run build

FROM node:22 AS production-stage

WORKDIR /app/dwengo

# Copy static files

COPY ./backend/i18n ./i18n

# Copy built files

COPY --from=build-stage /app/dwengo/common/dist ./common/dist
COPY --from=build-stage /app/dwengo/backend/dist ./backend/dist

COPY package*.json ./
COPY backend/package.json ./backend/
# Backend depends on common
COPY common/package.json ./common/

RUN npm install --silent --only=production

COPY ./docs ./docs
COPY ./backend/i18n ./backend/i18n
COPY ./backend/.env ./backend/.env

EXPOSE 3000

CMD ["node", "--env-file=/app/dwengo/backend/.env", "/app/dwengo/backend/dist/app.js"]
