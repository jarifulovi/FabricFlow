export const selectBrandByIdSQL = `
SELECT
  b.*,
  COALESCE(pc.products_count, 0)::int AS products_count
FROM brands b
LEFT JOIN (
  SELECT brand_id, COUNT(*)::int AS products_count
  FROM products
  WHERE is_deleted = false
  GROUP BY brand_id
) pc ON pc.brand_id = b.id
WHERE b.id = $1;
`;

export const buildSelectBrandByIdQuery = (id: string) => ({
  text: selectBrandByIdSQL,
  values: [id],
});
