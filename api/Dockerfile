FROM node:18
WORKDIR /api
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4000
CMD ["node","index.js"]