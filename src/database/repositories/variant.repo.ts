import pool, { Pool, PoolClient } from './../connection';

import {
  buildInsertProductVariantQuery,
  buildPatchVariantQuery,
  buildBulkSoftDeleteVariantQuery,
  buildBulkHardDeleteVariantQuery,
  buildSelectVariantsQuery,
  buildSelectVariantByIdQuery,
  buildSelectVariantByIdIncludedDeletedQuery,
  buildSelectVariantBySkuQuery,
  buildSelectVariantBySkuIncludedDeletedQuery,
  buildCountVariantsQuery,
  buildExistsVariantQuery,
} from './../queries/index';
import { 
  ProductVariantRow, 
  CreateProductVariantInput, 
  UpdateProductVariantInput,
  ProductVariantWithProductRow,
  ProductVariantListRow,
  VariantFindAllFilters,
  VariantCountFilters,
  VariantExistsFilters
} from './../types/variant';
import { dbValidator } from '../validators/base.validator';


export const variantRepo = {
  async create(input: CreateProductVariantInput, executor?: Pool | PoolClient): Promise<ProductVariantRow> {
    const db = executor || pool;
    if (!dbValidator.isValidUUID(input.productId)) {
      throw new Error('Invalid product ID');
    }
    if (!dbValidator.isValidString(input.sku)) {
      throw new Error('Invalid variant SKU');
    }
    if (!dbValidator.isValidString(input.vendorSku, 500, true)) {
      throw new Error('Invalid vendor SKU');
    }
    if (!dbValidator.isValidString(input.color, 500, true)) {
      throw new Error('Invalid color');
    }
    if (!dbValidator.isValidString(input.size, 500, true)) {
      throw new Error('Invalid size');
    }
    if (!dbValidator.isValidString(input.gender, 500, true)) {
      throw new Error('Invalid gender');
    }
    if (!dbValidator.isValidString(input.season, 500, true)) {
      throw new Error('Invalid season');
    }
    if (!dbValidator.isValidString(input.fit, 500, true)) {
      throw new Error('Invalid fit');
    }
    const { text, values } = buildInsertProductVariantQuery(input);
    const result = await db.query<ProductVariantRow>(text, values);
    return result.rows[0];
  },

  async update(id: string, input: UpdateProductVariantInput, executor?: Pool | PoolClient): Promise<ProductVariantRow> {
    const db = executor || pool;
    if (!dbValidator.isValidUUID(id)) {
      throw new Error('Invalid variant ID');
    }
    if (input.productId !== undefined && !dbValidator.isValidUUID(input.productId)) {
      throw new Error('Invalid product ID');
    }
    if (input.sku !== undefined && !dbValidator.isValidString(input.sku)) {
      throw new Error('Invalid variant SKU');
    }
    if (!dbValidator.isValidString(input.vendorSku, 500, true)) {
      throw new Error('Invalid vendor SKU');
    }
    if (!dbValidator.isValidString(input.color, 500, true)) {
      throw new Error('Invalid color');
    }
    if (!dbValidator.isValidString(input.size, 500, true)) {
      throw new Error('Invalid size');
    }
    if (!dbValidator.isValidString(input.gender, 500, true)) {
      throw new Error('Invalid gender');
    }
    if (!dbValidator.isValidString(input.season, 500, true)) {
      throw new Error('Invalid season');
    }
    if (!dbValidator.isValidString(input.fit, 500, true)) {
      throw new Error('Invalid fit');
    }
    const { text, values } = buildPatchVariantQuery(id, input);
    const result = await db.query<ProductVariantRow>(text, values);
    return result.rows[0];
  },

  async findById(id: string, includeDeleted: boolean = false, executor?: Pool | PoolClient): Promise<ProductVariantWithProductRow | null> {
    const db = executor || pool;
    if (!dbValidator.isValidUUID(id)) {
      throw new Error('Invalid variant ID');
    }
    const { text, values } = includeDeleted 
      ? buildSelectVariantByIdIncludedDeletedQuery(id)
      : buildSelectVariantByIdQuery(id);
    const result = await db.query<any>(text, values);
    const row = result.rows[0];
    
    if (!row) return null;

    // Transform flat row to nested structure
    return {
      id: row.id,
      productId: row.product_id,
      sku: row.sku,
      vendorSku: row.vendor_sku,
      color: row.color,
      size: row.size,
      gender: row.gender,
      season: row.season,
      fit: row.fit,
      price: row.price,
      reorderLevel: row.reorder_level,
      isDeleted: row.is_deleted,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      deletedAt: row.deleted_at,
      product: {
        id: row.product_id,
        sku: row.product_sku,
        name: row.product_name,
        description: row.product_description,
        brandName: row.product_brand_name,
        brandCode: row.product_brand_code,
        categoryId: row.product_category_id,
        categoryName: row.category_name,
        status: row.product_status,
        unit: row.product_unit,
        isDeleted: row.product_is_deleted,
        tags: row.product_tags,
      },
    };
  },

  async findBySku(sku: string, includeDeleted: boolean = false, executor?: Pool | PoolClient): Promise<ProductVariantWithProductRow | null> {
    const db = executor || pool;
    if (!dbValidator.isValidString(sku)) {
      throw new Error('Invalid variant SKU');
    }
    const { text, values } = includeDeleted 
      ? buildSelectVariantBySkuIncludedDeletedQuery(sku)
      : buildSelectVariantBySkuQuery(sku);
    const result = await db.query<any>(text, values);
    const row = result.rows[0];
    
    if (!row) return null;

    // Transform flat row to nested structure
    return {
      id: row.id,
      productId: row.product_id,
      sku: row.sku,
      vendorSku: row.vendor_sku,
      color: row.color,
      size: row.size,
      gender: row.gender,
      season: row.season,
      fit: row.fit,
      price: row.price,
      reorderLevel: row.reorder_level,
      isDeleted: row.is_deleted,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      deletedAt: row.deleted_at,
      product: {
        id: row.product_id,
        sku: row.product_sku,
        name: row.product_name,
        description: row.product_description,
        brandName: row.product_brand_name,
        brandCode: row.product_brand_code,
        categoryId: row.product_category_id,
        categoryName: row.category_name,
        status: row.product_status,
        unit: row.product_unit,
        isDeleted: row.product_is_deleted,
        tags: row.product_tags,
      },
    };
  },

  async findAll(filters?: VariantFindAllFilters, executor?: Pool | PoolClient): Promise<ProductVariantListRow[]> {
    const db = executor || pool;
    if (filters?.productId && !dbValidator.isValidUUID(filters.productId)) {
      throw new Error('Invalid product ID');
    }
    if (!dbValidator.isValidString(filters?.search, 500, true)) {
      throw new Error('Invalid search string');
    }
    if (!dbValidator.isValidEnum(filters?.sortBy, ['sku', 'price', 'createdAt'], true)) {
      throw new Error('Invalid sortBy value');
    }
    if (!dbValidator.isValidEnum(filters?.sortOrder, ['asc', 'desc'], true)) {
      throw new Error('Invalid sortOrder value');
    }
    const { text, values } = buildSelectVariantsQuery(filters);
    const result = await db.query<any>(text, values);
    
    // Transform flat rows to include product info
    return result.rows.map(row => ({
      id: row.id,
      productId: row.product_id,
      sku: row.sku,
      vendorSku: row.vendor_sku,
      color: row.color,
      size: row.size,
      gender: row.gender,
      season: row.season,
      fit: row.fit,
      price: row.price,
      reorderLevel: row.reorder_level,
      isDeleted: row.is_deleted,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      deletedAt: row.deleted_at,
      productSku: row.product_sku,
      productName: row.product_name,
      categoryName: row.category_name,
    }));
  },

  // Soft delete (recommended for production)
  async softDelete(id: string, executor?: Pool | PoolClient): Promise<ProductVariantRow> {
    const db = executor || pool;
    if (!dbValidator.isValidUUID(id)) {
      throw new Error('Invalid variant ID');
    }
    const { text, values } = buildBulkSoftDeleteVariantQuery([id]);
    const result = await db.query<ProductVariantRow>(text, values);
    return result.rows[0];
  },

  // Hard delete (restricted, only for testing purposes and batch clean-ups)
  async hardDelete(id: string, executor?: Pool | PoolClient): Promise<ProductVariantRow> {
    const db = executor || pool;
    if (!dbValidator.isValidUUID(id)) {
      throw new Error('Invalid variant ID');
    }
    const { text, values } = buildBulkHardDeleteVariantQuery([id]);
    const result = await db.query<ProductVariantRow>(text, values);
    return result.rows[0];
  },

  // Count variants with filters
  async count(filters?: VariantCountFilters, executor?: Pool | PoolClient): Promise<number> {
    const db = executor || pool;
    if (filters?.productId && !dbValidator.isValidUUID(filters.productId)) {
      throw new Error('Invalid product ID');
    }
    if (!dbValidator.isValidString(filters?.search, 500, true)) {
      throw new Error('Invalid search string');
    }
    const { text, values } = buildCountVariantsQuery(filters);
    const result = await db.query<{ count: string }>(text, values);
    return parseInt(result.rows[0].count, 10);
  },

  // Check if variant exists with filters
  async exists(filters?: VariantExistsFilters, executor?: Pool | PoolClient): Promise<boolean> {
    const db = executor || pool;
    if (!dbValidator.isValidUUID(filters?.id, true)) {
      throw new Error('Invalid variant ID');
    }
    if (!dbValidator.isValidString(filters?.sku, 500, true)) {
      throw new Error('Invalid variant SKU');
    }
    if (!dbValidator.isValidUUID(filters?.productId, true)) {
      throw new Error('Invalid product ID');
    }
    if (!dbValidator.isValidString(filters?.search, 500, true)) {
      throw new Error('Invalid search string');
    }
    const { text, values } = buildExistsVariantQuery(filters);
    const result = await db.query<{ exists: boolean }>(text, values);
    return result.rows[0].exists;
  },
};
