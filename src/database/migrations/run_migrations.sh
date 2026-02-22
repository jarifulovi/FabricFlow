#!/bin/bash

# Save DB_NAME if already set by calling script (e.g., for test database)
SAVED_DB_NAME="$DB_NAME"

set -a
source "$(dirname "$0")/../../../.env"
set +a

# Restore DB_NAME if it was set before sourcing .env
if [ -n "$SAVED_DB_NAME" ]; then
  DB_NAME="$SAVED_DB_NAME"
fi

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