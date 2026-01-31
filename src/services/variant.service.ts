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
    // Business validation
    if (!input.sku || input.sku.trim().length === 0) {
      throw new Error('Variant SKU is required');
    }
    if (!input.productId) {
      throw new Error('Product ID is required');
    }

    return await variantRepo.create(input);
  },

  async update(id: string, input: UpdateProductVariantInput): Promise<ProductVariantRow> {
    const existing = await variantRepo.findById(id);
    if (!existing) {
      throw new Error('Variant not found');
    }

    if (input.sku !== undefined && input.sku.trim().length === 0) {
      throw new Error('Variant SKU cannot be empty');
    }

    return await variantRepo.update(id, input);
  },

  async findById(id: string): Promise<ProductVariantWithProductRow> {
    const variant = await variantRepo.findById(id);
    if (!variant) {
      throw new Error('Variant not found');
    }
    return variant;
  },

  async findBySku(sku: string): Promise<ProductVariantWithProductRow> {
    const variant = await variantRepo.findBySku(sku);
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
    const { page, pageSize, ...rest } = filters || {};
    const limit = pageSize;
    const offset = page && pageSize ? (page - 1) * pageSize : undefined;
    
    return await variantRepo.findAll({ ...rest, limit, offset });
  },

  async findAllDefault(): Promise<ProductVariantListRow[]> {
    return await variantRepo.findAll({
      sortBy: 'sku',
      sortOrder: 'asc',
    });
  },

  async softDelete(id: string): Promise<ProductVariantRow> {
    const existing = await variantRepo.findById(id);
    if (!existing) {
      throw new Error('Variant not found');
    }

    return await variantRepo.softDelete(id);
  },
};
