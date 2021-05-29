FROM node:14-alpine3.13

WORKDIR /src/plutus-web

COPY package.json .
COPY package-lock.json .

RUN npm install 

COPY . .

EXPOSE 4200

CMD /src/plutus-web/node_modules/.bin/ng serve --host 0.0.0.0 --disableHostCheck