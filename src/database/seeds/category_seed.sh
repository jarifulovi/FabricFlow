#!/bin/bash

# Category seed script
# Usage: ./category_seed.sh [create|clear]

DB_HOST="localhost"
DB_PORT="5432"
DB_USER="postgres"
DB_PASSWORD="postgres"
DB_NAME="fabricflow"

# Set password for non-interactive execution
export PGPASSWORD="$DB_PASSWORD"

create_categories() {
    echo "🌱 Creating basic categories..."
    
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "src/database/seeds/categories.sql"

    if [ $? -eq 0 ]; then
        echo "✅ Category seeds completed successfully!"
    else
        echo "❌ Failed to create categories"
        exit 1
    fi
}

clear_categories() {
    echo "🗑️  Clearing all categories..."
    
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" << EOF
DELETE FROM categories;
EOF

    if [ $? -eq 0 ]; then
        echo "✅ All categories cleared successfully!"
    else
        echo "❌ Failed to clear categories"
        exit 1
    fi
}

case "$1" in
    "create")
        create_categories
        ;;
    "clear")
        clear_categories
        ;;
    *)
        echo "Usage: $0 {create|clear}"
        echo "  create  - Create basic categories"
        echo "  clear   - Clear all categories"
        exit 1
        ;;
esac