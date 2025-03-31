FROM node:22 AS build-stage

WORKDIR /app

# Install dependencies

COPY package*.json ./
COPY backend/package.json ./backend/
COPY common/package.json ./common/

RUN npm install --silent

# Build the backend

# Root tsconfig.json
COPY tsconfig.json ./

COPY backend ./backend
COPY common ./common
COPY docs ./docs

WORKDIR /app/backend

RUN npm run build

FROM node:22 AS production-stage

WORKDIR /app

COPY package-lock.json backend/package.json ./

RUN npm install --silent --only=production

COPY ./docs /docs
COPY ./backend/i18n /app/i18n
COPY --from=build-stage /app/backend/dist ./dist/

EXPOSE 3000

CMD ["node", "--env-file=.env", "dist/app.js"]
