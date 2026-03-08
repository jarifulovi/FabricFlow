import { warehouseColumnMapping, UpdateWarehouseInput } from '../../types/warehouse';

export const buildPatchWarehouseQuery = (id: string, input: UpdateWarehouseInput) => {
  const fields: string[] = [];
  const values: any[] = [];
  let counter = 1;

  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined && warehouseColumnMapping[key]) {
      fields.push(`${warehouseColumnMapping[key]} = $${counter}`);
      values.push(value);
      counter++;
    }
  }


  fields.push(`updated_at = CURRENT_TIMESTAMP`);
  const text = `
    UPDATE warehouses
    SET ${fields.join(', ')}
    WHERE id = $${counter}
    RETURNING *;
  `;
  values.push(id);

  return { text, values };
};
