export interface ReceivingSlipLine {
  id: string;
  slipId: string;      // UUID
  variantId?: string;  // UUID
  vendorSku?: string;
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
  variantId: 'variant_id',
  vendorSku: 'vendor_sku',
  quantity: 'quantity',
  price: 'price',
  notes: 'notes',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
};
