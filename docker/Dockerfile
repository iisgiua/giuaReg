FROM node:latest
LABEL version=1.0.0

WORKDIR /var/www/giuaschool-giuareg/giuaReg

COPY *.js *.json ./
COPY ./src ./src
COPY ./assets ./assets

RUN \
  npm install && \
  npm update

EXPOSE 19000

CMD \
  npm start
