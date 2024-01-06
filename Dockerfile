# Step 1: Use an official Node.js runtime as a parent image
FROM node:latest as builder

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Copy the rest of your app's source code from your host to your image filesystem.
COPY src/ ./src

# Step 2: Build the code for production (if needed)
# RUN npm run build

# Step 3: Use a smaller base image for the actual application
FROM node:alpine

WORKDIR /usr/src/app

# Copy the built app from the builder stage
COPY --from=builder /usr/src/app .

# Define the command to run your app using CMD which defines your runtime
CMD ["node", "src/index.js"]
