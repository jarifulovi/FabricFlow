import { categoryRepo, productRepo, variantRepo } from '../database/repositories/index';
import {
  CreateProductInput,
  UpdateProductInput,
  ProductRow,
  ProductStatus,
  ProductFindAllFilters,
} from '../database/types/product';
import { ProductApiQuery } from '../types/product.types';

export const productService = {
  async create(input: CreateProductInput): Promise<ProductRow> {
    // Check if SKU already exists (excluding deleted products)
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
    // Check if sku already exists for another product (excluding deleted products)
    const existingBySku = await productRepo.exists({ sku: input.sku, excludeIds: [id], includeDeleted: false });
    if (existingBySku) {
      throw new Error('Another product with the same SKU already exists');
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

  async findAll(filters?: ProductApiQuery): Promise<ProductRow[]> {
    const { page, pageSize, includeDeleted = false, ...rest } = filters || {};
    
    // Convert API params to database filters
    const dbFilters: ProductFindAllFilters = {
      ...rest,
      includeDeleted,
      limit: pageSize,
      offset: page && pageSize ? (page - 1) * pageSize : undefined
    };
    
    return await productRepo.findAll(dbFilters);
  },

  async findAllDefault(params?: Pick<ProductApiQuery, 'page' | 'pageSize'>): Promise<ProductRow[]> {
    const { page, pageSize } = params || {};
    
    // Convert to database filters
    const dbFilters: ProductFindAllFilters = {
      status: 'active',
      includeDeleted: false,
      sortBy: 'name',
      sortOrder: 'asc',
      limit: pageSize,
      offset: page && pageSize ? (page - 1) * pageSize : undefined
    };
    
    return await productRepo.findAll(dbFilters);
  },

  async softDelete(id: string): Promise<ProductRow> {
    // Verify product exists (excluding already deleted products)
    const existing = await productRepo.exists({ id, includeDeleted: false });
    if (!existing) {
      throw new Error('Product not found');
    }

    // Check if product has variants before deleting (put it in transactions)
    const variantCount = await variantRepo.count({ productId: id, includeDeleted: false });
    if (variantCount > 0) {
      throw new Error('Cannot delete product that has variants. Delete variants first.');
    }

    return await productRepo.softDelete(id);
  },
};
