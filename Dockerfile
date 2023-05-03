FROM node

WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn install
COPY . .
EXPOSE 1234

CMD [ "yarn", "parcel", "src/index.html" ]
