export type SlipType = 'purchase' | 'production';
export type SlipStatus = 'draft' | 'confirmed' | 'cancelled';

export interface ReceivingSlip {
  id: string;
  slipNumber: string;
  type: SlipType;
  status: SlipStatus;
  date: Date;
  warehouseId: string;  // UUID
  createdBy?: string;    // UUID
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Derived types for queries
export type CreateReceivingSlipInput = Omit<ReceivingSlip, 'id' | 'createdAt' | 'updatedAt' | 'status'>;
export type UpdateReceivingSlipInput = Partial<CreateReceivingSlipInput>;
export type ReceivingSlipRow = Omit<ReceivingSlip, 'createdAt' | 'updatedAt' | 'date'> & {
  createdAt: string;
  updatedAt: string;
  date: string;
};

export const receivingSlipColumnMapping: Record<string, string> = {
  slipNumber: 'slip_number',
  type: 'type',
  status: 'status',
  date: 'date',
  warehouseId: 'warehouse_id',
  createdBy: 'created_by',
  notes: 'notes',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
};
