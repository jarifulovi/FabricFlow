export interface Warehouse {
  id: string;
  name: string;
  location?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Derived types for queries
export type CreateWarehouseInput = Omit<Warehouse, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>;
export type UpdateWarehouseInput = Partial<CreateWarehouseInput> & { isActive?: boolean };
export type WarehouseRow = Omit<Warehouse, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};

export const warehouseColumnMapping: Record<string, string> = {
  name: 'name',
  location: 'location',
  isActive: 'is_active',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
};
