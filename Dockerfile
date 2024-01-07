# Step 1: Use an official Node.js runtime as a parent image
FROM node:lts-alpine as builder

# Set the working directory
WORKDIR /usr/src/app

# Create the dist directory
RUN mkdir dist

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install app dependencies using npm install --production
RUN npm install --production

# Copy the rest of your app's source code from your host to your image filesystem.
COPY src/ ./

# Final step base on a smaller image
FROM node:lts-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy the built app from the builder stage
COPY --from=builder /usr/src/app/ ./

# Run the app
CMD ["index.js"]
