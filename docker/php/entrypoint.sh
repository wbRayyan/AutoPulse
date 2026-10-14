#!/bin/sh
set -e

APP_DIR=/var/www/html

# Laravel only needs write access to these two directories.
# Bind-mounted code is owned by root, while PHP-FPM workers run as www-data.
chmod -R a+rwX "$APP_DIR/storage" "$APP_DIR/bootstrap/cache" 2>/dev/null || true

# One-time development bootstrap. Only the web container (php-fpm) runs it,
# so the queue worker never races it for the same files.
if [ "$1" = "php-fpm" ]; then
    if [ ! -f "$APP_DIR/vendor/autoload.php" ]; then
        echo "[entrypoint] Installing Composer dependencies..."
        composer install --no-interaction --prefer-dist
    fi

    if [ ! -f "$APP_DIR/.env" ]; then
        echo "[entrypoint] Creating .env from .env.example..."
        cp "$APP_DIR/.env.example" "$APP_DIR/.env"
    fi

    if ! grep -q '^APP_KEY=base64:' "$APP_DIR/.env"; then
        echo "[entrypoint] Generating application key..."
        php artisan key:generate --force
    fi

    echo "[entrypoint] Running database migrations..."
    php artisan migrate --force
fi

# Hand over to the official PHP image entrypoint (starts php-fpm by default)
exec docker-php-entrypoint "$@"