# Step 1: Use the official Node.js image from Docker Hub
FROM node:18-alpine

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json files into the container
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application files into the container
COPY . .

# Step 6: Expose the port your app will be running on
EXPOSE 3000

# Step 7: Command to run the app
CMD ["node", "server.js"]
