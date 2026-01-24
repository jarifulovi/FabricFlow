// Bulk soft delete (set is_deleted = true)
export const bulkSoftDeleteVariantSQL = `
UPDATE product_variants
SET is_deleted = true,
    deleted_at = CURRENT_TIMESTAMP
WHERE id = ANY($1::uuid[])
RETURNING *;
`;

export const buildBulkSoftDeleteVariantQuery = (ids: string[]) => ({
  text: bulkSoftDeleteVariantSQL,
  values: [ids],
});

// Bulk hard delete (restricted / future)
export const bulkHardDeleteVariantSQL = `
DELETE FROM product_variants
WHERE id = ANY($1::uuid[])
RETURNING *;
`;

export const buildBulkHardDeleteVariantQuery = (ids: string[]) => ({
  text: bulkHardDeleteVariantSQL,
  values: [ids],
});
