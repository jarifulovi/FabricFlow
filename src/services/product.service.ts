import { categoryRepo, productRepo } from '../database/repositories';
import { deleteProductTransaction } from '../database/transactions';
import {
  CreateProductInput,
  UpdateProductInput,
  ProductRow,
  ProductFindAllFilters,
} from '../database/types/product';
import { ProductApiQuery } from '../types/product.types';
import { NotFoundError, ConflictError } from '../utils/errors';



export const productService = {
  async create(input: CreateProductInput): Promise<ProductRow> {
    // Check if SKU already exists (excluding deleted products)
    const existingBySku = await productRepo.exists({ sku: input.sku, includeDeleted: false });
    if (existingBySku) {
      throw new ConflictError('Product with the same SKU already exists');
    }
    // Check if category exists and is of type 'product'
    const existingCategory = await categoryRepo.exists({ id: input.categoryId, type: 'product', includeDeleted: false });
    if (!existingCategory) {
      throw new NotFoundError('Category not found or is not a product category');
    }

    return await productRepo.create(input);
  },

  async update(id: string, input: UpdateProductInput): Promise<ProductRow> {
    // Verify product exists (excluding deleted products)
    const existing = await productRepo.exists({ id, includeDeleted: false });
    if (!existing) {
      throw new NotFoundError('Product not found');
    }
    // Check if category exists and is of type 'product'
    if (input.categoryId) {
      const existingCategory = await categoryRepo.exists({ id: input.categoryId, type: 'product', includeDeleted: false });
      if (!existingCategory) {
        throw new NotFoundError('Category not found or is not a product category');
      }
    }
    // Check if sku already exists for another product (excluding deleted products) - only when SKU is being updated
    if (input.sku) {
      const existingBySku = await productRepo.exists({ sku: input.sku, excludeIds: [id], includeDeleted: false });
      if (existingBySku) {
        throw new ConflictError('Another product with the same SKU already exists');
      }
    }

    return await productRepo.update(id, input);
  },

  async findById(id: string): Promise<ProductRow> {
    const product = await productRepo.findById(id, false); // Explicitly exclude deleted
    if (!product) {
      throw new NotFoundError('Product not found');
    }
    return product;
  },

  async findBySku(sku: string): Promise<ProductRow> {
    const product = await productRepo.findBySku(sku, false); // Explicitly exclude deleted
    if (!product) {
      throw new NotFoundError('Product not found');
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
      throw new NotFoundError('Product not found');
    }

    return await deleteProductTransaction(id, false);
  },

  async hardDelete(id: string): Promise<ProductRow> {
    // Verify product exists (including deleted products, since we want to hard delete)
    const existing = await productRepo.exists({ id, includeDeleted: true });
    if (!existing) {
      throw new NotFoundError('Product not found');
    }

    return await deleteProductTransaction(id, true);
  }
};
