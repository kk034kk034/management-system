FROM node:20-slim

EXPOSE 9090

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

CMD [ "npm", "start" ]
