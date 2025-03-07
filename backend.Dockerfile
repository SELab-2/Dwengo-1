FROM node:22

WORKDIR /app

COPY ./backend/package*.json ./

RUN npm install

COPY ./backend ./backend

WORKDIR /app/backend

EXPOSE 2002

CMD ["npm", "start"]