# Dockerfile
FROM php:8.1-apache

# Install needed PHP extensions (adjust as needed)
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Enable Apache mod_rewrite (optional)
RUN a2enmod rewrite

# Set working directory
WORKDIR /var/www/html
