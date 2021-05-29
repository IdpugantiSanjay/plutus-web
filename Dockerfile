FROM node:alpine

WORKDIR /src/plutus-web

COPY package.json .
COPY package-lock.json .

RUN npm install 

COPY . .

EXPOSE 4200

CMD /src/plutus-web/node_modules/.bin/ng serve --host 0.0.0.0 --disableHostCheck