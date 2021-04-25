FROM node:15.14.0-alpine3.10

# Change working directory
WORKDIR /usr/app
COPY package*.json /usr/app/
ADD server /usr/app/server
COPY prod.env /usr/app/.env
RUN npm install

COPY build /usr/app/build

EXPOSE $PORT
CMD [ "npm", "start" ]
