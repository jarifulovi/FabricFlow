import pool from './../connection';

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
} from './../queries/index';
import { 
  ProductVariantRow, 
  CreateProductVariantInput, 
  UpdateProductVariantInput,
  ProductVariantWithProductRow,
  ProductVariantListRow
} from './../types/variant';
import { dbValidator } from '../validators/base.validator';


export const variantRepo = {
  async create(input: CreateProductVariantInput): Promise<ProductVariantRow> {
    if (!dbValidator.isValidUUID(input.productId)) {
      throw new Error('Invalid product ID');
    }
    if (!dbValidator.isValidString(input.sku)) {
      throw new Error('Invalid variant SKU');
    }
    if (!dbValidator.isValidOptionalString(input.vendorSku)) {
      throw new Error('Invalid vendor SKU');
    }
    if (!dbValidator.isValidOptionalString(input.color)) {
      throw new Error('Invalid color');
    }
    if (!dbValidator.isValidOptionalString(input.size)) {
      throw new Error('Invalid size');
    }
    if (!dbValidator.isValidOptionalString(input.gender)) {
      throw new Error('Invalid gender');
    }
    if (!dbValidator.isValidOptionalString(input.season)) {
      throw new Error('Invalid season');
    }
    if (!dbValidator.isValidOptionalString(input.fit)) {
      throw new Error('Invalid fit');
    }
    const { text, values } = buildInsertProductVariantQuery(input);
    const result = await pool.query<ProductVariantRow>(text, values);
    return result.rows[0];
  },

  async update(id: string, input: UpdateProductVariantInput): Promise<ProductVariantRow> {
    if (!dbValidator.isValidUUID(id)) {
      throw new Error('Invalid variant ID');
    }
    if (input.productId !== undefined && !dbValidator.isValidUUID(input.productId)) {
      throw new Error('Invalid product ID');
    }
    if (input.sku !== undefined && !dbValidator.isValidString(input.sku)) {
      throw new Error('Invalid variant SKU');
    }
    if (!dbValidator.isValidOptionalString(input.vendorSku)) {
      throw new Error('Invalid vendor SKU');
    }
    if (!dbValidator.isValidOptionalString(input.color)) {
      throw new Error('Invalid color');
    }
    if (!dbValidator.isValidOptionalString(input.size)) {
      throw new Error('Invalid size');
    }
    if (!dbValidator.isValidOptionalString(input.gender)) {
      throw new Error('Invalid gender');
    }
    if (!dbValidator.isValidOptionalString(input.season)) {
      throw new Error('Invalid season');
    }
    if (!dbValidator.isValidOptionalString(input.fit)) {
      throw new Error('Invalid fit');
    }
    const { text, values } = buildPatchVariantQuery(id, input);
    const result = await pool.query<ProductVariantRow>(text, values);
    return result.rows[0];
  },

  async findById(id: string, includeDeleted: boolean = false): Promise<ProductVariantWithProductRow | null> {
    if (!dbValidator.isValidUUID(id)) {
      throw new Error('Invalid variant ID');
    }
    const { text, values } = includeDeleted 
      ? buildSelectVariantByIdIncludedDeletedQuery(id)
      : buildSelectVariantByIdQuery(id);
    const result = await pool.query<any>(text, values);
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

  async findBySku(sku: string, includeDeleted: boolean = false): Promise<ProductVariantWithProductRow | null> {
    if (!dbValidator.isValidString(sku)) {
      throw new Error('Invalid variant SKU');
    }
    const { text, values } = includeDeleted 
      ? buildSelectVariantBySkuIncludedDeletedQuery(sku)
      : buildSelectVariantBySkuQuery(sku);
    const result = await pool.query<any>(text, values);
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

  async findAll(filters?: {
    productId?: string;
    color?: string;
    size?: string;
    gender?: string;
    season?: string;
    fit?: string;
    search?: string;
    sortBy?: 'sku' | 'price' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
  }): Promise<ProductVariantListRow[]> {
    if (filters?.productId && !dbValidator.isValidUUID(filters.productId)) {
      throw new Error('Invalid product ID');
    }
    const { text, values } = buildSelectVariantsQuery(filters);
    const result = await pool.query<any>(text, values);
    
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
  async softDelete(id: string): Promise<ProductVariantRow> {
    if (!dbValidator.isValidUUID(id)) {
      throw new Error('Invalid variant ID');
    }
    const { text, values } = buildBulkSoftDeleteVariantQuery([id]);
    const result = await pool.query<ProductVariantRow>(text, values);
    return result.rows[0];
  },

  // Hard delete (restricted, only for testing purposes and batch clean-ups)
  async hardDelete(id: string): Promise<ProductVariantRow> {
    if (!dbValidator.isValidUUID(id)) {
      throw new Error('Invalid variant ID');
    }
    const { text, values } = buildBulkHardDeleteVariantQuery([id]);
    const result = await pool.query<ProductVariantRow>(text, values);
    return result.rows[0];
  },
};
