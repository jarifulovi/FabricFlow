export interface ProductVariant {
  id: string;
  productId: string;  // UUID
  sku: string;
  vendorSku?: string;
  color?: string;
  size?: string;
  gender?: string;
  season?: string;
  fit?: string;
  price?: number;
  reorderLevel?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Derived types for queries
export type CreateProductVariantInput = Omit<ProductVariant, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>;
export type UpdateProductVariantInput = Partial<CreateProductVariantInput>;
export type ProductVariantRow = Omit<ProductVariant, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};

export const productVariantColumnMapping: Record<string, string> = {
  productId: 'product_id',
  sku: 'sku',
  vendorSku: 'vendor_sku',
  color: 'color',
  size: 'size',
  gender: 'gender',
  season: 'season',
  fit: 'fit',
  price: 'price',
  reorderLevel: 'reorder_level',
  isActive: 'is_active',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
};