# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies (including dev dependencies for build)
COPY package*.json ./
RUN npm ci

# Copy the rest of the application source
COPY . .

# Declare and expose the build-time API base URL so Next.js can inline it
ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

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

EXPOSE 3000

ENV NODE_ENV=production

CMD ["npm", "start"]