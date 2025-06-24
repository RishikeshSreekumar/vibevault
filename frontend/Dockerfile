# Stage 1: Builder/Development stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
# We created package.json but didn't run install, so no lock file yet.
# In a real scenario, you'd commit the lock file.
COPY package.json ./
# If you had a package-lock.json or yarn.lock, you'd copy it too:
# COPY package-lock.json ./
# COPY yarn.lock ./

# Install dependencies
# The sandbox had issues with npm install. Assuming it works in a standard Docker build env.
# Using --legacy-peer-deps as it was in the attempted command, though may not be needed.
RUN npm install --legacy-peer-deps

# Copy the rest of the application source code
COPY . .

# Build the Next.js application
# Environment variables for the build can be passed here if needed
# ARG NEXT_PUBLIC_API_URL
# ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
RUN npm run build

# Stage 2: Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Set environment variables for production
ENV NODE_ENV production
# ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL} # This would be set in docker-compose or at runtime

# Copy built assets from the builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Expose port 3000
EXPOSE 3000

# Command to run the Next.js application
# Next.js standalone output runs server.js
CMD ["node", "server.js"]

# Note: For Next.js 12.2+, the outputStandalone option in next.config.js is recommended for Docker.
# We haven't created a next.config.js explicitly using this yet.
# The default build should still work, but outputStandalone is cleaner for Docker.
# If we create next.config.js, it should include:
# module.exports = {
#   output: 'standalone',
# }
# The Dockerfile above is compatible with the standalone output.
# If not using standalone, the CMD might be "npm", "start" and more files would be copied.
# The current Dockerfile assumes `output: 'standalone'` is or will be enabled in `next.config.js`.
# Let's create a basic next.config.js with this.
