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
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

// Derived types for queries
export type CreateProductVariantInput = Omit<ProductVariant, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'isDeleted'>;
export type UpdateProductVariantInput = Partial<CreateProductVariantInput>;
export type ProductVariantRow = Omit<ProductVariant, 'createdAt' | 'updatedAt' | 'deletedAt'> & {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

// Extended type with full product details (for single GET operations)
export type ProductVariantWithProductRow = ProductVariantRow & {
  product: {
    id: string;
    sku: string;
    name: string;
    description?: string;
    brandName?: string;
    brandCode?: string;
    categoryId: string;
    categoryName: string;
    status: string;
    unit: string;
    isDeleted: boolean;
    tags?: string[];
  };
};

// Extended type with basic product info (for list GET operations)
export type ProductVariantListRow = ProductVariantRow & {
  productSku: string;
  productName: string;
  categoryName: string;
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
  isDeleted: 'is_deleted',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
};