FROM node:14

RUN mkdir /dongurami-server

WORKDIR /dongurami-server

RUN mkdir ./app

COPY ./app/package*.json ./app

RUN npm install -g http-server

COPY ./app ./app

WORKDIR /dongurami/app

EXPOSE 8080

CMD ["npm", "run", "dev"]
