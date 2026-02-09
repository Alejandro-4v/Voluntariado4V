#!/bin/bash
set -e

# Wait for MySQL
echo "Waiting for database..."
until mysqladmin ping -h mysql -u api -papi123 --silent; do
    echo "Waiting for database connection..."
    sleep 2
done
echo "Database is ready!"

# Reset Database
echo "Scanning for existing tables to drop..."
# Disable foreign key checks for the session
mysql -h mysql -u api -papi123 API -e "SET FOREIGN_KEY_CHECKS = 0;"

# Drop all tables
mysql -h mysql -u api -papi123 API -Nse 'SHOW TABLES' | while read table; do
    echo "Dropping table $table..."
    mysql -h mysql -u api -papi123 API -e "SET FOREIGN_KEY_CHECKS = 0; DROP TABLE IF EXISTS $table"
done

# Run Init Script
echo "Running init.sql..."
mysql -h mysql -u api -papi123 API < /api/db_scripts/init.sql

# Run Mock Data
echo "Running mock_populate.sql..."
mysql -h mysql -u api -papi123 API < /api/db_scripts/mock_populate.sql

# Clear Cache
echo "Clearing Symfony cache..."
php bin/console cache:clear

# Start Server
echo "Starting Symfony server..."
exec symfony server:start --port=80 --allow-all-ip --no-tls
