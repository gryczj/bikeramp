# Image source
FROM node:16-alpine

WORKDIR /bikeramp

COPY ./package.json ./package-lock.json /bikeramp/

RUN npm install

COPY . /bikeramp/

EXPOSE 3000
CMD ["npm", "run", "start:dev"]