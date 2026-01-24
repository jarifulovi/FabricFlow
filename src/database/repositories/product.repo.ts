import pool from './../connection';

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
} from './../queries/index';
import { ProductRow, CreateProductInput, UpdateProductInput } from './../types/product';
import { dbValidator } from '../validators/base.validator';


export const productRepo = {
  async create(input: CreateProductInput): Promise<ProductRow> {
    if (!dbValidator.isValidString(input.sku)) {
      throw new Error('Invalid product SKU');
    }
    if (!dbValidator.isValidString(input.name)) {
      throw new Error('Invalid product name');
    }
    if (!dbValidator.isValidUUID(input.categoryId)) {
      throw new Error('Invalid category ID');
    }
    if (!dbValidator.isValidOptionalString(input.description)) {
      throw new Error('Invalid product description');
    }
    if (!dbValidator.isValidOptionalString(input.brandName)) {
      throw new Error('Invalid brand name');
    }
    if (!dbValidator.isValidOptionalString(input.brandCode)) {
      throw new Error('Invalid brand code');
    }
    const { text, values } = buildInsertProductQuery(input);
    const result = await pool.query<ProductRow>(text, values);
    return result.rows[0];
  },

  async update(id: string, input: UpdateProductInput): Promise<ProductRow> {
    if (!dbValidator.isValidUUID(id)) {
      throw new Error('Invalid product ID');
    }
    if (input.sku !== undefined && !dbValidator.isValidString(input.sku)) {
      throw new Error('Invalid product SKU');
    }
    if (input.name !== undefined && !dbValidator.isValidString(input.name)) {
      throw new Error('Invalid product name');
    }
    if (input.categoryId !== undefined && !dbValidator.isValidUUID(input.categoryId)) {
      throw new Error('Invalid category ID');
    }
    if (!dbValidator.isValidOptionalString(input.description)) {
      throw new Error('Invalid product description');
    }
    if (!dbValidator.isValidOptionalString(input.brandName)) {
      throw new Error('Invalid brand name');
    }
    if (!dbValidator.isValidOptionalString(input.brandCode)) {
      throw new Error('Invalid brand code');
    }
    const { text, values } = buildPatchProductQuery(id, input);
    const result = await pool.query<ProductRow>(text, values);
    return result.rows[0];
  },

  async findById(id: string, includeDeleted: boolean = false): Promise<ProductRow | null> {
    if (!dbValidator.isValidUUID(id)) {
      throw new Error('Invalid product ID');
    }
    const { text, values } = includeDeleted 
      ? buildSelectProductByIdIncludedDeletedQuery(id)
      : buildSelectProductByIdQuery(id);
    const result = await pool.query<ProductRow>(text, values);
    return result.rows[0] || null;
  },

  async findBySku(sku: string, includeDeleted: boolean = false): Promise<ProductRow | null> {
    if (!dbValidator.isValidString(sku)) {
      throw new Error('Invalid product SKU');
    }
    const { text, values } = includeDeleted 
      ? buildSelectProductBySkuIncludedDeletedQuery(sku)
      : buildSelectProductBySkuQuery(sku);
    const result = await pool.query<ProductRow>(text, values);
    return result.rows[0] || null;
  },

  async findAll(filters?: {
    categoryId?: string;
    status?: 'active' | 'inactive' | 'discontinued';
    tag?: string;
    search?: string;
    sortBy?: 'name' | 'createdAt' | 'updatedAt';
    sortOrder?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
  }): Promise<ProductRow[]> {
    if (filters?.categoryId && !dbValidator.isValidUUID(filters.categoryId)) {
      throw new Error('Invalid category ID');
    }
    const { text, values } = buildSelectProductsQuery(filters);
    const result = await pool.query<ProductRow>(text, values);
    return result.rows;
  },

  // Soft delete (recommended for production)
  async softDelete(id: string): Promise<ProductRow> {
    if (!dbValidator.isValidUUID(id)) {
      throw new Error('Invalid product ID');
    }
    const { text, values } = buildBulkSoftDeleteProductQuery([id]);
    const result = await pool.query<ProductRow>(text, values);
    return result.rows[0];
  },

  // Hard delete (only for testing purposes and batch clean-ups)
  async hardDelete(id: string): Promise<ProductRow> {
    if (!dbValidator.isValidUUID(id)) {
      throw new Error('Invalid product ID');
    }
    const { text, values } = buildBulkHardDeleteProductQuery([id]);
    const result = await pool.query<ProductRow>(text, values);
    return result.rows[0];
  },
};
