# Stage 1: Build the React application
FROM node:22-bookworm-slim AS build-frontend

WORKDIR /frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Build the Spring Boot application
FROM eclipse-temurin:21-jdk-jammy AS build-backend

WORKDIR /backend
COPY backend/ .
RUN chmod +x gradlew
RUN ./gradlew build

# Stage 3: Combine both applications and set up Nginx and Spring Boot
FROM eclipse-temurin:21-jre-jammy

# Install Nginx and Supervisor
RUN apt-get update \
    && apt-get install -y --no-install-recommends nginx supervisor curl \
    && rm -rf /var/lib/apt/lists/*

# Copy the Spring Boot application
COPY --from=build-backend /backend/build/libs/*.jar /app/app.jar

# Copy the built React application to Nginx's HTML directory
COPY --from=build-frontend /frontend/build /usr/share/nginx/html

# Remove the default Nginx configuration file and add our custom configuration
RUN rm /etc/nginx/sites-enabled/default
COPY nginx.conf /etc/nginx/sites-enabled/default

# Copy the Supervisor configuration file
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expose port 80
EXPOSE 80

# Verify that both services are available through the public HTTP endpoint.
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD curl --fail http://localhost/actuator/health/readiness || exit 1

# Start Supervisor
CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
