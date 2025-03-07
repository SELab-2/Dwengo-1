FROM node:22

WORKDIR /app

COPY ./backend/package*.json ./

RUN npm install

COPY ./backend .

EXPOSE 2002

CMD ["npm", "start"]