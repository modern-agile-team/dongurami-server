FROM node:14

MAINTAINER 류가희 <qufslarkgml@gmail.com>

RUN mkdir ./app

COPY ./app/package*.json ./app

WORKDIR /app

COPY ./app /app    

RUN npm i

EXPOSE 8080

CMD ["npm", "run", "dev"]
