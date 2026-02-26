# Database Migrations

This directory contains SQL migration files for database schema management.

## Naming Convention

Migrations follow this pattern:
```
{version_number}_{description}.sql
```

Examples:
- `000_migration_tracker.sql` - Creates the migration tracking table
- `001_create_products_table.sql` - Creates products table
- `002_create_customers_table.sql` - Creates customers table

## Migration Order

Migrations are executed in numerical order based on the version number prefix.


## Execution Flow

Intended flow is:

1. **Docker Compose Up** → Starts PostgreSQL container
2. **Run Migrations** → Creates tables and schema
3. **Start Server** → Application connects to configured database

## Best Practices

- Never modify executed migrations
- Always create new migration files for schema changes
- Test both UP and DOWN migrations
- Keep migrations atomic (one logical change per file)
- Include indexes and constraints in table creation
- Add comments for complex logic


## Phase-1 Limitations
1. **Multi-tenant / central garments management**

   * No support for multiple tenants, branches, or centralized garment tracking. Phase 1 assumes a single warehouse context.

2. **Raw materials & purchase orders**

   * Raw material inventory and purchase order workflows are excluded.
   * Only finished products / variants are tracked.

3. **Adjustment invoices / manual corrections**

   * Manual stock adjustments and adjustment-type invoices are not implemented in phase 1.
   * Movements can be added for manual adjustments in future phases.

4. **Vendor management**

   * No dedicated vendor table yet.
   * Vendor information is handled via `vendor_sku` on product variants and receiving slip lines.

5. **User / audit tracking**

   * No user table or authentication/authorization is implemented.
   * `created_by` field exists as a placeholder for future user tracking.

6. **Slip updates**

   * Receiving slips are **immutable**.
   * Once created, line items and movements cannot be updated in phase 1.

7. **Performance optimizations**

   * No caching, materialized views, or stock summary tables are implemented.
   * Phase 1 focuses on functional correctness; performance optimization deferred to later phases.

8. **Advanced warehouse slotting**

   * No structured storage (rack/shelf/bin) — only a flexible `location` field is used.
   * Detailed slotting will be added in future phases if required.

---