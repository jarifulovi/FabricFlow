export type MovementType = 'IN' | 'OUT' | 'ADJUSTMENT';
export type ItemType = 'product_variant' | 'raw_material';
export type MovementSource = 
  | 'receiving_slip_purchase'
  | 'receiving_slip_production'
  | 'purchase_order'
  | 'sale_order'
  | 'manual_adjustment';

export interface InventoryMovement {
  id: string;
  itemId: string;          // UUID - reference to product variant or raw material
  warehouseId: string;     // UUID
  quantity: number;
  movementType: MovementType;
  itemType: ItemType;      // Type of item being moved
  sourceType: MovementSource;
  sourceId?: string;       // UUID - reference to source document
  batchId?: string;        // UUID - optional batch reference for raw materials
  price?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Derived types for queries
export type CreateInventoryMovementInput = Omit<InventoryMovement, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateInventoryMovementInput = Partial<CreateInventoryMovementInput>;
export type InventoryMovementRow = Omit<InventoryMovement, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};

export const inventoryMovementColumnMapping: Record<string, string> = {
  itemId: 'item_id',
  warehouseId: 'warehouse_id',
  quantity: 'quantity',
  movementType: 'movement_type',
  itemType: 'item_type',
  sourceType: 'source_type',
  sourceId: 'source_id',
  batchId: 'batch_id',
  price: 'price',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
};
