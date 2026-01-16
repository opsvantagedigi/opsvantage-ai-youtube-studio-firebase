# Stage: builder
FROM node:20-alpine AS builder
WORKDIR /workspace/apps/api

# Copy only package manifests first for better caching
## Copy only the API package manifests to avoid running root lifecycle scripts
COPY apps/api/package.json apps/api/package-lock.json ./

# Install dependencies inside the api workspace (including dev for now so runtime has needed modules)
RUN npm ci --silent

# Copy source files
COPY apps/api/ ./

# Stage: runtime
FROM node:20-alpine AS runtime
WORKDIR /app

# Copy production node_modules from builder
COPY --from=builder /workspace/apps/api/node_modules ./node_modules

# Copy app source
COPY --from=builder /workspace/apps/api/ ./

# Use a non-root user for better security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

ENV NODE_ENV=production
EXPOSE 3001

# Start the server
CMD ["node", "src/server.js"]
