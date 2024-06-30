# Stage 1: Build the React application
FROM node:14 AS build-frontend

WORKDIR /frontend
COPY frontend/package.json frontend/yarn.lock ./
RUN yarn install
COPY frontend/ ./
RUN yarn build

# Stage 2: Build the Spring Boot application
FROM gradle:7.5.0-jdk11 AS build-backend

WORKDIR /backend
COPY backend/ .
RUN gradle build -x test

# Stage 3: Combine both applications and set up Nginx and Spring Boot
FROM openjdk:11-jre-slim

# Install Nginx and Supervisor
RUN apt-get update && apt-get install -y nginx supervisor && apt-get clean

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

# Start Supervisor
CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]