// Bulk soft delete
export const bulkSoftDeleteWarehousesSQL = `
UPDATE warehouses
SET is_deleted = true,
    deleted_at = CURRENT_TIMESTAMP
WHERE id = ANY($1::uuid[])
RETURNING *;
`;

export const buildBulkSoftDeleteWarehousesQuery = (ids: string[]) => ({
  text: bulkSoftDeleteWarehousesSQL,
  values: [ids],
});

// Bulk hard delete (restricted / future)
export const bulkHardDeleteWarehousesSQL = `
DELETE FROM warehouses
WHERE id = ANY($1::uuid[])
RETURNING *;
`;

export const buildBulkHardDeleteWarehousesQuery = (ids: string[]) => ({
  text: bulkHardDeleteWarehousesSQL,
  values: [ids],
});
