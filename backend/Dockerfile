FROM php:8.2-apache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# PHP
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Apache
RUN a2enmod rewrite
RUN service apache2 restart

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR '/backend'

# Copy the composer.lock and composer.json files
COPY composer.lock composer.json ./

# Install the dependencies
RUN composer install --no-dev --prefer-dist --no-scripts

COPY . .
EXPOSE 8000

CMD ["php", "-S", "127.0.0.1:8000", "-t", "public"]