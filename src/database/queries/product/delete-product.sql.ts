// Bulk soft delete
export const bulkSoftDeleteProductSQL = `
UPDATE products
SET is_deleted = true,
    deleted_at = CURRENT_TIMESTAMP
WHERE id = ANY($1::uuid[])
RETURNING *;
`;

export const buildBulkSoftDeleteProductQuery = (ids: string[]) => ({
  text: bulkSoftDeleteProductSQL,
  values: [ids],
});

// Bulk hard delete (optional / future)
export const bulkHardDeleteProductSQL = `
DELETE FROM products
WHERE id = ANY($1::uuid[])
RETURNING *;
`;

export const buildBulkHardDeleteProductQuery = (ids: string[]) => ({
  text: bulkHardDeleteProductSQL,
  values: [ids],
});

