FROM node:14

MAINTAINER 류가희 <qufslarkgml@gmail.com>

RUN mkdir /dongurami-server

WORKDIR /dongurami-server

RUN mkdir ./app

COPY ./app/package*.json ./app/

WORKDIR /app

COPY ./app /app/    

RUN npm install

EXPOSE 8080
