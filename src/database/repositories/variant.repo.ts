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


export const variantRepo = {
  async create(input: CreateProductVariantInput, executor?: Pool | PoolClient): Promise<ProductVariantRow> {
    const db = executor || pool;
    const { text, values } = buildInsertProductVariantQuery(input);
    const result = await db.query<ProductVariantRow>(text, values);
    return result.rows[0];
  },

  async update(id: string, input: UpdateProductVariantInput, executor?: Pool | PoolClient): Promise<ProductVariantRow> {
    const db = executor || pool;
    const { text, values } = buildPatchVariantQuery(id, input);
    const result = await db.query<ProductVariantRow>(text, values);
    return result.rows[0];
  },

  async findById(id: string, includeDeleted: boolean = false, executor?: Pool | PoolClient): Promise<ProductVariantWithProductRow | null> {
    const db = executor || pool;
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
      productStatus: row.product_status,
      categoryName: row.category_name,
    }));
  },

  async softDelete(id: string, executor?: Pool | PoolClient): Promise<ProductVariantRow> {
    const db = executor || pool;
    const { text, values } = buildBulkSoftDeleteVariantQuery([id]);
    const result = await db.query<ProductVariantRow>(text, values);
    return result.rows[0];
  },

  async hardDelete(id: string, executor?: Pool | PoolClient): Promise<ProductVariantRow> {
    const db = executor || pool;
    const { text, values } = buildBulkHardDeleteVariantQuery([id]);
    const result = await db.query<ProductVariantRow>(text, values);
    return result.rows[0];
  },

  async count(filters?: VariantCountFilters, executor?: Pool | PoolClient): Promise<number> {
    const db = executor || pool;
    const { text, values } = buildCountVariantsQuery(filters);
    const result = await db.query<{ count: string }>(text, values);
    return parseInt(result.rows[0].count, 10);
  },

  async exists(filters?: VariantExistsFilters, executor?: Pool | PoolClient): Promise<boolean> {
    const db = executor || pool;
    const { text, values } = buildExistsVariantQuery(filters);
    const result = await db.query<{ exists: boolean }>(text, values);
    return result.rows[0].exists;
  },
};
