export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string;
  brandName?: string;
  brandCode?: string;
  categoryId: string;  // UUID
  status: 'active' | 'inactive' | 'discontinued';
  unit: 'piece' | 'meter' | 'yard' | 'kilogram' | 'roll' | 'bundle';
  isDeleted: boolean;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

// Derived types for queries
export type CreateProductInput = Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'isDeleted'>;
export type UpdateProductInput = Partial<CreateProductInput>;
export type ProductRow = Omit<Product, 'createdAt' | 'updatedAt' | 'deletedAt'> & {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export const productColumnMapping: Record<string, string> = {
  sku: 'sku',
  name: 'name',
  description: 'description',
  brandName: 'brand_name',
  brandCode: 'brand_code',
  categoryId: 'category_id',
  status: 'status',
  unit: 'unit',
  tags: 'tags',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
};

