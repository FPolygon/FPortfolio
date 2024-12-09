# Build stage - explicitly set platform to amd64
FROM --platform=linux/amd64 node:18-slim AS builder

# Set environment variable for API URL
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Set working directory for the frontend application
WORKDIR /frontend

# Copy package files for dependency installation
COPY package*.json ./

# Install production dependencies with caching for efficiency
RUN --mount=type=cache,target=/root/.npm \
    npm ci --only=production && \
    npm cache clean --force

# Install additional tools for building the application
RUN apt-get update && \
    apt-get install -y --no-install-recommends python3 make g++ && \
    npm install && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy the source code into the container
COPY . .

# Build the frontend application
RUN npm run build

# Runtime stage - explicitly set platform to amd64
FROM --platform=linux/amd64 debian:bullseye-slim

# Install nginx and curl
RUN apt-get update && \
    apt-get install -y nginx curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Create nginx user and configure directories
RUN useradd -r nginx && \
    mkdir -p /var/cache/nginx /var/log/nginx /var/lib/nginx /var/lib/nginx/body && \
    chown -R nginx:nginx /var/cache/nginx /var/log/nginx /var/lib/nginx && \
    chmod -R 755 /var/cache/nginx /var/log/nginx /var/lib/nginx && \
    # Remove default nginx configuration
    rm /etc/nginx/nginx.conf

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf
RUN chown nginx:nginx /etc/nginx/nginx.conf && \
    chmod 644 /etc/nginx/nginx.conf

# Copy the built application files
COPY --from=builder /frontend/dist /usr/share/nginx/html
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Create directory for nginx PID file
RUN mkdir -p /var/run/nginx && \
    chown -R nginx:nginx /var/run/nginx && \
    chmod -R 755 /var/run/nginx

# Run as non-root user for security
USER nginx

# Expose port 80 for the web server
EXPOSE 80

# Define a health check for nginx
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:80/health || exit 1

# Start nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
