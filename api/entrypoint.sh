#!/bin/bash
set -e

# entrypoint.sh - Automates database setup on container start

# 1. Wait for Database
echo "Waiting for database connection..."
RETRIES=30
while [ $RETRIES -gt 0 ]; do
    # Using PHP to test connection because it's available in the container
    if php -r "try { new PDO('mysql:host=mysql;dbname=API', 'api', 'api123'); echo 'Connected'; } catch (PDOException \$e) { exit(1); }" > /dev/null 2>&1; then
        echo "Database is ready!"
        break
    else
        echo "Waiting for database... ($RETRIES retries left)"
        sleep 2
        RETRIES=$((RETRIES-1))
    fi
done

if [ $RETRIES -eq 0 ]; then
    echo "Error: Database connection failed."
    exit 1
fi

# 2. Run Migrations
echo "Running migrations..."
php bin/console doctrine:migrations:migrate --no-interaction

# 3. Load Mock Data (if empty)
echo "Checking mock data..."
php bin/console app:load-mock-data

# 4. Clear Cache (optional but good for dev)
php bin/console cache:clear

# 5. Start Server
echo "Starting Symfony server..."
exec symfony server:start --port=80 --allow-all-ip --no-tls
