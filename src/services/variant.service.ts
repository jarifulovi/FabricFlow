import { variantRepo } from '../database/repositories/index';
import {
  CreateProductVariantInput,
  UpdateProductVariantInput,
  ProductVariantRow,
  ProductVariantWithProductRow,
  ProductVariantListRow,
} from '../database/types/variant';

export const variantService = {
  async create(input: CreateProductVariantInput): Promise<ProductVariantRow> {
    // Check if variant SKU already exists (excluding deleted variants)
    const existingBySku = await variantRepo.exists({ sku: input.sku, includeDeleted: false });
    if (existingBySku) {
      throw new Error('Variant with the same SKU already exists');
    }

    return await variantRepo.create(input);
  },

  async update(id: string, input: UpdateProductVariantInput): Promise<ProductVariantRow> {
    // Verify variant exists (excluding deleted variants)
    const existing = await variantRepo.exists({ id, includeDeleted: false });
    if (!existing) {
      throw new Error('Variant not found');
    }

    return await variantRepo.update(id, input);
  },

  async findById(id: string): Promise<ProductVariantWithProductRow> {
    const variant = await variantRepo.findById(id, false); // Explicitly exclude deleted
    if (!variant) {
      throw new Error('Variant not found');
    }
    return variant;
  },

  async findBySku(sku: string): Promise<ProductVariantWithProductRow> {
    const variant = await variantRepo.findBySku(sku, false); // Explicitly exclude deleted
    if (!variant) {
      throw new Error('Variant not found');
    }
    return variant;
  },

  async findAll(filters?: {
    productId?: string;
    includeDeleted?: boolean;
    sortBy?: 'sku' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
  }): Promise<ProductVariantListRow[]> {
    const { page, pageSize, includeDeleted = false, ...rest } = filters || {};
    const limit = pageSize;
    const offset = page && pageSize ? (page - 1) * pageSize : undefined;
    
    return await variantRepo.findAll({ ...rest, includeDeleted, limit, offset });
  },

  async findAllDefault(): Promise<ProductVariantListRow[]> {
    return await variantRepo.findAll({
      includeDeleted: false, // Explicitly exclude deleted variants
      sortBy: 'sku',
      sortOrder: 'asc',
    });
  },

  async softDelete(id: string): Promise<ProductVariantRow> {
    // Verify variant exists (excluding already deleted variants)
    const existing = await variantRepo.exists({ id, includeDeleted: false });
    if (!existing) {
      throw new Error('Variant not found');
    }

    return await variantRepo.softDelete(id);
  },
};
