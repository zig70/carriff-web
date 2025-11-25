# --- Stage 1: Build the Angular App (Builder Stage) ---
FROM node:20-alpine AS build
WORKDIR /app

# Copy package.json and package-lock.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build for production
COPY . .
# Replace 'your-app-name' with the actual name of your Angular project in angular.json
RUN npm run build -- --output-path=./dist/browser --configuration production

# --- Stage 2: Serve with Nginx (Production Stage) ---
# Use a lightweight Nginx image to serve static files
FROM nginx:alpine AS final
# Cloud Run recommends listening on the port defined by the PORT env var (defaults to 8080)
# We configured Nginx to listen on 8080 in nginx.conf
EXPOSE 8080

# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the static built files from the build stage to the Nginx serving directory
# The path in 'browser' folder depends on your Angular version/config, check your dist folder
COPY --from=build /app/dist/browser /usr/share/nginx/html

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]