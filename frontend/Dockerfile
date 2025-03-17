FROM node:14.17.3

WORKDIR /frontend

COPY package*.json ./

RUN npm install
COPY . .

EXPOSE 3000
CMD ["npm", "start"]
