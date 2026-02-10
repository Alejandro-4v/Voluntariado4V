until php bin/console doctrine:query:sql "SELECT 1" > /dev/null 2>&1; do
  echo "Waiting for database..."
  sleep 2
done

php bin/console doctrine:database:drop --if-exists --force
php bin/console doctrine:database:create --if-not-exists

mysql -h mysql -u root -proot -D API --ssl=FALSE --default-character-set=utf8mb4 < db_scripts/init.sql
mysql -h mysql -u root -proot -D API --ssl=FALSE --default-character-set=utf8mb4 < db_scripts/mock_populate.sql

exec symfony server:start --port=80 --allow-all-ip