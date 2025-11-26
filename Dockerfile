FROM node:20-slim AS builder

# Set the working directory
WORKDIR /app

# Copy package files to install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy the entire source code
COPY . .

# Build the Angular application for production (includes SSR bundle)
# Use the correct outputPath if different from 'dist/carriff-web'
RUN npm run build

# Stage 2: Create the Final Server Image (Minimal & Secure)
FROM gcr.io/google.com/cloudsdk/google-cloud-cli:latest-slim

# Set the working directory
WORKDIR /usr/src/app

# Copy necessary files from the builder stage
# Replace 'carriff-web' with your actual project name from angular.json output
COPY --from=builder /app/dist/carriff-web/browser ./browser
COPY --from=builder /app/dist/carriff-web/server/main.js ./server/main.js
COPY --from=builder /app/package.json .

# Install production dependencies only
RUN npm install --omit=dev

# Cloud Run expects the application to listen on the PORT environment variable
# that it provides. The Angular SSR server is typically configured to use this.
ENV PORT 8080

# Expose the default port (optional, but good practice)
EXPOSE 8080

# Command to run the SSR server using Node.js
# Ensure this path matches the output of your ng build command
CMD ["node", "server/main.js"]