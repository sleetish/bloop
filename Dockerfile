# Use an official Node.js runtime as a parent image
FROM node:18-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install application dependencies
RUN npm install

# Bundle app source
COPY . .

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Define environment variables for Firebase config (placeholders, to be overridden at runtime)
ENV FIREBASE_CONFIG=""
ENV APP_ID=""
ENV PORT=3000

# Run server.js when the container launches
CMD [ "node", "server.js" ]
