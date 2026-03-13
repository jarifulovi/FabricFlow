import pool, { Pool, PoolClient } from './../connection';
import { mapRowToCamel, mapRowsToCamel } from './../utils/row-mapper.js';

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
    const result = await db.query(text, values);
    return mapRowToCamel<ProductVariantRow>(result.rows[0]);
  },

  async update(id: string, input: UpdateProductVariantInput, executor?: Pool | PoolClient): Promise<ProductVariantRow> {
    const db = executor || pool;
    const { text, values } = buildPatchVariantQuery(id, input);
    const result = await db.query(text, values);
    return mapRowToCamel<ProductVariantRow>(result.rows[0]);
  },

  async findById(id: string, includeDeleted: boolean = false, executor?: Pool | PoolClient): Promise<ProductVariantWithProductRow | null> {
    const db = executor || pool;
    const { text, values } = includeDeleted 
      ? buildSelectVariantByIdIncludedDeletedQuery(id)
      : buildSelectVariantByIdQuery(id);
    const result = await db.query<any>(text, values);
    const row = result.rows[0];
    
    if (!row) return null;

    // Convert flat row to camelCase, then restructure product fields into nested object
    const flat = mapRowToCamel<any>(row);
    return {
      id: flat.id,
      productId: flat.productId,
      sku: flat.sku,
      vendorSku: flat.vendorSku,
      barcode: flat.barcode,
      color: flat.color,
      size: flat.size,
      gender: flat.gender,
      season: flat.season,
      fit: flat.fit,
      price: flat.price,
      reorderLevel: flat.reorderLevel,
      attributes: flat.attributes,
      imageUrls: flat.imageUrls,
      isDeleted: flat.isDeleted,
      createdAt: flat.createdAt,
      updatedAt: flat.updatedAt,
      deletedAt: flat.deletedAt,
      product: {
        id: flat.productId,
        sku: flat.productSku,
        name: flat.productName,
        description: flat.productDescription,
        brandName: flat.productBrandName,
        brandId: flat.productBrandId,
        categoryId: flat.productCategoryId,
        categoryName: flat.categoryName,
        status: flat.productStatus,
        unit: flat.productUnit,
        isDeleted: flat.productIsDeleted,
        tags: flat.productTags,
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

    // Convert flat row to camelCase, then restructure product fields into nested object
    const flat = mapRowToCamel<any>(row);
    return {
      id: flat.id,
      productId: flat.productId,
      sku: flat.sku,
      vendorSku: flat.vendorSku,
      barcode: flat.barcode,
      color: flat.color,
      size: flat.size,
      gender: flat.gender,
      season: flat.season,
      fit: flat.fit,
      price: flat.price,
      reorderLevel: flat.reorderLevel,
      attributes: flat.attributes,
      imageUrls: flat.imageUrls,
      isDeleted: flat.isDeleted,
      createdAt: flat.createdAt,
      updatedAt: flat.updatedAt,
      deletedAt: flat.deletedAt,
      product: {
        id: flat.productId,
        sku: flat.productSku,
        name: flat.productName,
        description: flat.productDescription,
        brandName: flat.productBrandName,
        brandId: flat.productBrandId,
        categoryId: flat.productCategoryId,
        categoryName: flat.categoryName,
        status: flat.productStatus,
        unit: flat.productUnit,
        isDeleted: flat.productIsDeleted,
        tags: flat.productTags,
      },
    };
  },

  async findAll(filters?: VariantFindAllFilters, executor?: Pool | PoolClient): Promise<ProductVariantListRow[]> {
    const db = executor || pool;
    const { text, values } = buildSelectVariantsQuery(filters);
    const result = await db.query<any>(text, values);
    return mapRowsToCamel<ProductVariantListRow>(result.rows);
  },

  async softDelete(id: string, executor?: Pool | PoolClient): Promise<ProductVariantRow> {
    const db = executor || pool;
    const { text, values } = buildBulkSoftDeleteVariantQuery([id]);
    const result = await db.query(text, values);
    return mapRowToCamel<ProductVariantRow>(result.rows[0]);
  },

  async hardDelete(id: string, executor?: Pool | PoolClient): Promise<ProductVariantRow> {
    const db = executor || pool;
    const { text, values } = buildBulkHardDeleteVariantQuery([id]);
    const result = await db.query(text, values);
    return mapRowToCamel<ProductVariantRow>(result.rows[0]);
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
