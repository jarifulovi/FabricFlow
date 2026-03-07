import pool, { Pool, PoolClient } from './../connection';
import { mapRowToCamel, mapRowsToCamel } from './../utils/row-mapper.js';

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
import { ProductRow, CreateProductInput, UpdateProductInput, ProductStatus, ProductFindAllFilters, ProductCountFilters, ProductExistsFilters } from './../types/product';


export const productRepo = {
  async create(input: CreateProductInput, executor?: Pool | PoolClient): Promise<ProductRow> {
    const db = executor || pool;
    const { text, values } = buildInsertProductQuery(input);
    const result = await db.query(text, values);
    return mapRowToCamel<ProductRow>(result.rows[0]);
  },

  async update(id: string, input: UpdateProductInput, executor?: Pool | PoolClient): Promise<ProductRow> {
    const db = executor || pool;
    const { text, values } = buildPatchProductQuery(id, input);
    const result = await db.query(text, values);
    return mapRowToCamel<ProductRow>(result.rows[0]);
  },

  async findById(id: string, includeDeleted: boolean = false, executor?: Pool | PoolClient): Promise<ProductRow | null> {
    const db = executor || pool;
    const { text, values } = includeDeleted 
      ? buildSelectProductByIdIncludedDeletedQuery(id)
      : buildSelectProductByIdQuery(id);
    const result = await db.query(text, values);
    return result.rows[0] ? mapRowToCamel<ProductRow>(result.rows[0]) : null;
  },

  async findBySku(sku: string, includeDeleted: boolean = false, executor?: Pool | PoolClient): Promise<ProductRow | null> {
    const db = executor || pool;
    const { text, values } = includeDeleted 
      ? buildSelectProductBySkuIncludedDeletedQuery(sku)
      : buildSelectProductBySkuQuery(sku);
    const result = await db.query(text, values);
    return result.rows[0] ? mapRowToCamel<ProductRow>(result.rows[0]) : null;
  },

  async findAll(filters?: ProductFindAllFilters, executor?: Pool | PoolClient): Promise<ProductRow[]> {
    const db = executor || pool;
    const { text, values } = buildSelectProductsQuery(filters);
    const result = await db.query(text, values);
    return mapRowsToCamel<ProductRow>(result.rows);
  },

  async softDelete(id: string, executor?: Pool | PoolClient): Promise<ProductRow> {
    const db = executor || pool;
    const { text, values } = buildBulkSoftDeleteProductQuery([id]);
    const result = await db.query(text, values);
    return mapRowToCamel<ProductRow>(result.rows[0]);
  },

  async hardDelete(id: string, executor?: Pool | PoolClient): Promise<ProductRow> {
    const db = executor || pool;
    const { text, values } = buildBulkHardDeleteProductQuery([id]);
    const result = await db.query(text, values);
    return mapRowToCamel<ProductRow>(result.rows[0]);
  },

  async count(filters?: ProductCountFilters, executor?: Pool | PoolClient): Promise<number> {
    const db = executor || pool;
    const { text, values } = buildCountProductsQuery(filters);
    const result = await db.query<{ count: string }>(text, values);
    return parseInt(result.rows[0].count, 10);
  },

  async exists(filters?: ProductExistsFilters, executor?: Pool | PoolClient): Promise<boolean> {
    const db = executor || pool;
    const { text, values } = buildExistsProductQuery(filters);
    const result = await db.query<{ exists: boolean }>(text, values);
    return result.rows[0].exists;
  },
};
