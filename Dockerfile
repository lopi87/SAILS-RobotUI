FROM nodesource/jessie:6.2

RUN apt-get update
RUN npm install sails@0.12.3 -g
RUN npm install pm2 -g

RUN mkdir -p /app
WORKDIR /app

COPY . /app

MAINTAINER Manuel Lopez

USER root

ADD . /app/

EXPOSE 8080

CMD [ "pm2", "start", "--no-daemon", "app.js" ]


FROM mongo:latest
RUN apt-get install mongodb

