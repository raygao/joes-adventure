# Use an official Node.js base image
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --only=production

# Install PM2 globally
RUN npm install -g pm2

# Copy application source code
COPY . .

# Set the environment variable to force port 3500
ENV PORT=3500

# Expose port 3500 for inbound traffic
EXPOSE 3500

# Start the app using PM2 in production mode
CMD ["pm2-runtime", "start", "app.mjs", "--watch", "--name", "backend"]