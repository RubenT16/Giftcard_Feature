# Stage 1: Build the Angular application
FROM node:19 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Print the Angular version and other details for debugging
RUN node -v && npm -v && npm list @angular/cli

# Build the Angular app
RUN npm run build --prod


# Stage 2: Serve the app with Nginx
FROM nginx:alpine

# Copy the build output to replace the default Nginx contents
COPY --from=build /app/dist/infirfs-auth-project/browser /usr/share/nginx/html

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
