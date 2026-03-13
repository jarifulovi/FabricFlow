// Bulk soft delete
export const bulkSoftDeleteProductSQL = `
UPDATE products
SET is_deleted = true,
    deleted_at = CURRENT_TIMESTAMP,
    brand_id = NULL
WHERE id = ANY($1::uuid[])
RETURNING *;
`;

export const buildBulkSoftDeleteProductQuery = (ids: string[]) => ({
  text: bulkSoftDeleteProductSQL,
  values: [ids],
});

// Bulk hard delete (restricted / future)
export const bulkHardDeleteProductSQL = `
DELETE FROM products
WHERE id = ANY($1::uuid[])
RETURNING *;
`;

export const buildBulkHardDeleteProductQuery = (ids: string[]) => ({
  text: bulkHardDeleteProductSQL,
  values: [ids],
});

