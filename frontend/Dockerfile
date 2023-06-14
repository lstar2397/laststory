FROM node:16

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /usr/src/app
COPY package*.json ./
COPY . .

RUN npm install

EXPOSE $PORT

CMD ["node", "index.js"]
