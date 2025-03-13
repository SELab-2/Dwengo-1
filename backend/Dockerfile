FROM node:22 AS build-stage

WORKDIR /app

# Install dependencies

COPY package*.json ./
COPY backend/package.json ./backend/

RUN npm install --silent

# Build the backend

# Root tsconfig.json
COPY tsconfig.json ./

WORKDIR /app/docs

COPY docs ./

RUN npm run swagger

WORKDIR /app/backend

COPY backend ./

RUN npm run build

FROM node:22 AS production-stage

WORKDIR /app

COPY package-lock.json backend/package.json ./

RUN npm install --silent --only=production

COPY --from=build-stage /app/backend/dist ./dist/
COPY --from=build-stage /app/docs/swagger ./dist/swagger

EXPOSE 3000

CMD ["node", "--env-file=.env", "dist/app.js"]
