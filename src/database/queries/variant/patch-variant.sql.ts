import { productVariantColumnMapping, UpdateProductVariantInput } from '../../types/variant';

export const buildPatchVariantQuery = (id: string, input: UpdateProductVariantInput) => {
  const fields: string[] = [];
  const values: any[] = [];
  let counter = 1;

  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined && productVariantColumnMapping[key]) {
      fields.push(`${productVariantColumnMapping[key]} = $${counter}`);
      values.push(value);
      counter++;
    }
  }

  if (fields.length === 0) throw new Error('No fields provided for patch');

  fields.push(`updated_at = CURRENT_TIMESTAMP`);
  const text = `
    UPDATE product_variants
    SET ${fields.join(', ')}
    WHERE id = $${counter}
    RETURNING *;
  `;
  values.push(id);

  return { text, values };
};
