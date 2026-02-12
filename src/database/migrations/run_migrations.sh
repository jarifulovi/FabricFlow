#!/bin/bash
set -a
source "$(dirname "$0")/../../../.env"
set +a

MIGRATIONS_DIR="$(dirname "$0")"

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