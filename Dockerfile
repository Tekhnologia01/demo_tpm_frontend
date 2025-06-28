# Use official Node.js runtime as a parent image
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app source code
COPY . .

# Expose port for Vite to match docker-compose.yml
EXPOSE 3000

# Set environment variable for Vite port
ENV PORT=3000

# Start Vite development server for React app
CMD ["npm", "run", "dev"]