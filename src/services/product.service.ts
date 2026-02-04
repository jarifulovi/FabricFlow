import { categoryRepo, productRepo, variantRepo } from '../database/repositories/index';
import {
  CreateProductInput,
  UpdateProductInput,
  ProductRow,
} from '../database/types/product';

export const productService = {
  async create(input: CreateProductInput): Promise<ProductRow> {
    // Business validation: Check if SKU already exists (excluding deleted products)
    const existingBySku = await productRepo.exists({ sku: input.sku, includeDeleted: false });
    if (existingBySku) {
      throw new Error('Product with the same SKU already exists');
    }
    // Check if category exists
    const existingCategory = await categoryRepo.exists({ id: input.categoryId, includeDeleted: false });
    if (!existingCategory) {
      throw new Error('Category not found');
    }

    return await productRepo.create(input);
  },

  async update(id: string, input: UpdateProductInput): Promise<ProductRow> {
    // Verify product exists (excluding deleted products)
    const existing = await productRepo.exists({ id, includeDeleted: false });
    if (!existing) {
      throw new Error('Product not found');
    }
    // Check if category exists
    if (input.categoryId) {
      const existingCategory = await categoryRepo.exists({ id: input.categoryId, includeDeleted: false });
      if (!existingCategory) {
        throw new Error('Category not found from service');
      }
    }


    return await productRepo.update(id, input);
  },

  async findById(id: string): Promise<ProductRow> {
    const product = await productRepo.findById(id, false); // Explicitly exclude deleted
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  },

  async findBySku(sku: string): Promise<ProductRow> {
    const product = await productRepo.findBySku(sku, false); // Explicitly exclude deleted
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  },

  async findAll(filters?: {
    categoryId?: string;
    search?: string;
    status?: 'active' | 'inactive' | 'discontinued';
    tag?: string; // Add tag parameter
    includeDeleted?: boolean;
    sortBy?: 'name' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
  }): Promise<ProductRow[]> {
    const { page, pageSize, search, includeDeleted = false, ...rest } = filters || {};
    const limit = pageSize;
    const offset = page && pageSize ? (page - 1) * pageSize : undefined;
    
    return await productRepo.findAll({ 
      ...rest, 
      ...(search && { search }), // Map search parameter
      includeDeleted, // Explicitly pass the defaulted value
      limit, 
      offset 
    });
  },

  async findAllDefault(params?: { page?: number; pageSize?: number }): Promise<ProductRow[]> {
    const { page, pageSize } = params || {};
    const limit = pageSize;
    const offset = page && pageSize ? (page - 1) * pageSize : undefined;
    return await productRepo.findAll({
      status: 'active',
      includeDeleted: false, // Explicitly exclude deleted products
      sortBy: 'name',
      sortOrder: 'asc',
      limit,
      offset,
    });
  },

  async softDelete(id: string): Promise<ProductRow> {
    // Verify product exists (excluding already deleted products)
    const existing = await productRepo.exists({ id, includeDeleted: false });
    if (!existing) {
      throw new Error('Product not found');
    }

    // Check if product has variants before deleting
    const variantCount = await variantRepo.count({ productId: id, includeDeleted: false });
    if (variantCount > 0) {
      throw new Error('Cannot delete product that has variants. Delete variants first.');
    }

    return await productRepo.softDelete(id);
  },
};
