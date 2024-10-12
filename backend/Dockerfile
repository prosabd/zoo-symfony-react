FROM php:8.2-cli

# Setup user
RUN useradd www

# Install system packeges
RUN apt-get update && apt-get install -y supervisor nginx lsb-release wget

# Add repos
RUN wget -O /etc/apt/trusted.gpg.d/php.gpg https://packages.sury.org/php/apt.gpg
RUN echo "deb https://packages.sury.org/php/ $(lsb_release -sc) main" | tee /etc/apt/sources.list.d/php.list

# Install PHP dependencies
RUN apt update && apt install -y php7.4-fpm

# Configure php-fpm and nginx
COPY config/fpm.conf /etc/php/7.4/fpm/php-fpm.conf
COPY config/supervisord.conf /etc/supervisord.conf
COPY config/nginx.conf /etc/nginx/nginx.conf

# Copy challenge files
COPY challenge /www

# Setup permissions
RUN chown -R www:www /www /var/lib/nginx

# Copy flag
COPY flag /flag

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