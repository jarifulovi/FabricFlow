import { productRepo } from '../database/repositories/index';
import {
  CreateProductInput,
  UpdateProductInput,
  ProductRow,
} from '../database/types/product';

export const productService = {
  async create(input: CreateProductInput): Promise<ProductRow> {
    // Business validation
    if (!input.sku || input.sku.trim().length === 0) {
      throw new Error('Product SKU is required');
    }
    if (!input.name || input.name.trim().length === 0) {
      throw new Error('Product name is required');
    }

    return await productRepo.create(input);
  },

  async update(id: string, input: UpdateProductInput): Promise<ProductRow> {
    const existing = await productRepo.findById(id);
    if (!existing) {
      throw new Error('Product not found');
    }

    if (input.name !== undefined && input.name.trim().length === 0) {
      throw new Error('Product name cannot be empty');
    }

    return await productRepo.update(id, input);
  },

  async findById(id: string): Promise<ProductRow> {
    const product = await productRepo.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  },

  async findBySku(sku: string): Promise<ProductRow> {
    const product = await productRepo.findBySku(sku);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  },

  async findAll(filters?: {
    categoryId?: string;
    status?: 'active' | 'inactive' | 'discontinued';
    includeDeleted?: boolean;
    sortBy?: 'name' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
  }): Promise<ProductRow[]> {
    const { page, pageSize, ...rest } = filters || {};
    const limit = pageSize;
    const offset = page && pageSize ? (page - 1) * pageSize : undefined;
    
    return await productRepo.findAll({ ...rest, limit, offset });
  },

  async findAllDefault(): Promise<ProductRow[]> {
    return await productRepo.findAll({
      status: 'active',
      sortBy: 'name',
      sortOrder: 'asc',
    });
  },

  async softDelete(id: string): Promise<ProductRow> {
    const existing = await productRepo.findById(id);
    if (!existing) {
      throw new Error('Product not found');
    }

    return await productRepo.softDelete(id);
  },
};
