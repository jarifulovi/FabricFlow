import pool, { Pool, PoolClient } from './../connection';

import {
  buildInsertProductQuery,
  buildPatchProductQuery,
  buildBulkSoftDeleteProductQuery,
  buildBulkHardDeleteProductQuery,
  buildSelectProductsQuery,
  buildSelectProductByIdQuery,
  buildSelectProductByIdIncludedDeletedQuery,
  buildSelectProductBySkuQuery,
  buildSelectProductBySkuIncludedDeletedQuery,
  buildCountProductsQuery,
  buildExistsProductQuery,
} from './../queries/index';
import { ProductRow, CreateProductInput, UpdateProductInput } from './../types/product';
import { dbValidator } from '../validators/base.validator';


export const productRepo = {
  async create(input: CreateProductInput, executor?: Pool | PoolClient): Promise<ProductRow> {
    const db = executor || pool;
    if (!dbValidator.isValidString(input.sku)) {
      throw new Error('Invalid product SKU');
    }
    if (!dbValidator.isValidString(input.name)) {
      throw new Error('Invalid product name');
    }
    if (!dbValidator.isValidUUID(input.categoryId)) {
      throw new Error('Invalid category ID');
    }
    if (!dbValidator.isValidString(input.description, 500, true)) {
      throw new Error('Invalid product description');
    }
    if (!dbValidator.isValidString(input.brandName, 500, true)) {
      throw new Error('Invalid brand name');
    }
    if (!dbValidator.isValidString(input.brandCode, 500, true)) {
      throw new Error('Invalid brand code');
    }
    const { text, values } = buildInsertProductQuery(input);
    const result = await db.query<ProductRow>(text, values);
    return result.rows[0];
  },

  async update(id: string, input: UpdateProductInput, executor?: Pool | PoolClient): Promise<ProductRow> {
    const db = executor || pool;
    if (!dbValidator.isValidUUID(id)) {
      throw new Error('Invalid product ID');
    }
    if (!dbValidator.isValidString(input.sku, 500, true)) {
      throw new Error('Invalid product SKU');
    }
    if (!dbValidator.isValidString(input.name, 500, true)) {
      throw new Error('Invalid product name');
    }
    if (!dbValidator.isValidUUID(input.categoryId, true)) {
      throw new Error('Invalid category ID');
    }
    if (!dbValidator.isValidString(input.description, 500, true)) {
      throw new Error('Invalid product description');
    }
    if (!dbValidator.isValidEnum(input.status, ['active', 'inactive', 'discontinued'], true)) {
      throw new Error('Invalid product status');
    }
    if (!dbValidator.isValidEnum(input.unit, ['piece', 'meter', 'yard', 'kilogram', 'roll', 'bundle'], true)) {
      throw new Error('Invalid product unit');
    }
    if (!dbValidator.isValidString(input.brandName, 500, true)) {
      throw new Error('Invalid brand name');
    }
    if (!dbValidator.isValidString(input.brandCode, 500, true)) {
      throw new Error('Invalid brand code');
    }
    const { text, values } = buildPatchProductQuery(id, input);
    const result = await db.query<ProductRow>(text, values);
    return result.rows[0];
  },

  async findById(id: string, includeDeleted: boolean = false, executor?: Pool | PoolClient): Promise<ProductRow | null> {
    const db = executor || pool;
    if (!dbValidator.isValidUUID(id)) {
      throw new Error('Invalid product ID');
    }
    const { text, values } = includeDeleted 
      ? buildSelectProductByIdIncludedDeletedQuery(id)
      : buildSelectProductByIdQuery(id);
    const result = await db.query<ProductRow>(text, values);
    return result.rows[0] || null;
  },

  async findBySku(sku: string, includeDeleted: boolean = false, executor?: Pool | PoolClient): Promise<ProductRow | null> {
    const db = executor || pool;
    if (!dbValidator.isValidString(sku)) {
      throw new Error('Invalid product SKU');
    }
    const { text, values } = includeDeleted 
      ? buildSelectProductBySkuIncludedDeletedQuery(sku)
      : buildSelectProductBySkuQuery(sku);
    const result = await db.query<ProductRow>(text, values);
    return result.rows[0] || null;
  },

  async findAll(filters?: {
    categoryId?: string;
    status?: 'active' | 'inactive' | 'discontinued';
    tag?: string;
    search?: string;
    includeDeleted?: boolean;
    sortBy?: 'name' | 'createdAt' | 'updatedAt';
    sortOrder?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
  }, executor?: Pool | PoolClient): Promise<ProductRow[]> {
    const db = executor || pool;
    if (!dbValidator.isValidUUID(filters?.categoryId, true)) {
      throw new Error('Invalid category ID');
    }
    if (!dbValidator.isValidEnum(filters?.status, ['active', 'inactive', 'discontinued'], true)) {
      throw new Error('Invalid product status');
    }
    if (!dbValidator.isValidString(filters?.tag, 500, true)) {
      throw new Error('Invalid product tag');
    }
    if (!dbValidator.isValidString(filters?.search, 500, true)) {
      throw new Error('Invalid search string');
    }
    if (!dbValidator.isValidEnum(filters?.sortBy, ['name', 'createdAt', 'updatedAt'], true)) {
      throw new Error('Invalid sortBy value');
    }
    if (!dbValidator.isValidEnum(filters?.sortOrder, ['asc', 'desc'], true)) {
      throw new Error('Invalid sortOrder value');
    }
    const { text, values } = buildSelectProductsQuery(filters);
    const result = await db.query<ProductRow>(text, values);
    return result.rows;
  },

  // Soft delete (recommended for production)
  async softDelete(id: string, executor?: Pool | PoolClient): Promise<ProductRow> {
    const db = executor || pool;
    if (!dbValidator.isValidUUID(id)) {
      throw new Error('Invalid product ID');
    }
    const { text, values } = buildBulkSoftDeleteProductQuery([id]);
    const result = await db.query<ProductRow>(text, values);
    return result.rows[0];
  },

  // Hard delete (only for testing purposes and batch clean-ups)
  async hardDelete(id: string, executor?: Pool | PoolClient): Promise<ProductRow> {
    const db = executor || pool;
    if (!dbValidator.isValidUUID(id)) {
      throw new Error('Invalid product ID');
    }
    const { text, values } = buildBulkHardDeleteProductQuery([id]);
    const result = await db.query<ProductRow>(text, values);
    return result.rows[0];
  },

  // Count products with filters
  async count(filters?: {
    categoryId?: string;
    status?: 'active' | 'inactive' | 'discontinued';
    tag?: string;
    search?: string;
    includeDeleted?: boolean;
  }, executor?: Pool | PoolClient): Promise<number> {
    const db = executor || pool;
    if (!dbValidator.isValidUUID(filters?.categoryId, true)) {
      throw new Error('Invalid category ID');
    }
    if (!dbValidator.isValidEnum(filters?.status, ['active', 'inactive', 'discontinued'], true)) {
      throw new Error('Invalid product status');
    }
    if (!dbValidator.isValidString(filters?.tag, 500, true)) {
      throw new Error('Invalid product tag');
    }
    if (!dbValidator.isValidString(filters?.search, 500, true)) {
      throw new Error('Invalid search string');
    }
    const { text, values } = buildCountProductsQuery(filters);
    const result = await db.query<{ count: string }>(text, values);
    return parseInt(result.rows[0].count, 10);
  },

  // Check if product exists with filters
  async exists(filters?: {
    id?: string;
    sku?: string;
    categoryId?: string;
    status?: 'active' | 'inactive' | 'discontinued';
    tag?: string;
    search?: string;
    includeDeleted?: boolean;
  }, executor?: Pool | PoolClient): Promise<boolean> {
    const db = executor || pool;
    if (!dbValidator.isValidUUID(filters?.id, true)) {
      throw new Error('Invalid product ID');
    }
    if (!dbValidator.isValidString(filters?.sku, 500, true)) {
      throw new Error('Invalid product SKU');
    }
    if (!dbValidator.isValidUUID(filters?.categoryId, true)) {
      throw new Error('Invalid category ID');
    }
    if (!dbValidator.isValidEnum(filters?.status, ['active', 'inactive', 'discontinued'], true)) {
      throw new Error('Invalid product status');
    }
    if (!dbValidator.isValidString(filters?.tag, 500, true)) {
      throw new Error('Invalid product tag');
    }
    if (!dbValidator.isValidString(filters?.search, 500, true)) {
      throw new Error('Invalid search string');
    }
    const { text, values } = buildExistsProductQuery(filters);
    const result = await db.query<{ exists: boolean }>(text, values);
    return result.rows[0].exists;
  },
};
