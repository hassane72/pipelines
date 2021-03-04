# Stage 1
FROM node:current-alpine3.12 as node

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build-prod

# Stage 21
FROM nginx:stable-alpine

COPY --from=node /usr/src/app/dist/awesome-list /usr/share/nginx/html
COPY ./proxy.conf /etc/nginx/conf.d/default.conf
