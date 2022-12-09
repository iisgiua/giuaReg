FROM node:latest

### installa ambiente di sviluppo
RUN npm install -g npm@latest expo-cli@latest eas-cli@latest

### installa dipendenze
RUN mkdir /opt/giuaReg
WORKDIR /opt/giuaReg
COPY ./*.json ./*.js ./
RUN npm install

### copia l'applicazione
COPY . .

### porta del server di sviluppo
EXPOSE 19000

### comando predefinito per avviare il server di sviluppo
CMD npm start --clear-cache
