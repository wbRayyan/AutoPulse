#!/bin/sh
set -e

# Laravel only needs write access to these two directories.
# Bind-mounted code is owned by root, while PHP-FPM workers run as www-data.
chmod -R a+rwX /var/www/html/storage /var/www/html/bootstrap/cache 2>/dev/null || true

# Hand over to the official PHP image entrypoint (starts php-fpm by default)
exec docker-php-entrypoint "$@"