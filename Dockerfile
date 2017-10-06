FROM mhart/alpine-node:8
WORKDIR /app/thinglator
COPY package.json package-lock.json ./
RUN apk add --no-cache git && \
    npm install && \
    apk del git
RUN npm install pm2 -g
RUN npm install

COPY . .

EXPOSE 3000
ENV NODE_ENV docker
CMD ["pm2-docker", "process.yml"]
