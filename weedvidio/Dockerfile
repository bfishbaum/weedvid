FROM node:15.14.0-alpine3.10

# Change working directory
WORKDIR /usr/app
COPY package*.json /usr/app/
ADD server /usr/app/server
ADD dist /usr/app/dist
ADD node_modules /usr/app/node_modules

EXPOSE $PORT
CMD [ "npm", "start" ]
