import { z } from 'zod/v4';

// Zod Schema - Single source of truth
export const productVariantSchema = z.object({
  id: z.uuid(),
  productId: z.uuid(),
  sku: z.string().min(1).max(500),
  vendorSku: z.string().max(500).optional(),
  color: z.string().max(500).optional(),
  size: z.string().max(500).optional(),
  gender: z.string().max(500).optional(),
  season: z.string().max(500).optional(),
  fit: z.string().max(500).optional(),
  price: z.number().nonnegative().optional(),
  reorderLevel: z.number().int().nonnegative().optional(),
  isDeleted: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().optional(),
});

export const createProductVariantSchema = productVariantSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  isDeleted: true,
});

export const updateProductVariantSchema = createProductVariantSchema.partial();

export const productVariantRowSchema = productVariantSchema.omit({
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
}).extend({
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable(),
});

// TypeScript types inferred from schemas
export type ProductVariant = z.infer<typeof productVariantSchema>;
export type CreateProductVariantInput = z.infer<typeof createProductVariantSchema>;
export type UpdateProductVariantInput = z.infer<typeof updateProductVariantSchema>;
export type ProductVariantRow = z.infer<typeof productVariantRowSchema>;

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