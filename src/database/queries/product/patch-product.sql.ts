import { productColumnMapping, UpdateProductInput } from '../../types/product';


export const buildPatchProductQuery = (id: string, input: UpdateProductInput) => {
  const fields: string[] = [];
  const values: any[] = [];
  let counter = 1;

  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined && productColumnMapping[key]) {
      fields.push(`${productColumnMapping[key]} = $${counter}`);
      values.push(value);
      counter++;
    }
  }

  fields.push(`updated_at = CURRENT_TIMESTAMP`);
  const text = `
    UPDATE products
    SET ${fields.join(', ')}
    WHERE id = $${counter}
    RETURNING *;
  `;
  values.push(id);

  return { text, values };
};
