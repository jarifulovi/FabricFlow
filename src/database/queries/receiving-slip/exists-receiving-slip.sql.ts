import { SlipStatus, SlipType } from '../../types/receiving-slip';

export const buildExistsReceivingSlipQuery = (filters?: {
  id?: string; // check if this id exists
  type?: SlipType;
  status?: SlipStatus;
  warehouseId?: string;
  createdBy?: string;
  search?: string;
}) => {
  let text = `SELECT EXISTS(SELECT 1 FROM receiving_slips`;
  const values: string[] = [];
  let counter = 1;
  let whereAdded = false;

  if (filters) {
    if (filters.type) {
      text += ` WHERE type = $${counter}`;
      counter++;
      values.push(filters.type);
      whereAdded = true;
    }
    if (filters.status) {
      text += whereAdded ? ' AND' : ' WHERE';
      text += ` status = $${counter}`;
      counter++;
      values.push(filters.status);
      whereAdded = true;
    }
    if (filters.warehouseId) {
      text += whereAdded ? ' AND' : ' WHERE';
      text += ` warehouse_id = $${counter}`;
      counter++;
      values.push(filters.warehouseId);
      whereAdded = true;
    }
    if (filters.createdBy) {
      text += whereAdded ? ' AND' : ' WHERE';
      text += ` created_by = $${counter}`;
      counter++;
      values.push(filters.createdBy);
      whereAdded = true;
    }
    if (filters.id) {
      text += whereAdded ? ' AND' : ' WHERE';
      text += ` id = $${counter}`;
      counter++;
      values.push(filters.id);
      whereAdded = true;
    }
    if (filters.search) {
      text += whereAdded ? ' AND' : ' WHERE';
      text += ` slip_number ILIKE $${counter}`;
      values.push(`%${filters.search}%`);
      counter++;
    }
  }

  text += ') as exists';

  return { text, values };
};
