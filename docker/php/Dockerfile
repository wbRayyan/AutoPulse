FROM php:8.4-fpm-alpine

# Helper tool that installs PHP extensions together with their system libraries
COPY --from=mlocati/php-extension-installer:2 /usr/bin/install-php-extensions /usr/local/bin/

# Composer binary copied from the official image (no separate install step)
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

RUN install-php-extensions \
    pdo_pgsql \
    redis \
    bcmath \
    intl \
    pcntl \
    zip \
    opcache

WORKDIR /var/www/html