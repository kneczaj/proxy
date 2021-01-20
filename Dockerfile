FROM node:12.10-alpine
WORKDIR /usr/src/app

RUN npm install yarn

COPY package.json yarn.lock ./
RUN yarn install

COPY src/ ./src
COPY tsconfig.json ./

CMD yarn start
