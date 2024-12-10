FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY server.js ./
RUN npm install
RUN npm install express
COPY . .
EXPOSE 8080
CMD [ "node", "server.js" ]