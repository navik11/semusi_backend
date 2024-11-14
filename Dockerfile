# Use Node.js LTS version as the base image
FROM node:18

# Create and set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port that the application runs on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
