# Use an official Node.js runtime as a parent image
FROM node:16

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port that your app runs on
EXPOSE 3000

# Define environment variables (adjust based on your actual configuration)
ENV MONGO_URI="mongodb://mongo:27017/newjhead"
ENV REDIS_HOST="redis"
ENV PORT=3000

# Run the application
CMD ["npm", "run", "fetch"]
