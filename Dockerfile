
FROM node:20 AS builder

# Set working directory
WORKDIR /app

# Copy package files first for caching
COPY package*.json ./

# Upgrade npm to match packageManager field in package.json (node:20 ships with npm@10)
RUN npm install -g npm@$(node -e "const p=require('./package.json'); console.log(p.packageManager.split('@')[1])")

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Build Angular SSR (browser + server bundles)
RUN npm run build:ssr

# -------------------------
# Stage 2: Run Angular SSR
# -------------------------
FROM node:20-slim AS runner

# Set working directory
WORKDIR /app

# Copy built files from builder stage
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev 
#--omit=dev
EXPOSE 8080
ENV NODE_ENV=production
# Start Angular Universal server
CMD ["node", "dist/carriff-web/server/server.mjs"]