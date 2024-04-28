# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Install Python and build dependencies
RUN apk add --no-cache python3 make g++ \
    && ln -sf python3 /usr/bin/python

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the local code to the container's workspace
COPY . ./

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run your app
CMD ["npm", "run" , "dev"]
