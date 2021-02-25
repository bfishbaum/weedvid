FROM node:12.8

# Change working directory
WORKDIR /usr/app
COPY package*.json /usr/app/
COPY .env /usr/app/.env
ADD src /usr/app/src
ADD public /usr/app/public
RUN npm install
RUN npm run build
RUN npm install -g serve

EXPOSE $PORT
CMD [ "serve", "-l", "3000" , "-s", "build" ]