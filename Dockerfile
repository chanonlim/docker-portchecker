FROM node:10.15.1
WORKDIR /usr/src/app
# Dependencies
COPY package*.json ./
RUN npm install --only=production
# Bundle
COPY . .
EXPOSE 80
CMD [ "npm", "start" ]
