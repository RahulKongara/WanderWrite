FROM node:18 AS build
WORKDIR /client
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
FROM nginx:alpine
COPY --from=build /client/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
