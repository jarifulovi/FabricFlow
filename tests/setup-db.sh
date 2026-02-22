#!/bin/bash

# Load environment variables
set -a
source "$(dirname "$0")/../.env"
set +a

# Set test database name
TEST_DB_NAME="${TEST_DB_NAME:-fabricflow_test}"

# Set password for non-interactive execution
export PGPASSWORD="$DB_PASSWORD"

# Create test database if it doesn't exist
echo "Creating test database if not exists..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -tc "SELECT 1 FROM pg_database WHERE datname = '$TEST_DB_NAME'" | grep -q 1 || \
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c "CREATE DATABASE $TEST_DB_NAME"

# Run migrations for test database
echo "Running migrations for test database..."
DB_NAME="$TEST_DB_NAME" bash "$(dirname "$0")/../src/database/migrations/run_migrations.sh"

echo "Test database setup complete."