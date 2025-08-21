# Use official Node.js LTS image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json if available
COPY package*.json ./

# Install dependencies (none in this example but good practice)
RUN npm install

# Copy app source code
COPY app.js ./

# Expose port 3000
EXPOSE 3000

# Command to run the app
CMD ["npm", "start"]
