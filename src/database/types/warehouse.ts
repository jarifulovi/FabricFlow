export interface Warehouse {
  id: string;
  name: string;
  location?: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

// Derived types for queries
export type CreateWarehouseInput = Omit<Warehouse, 'id' | 'createdAt' | 'updatedAt' | 'isActive' | 'isDeleted' | 'deletedAt'>;
export type UpdateWarehouseInput = Partial<CreateWarehouseInput> & { isActive?: boolean };
export type WarehouseRow = Omit<Warehouse, 'createdAt' | 'updatedAt' | 'deletedAt'> & {
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
};

export const warehouseColumnMapping: Record<string, string> = {
  name: 'name',
  location: 'location',
  isActive: 'is_active',
  isDeleted: 'is_deleted',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
};
