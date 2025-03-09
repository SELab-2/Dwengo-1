FROM node:22

WORKDIR /app

COPY ./backend/package*.json ./

RUN npm install

COPY ./backend ./backend
COPY ./tsconfig.json /app

WORKDIR /app/backend

RUN npm run build

EXPOSE 2002

CMD ["npm", "run", "start"]