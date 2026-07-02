# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies (including dev dependencies for build)
COPY package*.json ./
RUN npm ci

# Copy the rest of the application source
COPY . .

# Build the Next.js application
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy only the necessary files from the builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# If you have a next.config.js with 'output: "standalone"', you can copy the standalone folder instead:
# COPY --from=builder /app/.next/standalone ./
# COPY --from=builder /app/.next/static ./.next/static

# Expose the port (Azure App Service will set the actual PORT env variable)
EXPOSE 3000

ENV NODE_ENV=production

# Start Next.js, listening on the port provided by Azure (or default to 3000)
CMD ["npm", "start"]