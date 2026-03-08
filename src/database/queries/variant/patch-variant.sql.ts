import { variantColumnMapping, UpdateProductVariantInput } from '../../types/variant';

export const buildPatchVariantQuery = (id: string, input: UpdateProductVariantInput) => {
  const fields: string[] = [];
  const values: any[] = [];
  let counter = 1;

  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined && variantColumnMapping[key]) {
      fields.push(`${variantColumnMapping[key]} = $${counter}`);
      values.push(value);
      counter++;
    }
  }


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
