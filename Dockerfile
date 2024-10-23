# FROM ghcr.io/puppeteer/puppeteer:23.6.0
# ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
# PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable
# WORKDIR /usr/src/app
# COPY package*.json ./
# RUN npm ci
# COPY . .
# CMD ["node", "app.js"]


# Use the official Puppeteer image from GitHub container registry
FROM ghcr.io/puppeteer/puppeteer:23.6.0

# Set environment variables to skip Chromium download and specify the Chrome executable
# ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
#     PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy only package.json and package-lock.json to optimize build cache
COPY package*.json ./

# Install dependencies using npm ci for clean installs
RUN npm ci

# Copy the rest of the application files to the container
COPY . .

# Expose the port the app listens on (if necessary)
# EXPOSE 3000

# Start the Node.js app
CMD ["node", "app.js"]
