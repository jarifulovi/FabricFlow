export interface ReceivingSlipLine {
  id: string;
  slipId: string;        // UUID - required, every line must belong to a slip
  lineNumber: number;    // Line item sequence number for ordering within the slip
  warehouseId?: string;  // UUID - optional, if null uses slip's warehouse
  variantId: string;     // UUID - required
  vendorSku?: string;    // Optional SKU provided by vendor
  quantity: number;
  price?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Derived types for queries
export type CreateReceivingSlipLineInput = Omit<ReceivingSlipLine, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateReceivingSlipLineInput = Partial<CreateReceivingSlipLineInput>;
export type ReceivingSlipLineRow = Omit<ReceivingSlipLine, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};

export const receivingSlipLineColumnMapping: Record<string, string> = {
  slipId: 'slip_id',
  lineNumber: 'line_number',
  warehouseId: 'warehouse_id',
  variantId: 'variant_id',
  vendorSku: 'vendor_sku',
  quantity: 'quantity',
  price: 'price',
  notes: 'notes',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
};
