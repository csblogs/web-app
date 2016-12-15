FROM node:latest

MAINTAINER Daniel Brown <danny@csblogs.com>
LABEL name="csblogs-web-app"

RUN apt-get update && apt-get install -y rsync

RUN mkdir /usr/src/csblogs-web-app
WORKDIR /usr/src/csblogs-web-app

COPY package.json /usr/src/csblogs-web-app
RUN npm install

COPY . /usr/src/csblogs-web-app

EXPOSE 80

ENTRYPOINT [ "npm", "run" ];
CMD ["start-docker"]
