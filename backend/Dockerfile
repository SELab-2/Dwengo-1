FROM node:22

WORKDIR /app/dwengo

COPY ./backend/i18n ./i18n

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

RUN npm run build --workspace=common
RUN npm run build --workspace=backend

EXPOSE 3000

CMD ["node", "--env-file=/app/dwengo/backend/.env", "/app/dwengo/backend/dist/app.js"]
