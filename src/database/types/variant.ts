import { z } from 'zod/v4';

// Zod Schema - Single source of truth
export const productVariantSchema = z.object({
  id: z.uuid({ message: 'Invalid variant ID' }),
  productId: z.uuid({ message: 'Invalid product ID' }),
  sku: z.string({ message: 'SKU is required' }).min(1, 'SKU cannot be empty').max(500, 'SKU is too long'),
  vendorSku: z.string().max(500, 'Vendor SKU is too long').optional().nullable(),
  color: z.string().max(500, 'Color is too long').optional().nullable(),
  size: z.string().max(500, 'Size is too long').optional().nullable(),
  gender: z.string().max(500, 'Gender is too long').optional().nullable(),
  season: z.string().max(500, 'Season is too long').optional().nullable(),
  fit: z.string().max(500, 'Fit is too long').optional().nullable(),
  price: z.number({ message: 'Price must be a number' }).nonnegative('Price cannot be negative').optional().nullable(),
  reorderLevel: z.number({ message: 'Reorder level must be a number' }).int('Reorder level must be an integer').nonnegative('Reorder level cannot be negative').optional().nullable(),
  isDeleted: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().optional().nullable(),
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