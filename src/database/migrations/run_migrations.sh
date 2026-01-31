#!/bin/bash

DB_HOST="localhost"
DB_PORT="5432"
DB_USER="postgres"
DB_PASSWORD="postgres"
DB_NAME="fabricflow"
MIGRATIONS_DIR="src/database/migrations"

# Set password for non-interactive execution
export PGPASSWORD="$DB_PASSWORD"

echo "Dropping all tables..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
DO \$\$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END
\$\$;
"

echo "Running all migrations sequentially..."
for file in "$MIGRATIONS_DIR"/*.sql; do
    echo "Running $file"
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$file"
done

echo "Done."