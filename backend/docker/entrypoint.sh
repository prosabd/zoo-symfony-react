#!/bin/bash
set -e

composer install --prefer-dist --no-scripts --no-autoloader
php bin/console doctrine:database:create --if-not-exists --connection=default
php bin/console doctrine:migrations:migrate -n
php bin/console doctrine:fixtures:load -n
php bin/console lexik:jwt:generate-keypair --skip-if-exists --no-interaction
php bin/console assets:install --symlink --relative public
chown 1000:1000 -R public

exec "$@"