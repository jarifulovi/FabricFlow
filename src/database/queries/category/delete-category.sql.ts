// Bulk soft delete
export const bulkSoftDeleteCategoriesSQL = `
UPDATE categories
SET is_deleted = true,
    deleted_at = CURRENT_TIMESTAMP
WHERE id = ANY($1::uuid[])
RETURNING *;
`;

export const buildBulkSoftDeleteCategoriesQuery = (ids: string[]) => ({
  text: bulkSoftDeleteCategoriesSQL,
  values: [ids],
});

// Bulk hard delete (restricted / future)
export const bulkHardDeleteCategoriesSQL = `
DELETE FROM categories
WHERE id = ANY($1::uuid[])
RETURNING *;
`;

export const buildBulkHardDeleteCategoriesQuery = (ids: string[]) => ({
  text: bulkHardDeleteCategoriesSQL,
  values: [ids],
});