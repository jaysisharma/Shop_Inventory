# Stage 1: Build the React app using Vite
FROM node:20 AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the production version of the app
RUN npm run build

# Stage 2: Serve the production build
FROM nginx:alpine

# Copy the build folder to the nginx html directory dasboard finalize
COPY --from=build /app/dist /usr/share/nginx/html

# Expose the port
EXPOSE 80

# Start nginx server
CMD ["nginx", "-g", "daemon off;"]
