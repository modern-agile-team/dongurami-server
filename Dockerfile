FROM node:14

MAINTAINER 류가희 <qufslarkgml@gmail.com>

RUN mkdir /dongurami-server

WORKDIR /dongurami-server

RUN mkdir ./app

COPY ./app ./app/  

WORKDIR ./app

COPY /package*.json ./

RUN npm install

EXPOSE 8080

CMD ["npm", "run", "dev"]