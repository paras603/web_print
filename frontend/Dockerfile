FROM node:latest

WORKDIR /frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./

EXPOSE 3000

CMD ["npm", "start"]
