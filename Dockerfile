FROM node:16-alpine

WORKDIR /usr/src/app

COPY package.json .

COPY . .

RUN npm install -g npm@9.7.2

RUN npm install

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
