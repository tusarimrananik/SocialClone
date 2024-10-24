FROM ghcr.io/puppeteer/puppeteer:23.6.0
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["node", "app.js"]