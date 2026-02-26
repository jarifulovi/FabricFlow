export const buildExistsReceivingSlipLineQuery = (filters?: {
  id?: string; // check if this id exists
  slipId?: string;
  warehouseId?: string;
  variantId?: string;
}) => {
  let text = `SELECT EXISTS(SELECT 1 FROM receiving_slip_lines`;
  const values: string[] = [];
  let counter = 1;
  let whereAdded = false;

  if (filters) {
    if (filters.slipId) {
      text += ` WHERE slip_id = $${counter}`;
      counter++;
      values.push(filters.slipId);
      whereAdded = true;
    }
    if (filters.warehouseId) {
      text += whereAdded ? ' AND' : ' WHERE';
      text += ` warehouse_id = $${counter}`;
      counter++;
      values.push(filters.warehouseId);
      whereAdded = true;
    }
    if (filters.variantId) {
      text += whereAdded ? ' AND' : ' WHERE';
      text += ` variant_id = $${counter}`;
      counter++;
      values.push(filters.variantId);
      whereAdded = true;
    }
    if (filters.id) {
      text += whereAdded ? ' AND' : ' WHERE';
      text += ` id = $${counter}`;
      counter++;
      values.push(filters.id);
    }
  }

  text += ') as exists';

  return { text, values };
};
