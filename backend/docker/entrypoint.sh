set -e

composer install
php bin/console doctrine:migrations:migrate -n
php bin/console doctrine:fixtures:load -n
php bin/console lexik:jwt:generate-keypair --skip-if-exists --no-interaction

exec "$@"