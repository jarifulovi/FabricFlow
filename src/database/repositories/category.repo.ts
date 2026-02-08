import pool, { Pool, PoolClient } from './../connection';

import {
  buildInsertCategoryQuery,
  buildPatchCategoryQuery,
  buildBulkSoftDeleteCategoriesQuery,
  buildBulkHardDeleteCategoriesQuery,
  buildSelectCategoriesQuery,
  buildSelectCategoryByIdQuery,
  buildSelectCategoryByIdIncludedDeletedQuery,
  buildCountCategoriesQuery,
  buildExistsCategoryQuery,
} from './../queries/index';
import { 
  CategoryRow, 
  CreateCategoryInput, 
  UpdateCategoryInput,
  CategoryFindAllFilters,
  CategoryCountFilters,
  CategoryExistsFilters
} from './../types/category';


export const categoryRepo = {
  async create(input: CreateCategoryInput, executor?: Pool | PoolClient): Promise<CategoryRow> {
    const db = executor || pool;
    const { text, values } = buildInsertCategoryQuery(input);
    const result = await db.query<CategoryRow>(text, values);
    return result.rows[0];
  },

  async update(id: string, input: UpdateCategoryInput, executor?: Pool | PoolClient): Promise<CategoryRow> {
    const db = executor || pool;
    const { text, values } = buildPatchCategoryQuery(id, input);
    const result = await db.query<CategoryRow>(text, values);
    return result.rows[0];
  },

  async findById(id: string, includeDeleted: boolean = false, executor?: Pool | PoolClient): Promise<CategoryRow | null> {
    const db = executor || pool;
    const { text, values } = includeDeleted 
      ? buildSelectCategoryByIdIncludedDeletedQuery(id)
      : buildSelectCategoryByIdQuery(id);
    const result = await db.query<CategoryRow>(text, values);
    return result.rows[0] || null;
  },

  async findAll(filters?: CategoryFindAllFilters, executor?: Pool | PoolClient): Promise<CategoryRow[]> {
    const db = executor || pool;
    const { text, values } = buildSelectCategoriesQuery(filters);
    const result = await db.query<CategoryRow>(text, values);
    return result.rows;
  },

  // Soft delete (recommended for production)
  async softDelete(id: string, executor?: Pool | PoolClient): Promise<CategoryRow> {
    const db = executor || pool;
    const { text, values } = buildBulkSoftDeleteCategoriesQuery([id]);
    const result = await db.query<CategoryRow>(text, values);
    return result.rows[0];
  },

  // Hard delete (only for testing purposes and batch clean-ups)
  async hardDelete(id: string, executor?: Pool | PoolClient): Promise<CategoryRow> {
    const db = executor || pool;
    const { text, values } = buildBulkHardDeleteCategoriesQuery([id]);
    const result = await db.query<CategoryRow>(text, values);
    return result.rows[0];
  },

  // Count categories with filters
  async count(filters?: CategoryCountFilters, executor?: Pool | PoolClient): Promise<number> {
    const db = executor || pool;
    const { text, values } = buildCountCategoriesQuery(filters);
    const result = await db.query<{ count: string }>(text, values);
    return parseInt(result.rows[0].count, 10);
  },

  // Check if category exists with filters
  async exists(filters?: CategoryExistsFilters, executor?: Pool | PoolClient): Promise<boolean> {
    const db = executor || pool;
    const { text, values } = buildExistsCategoryQuery(filters);
    const result = await db.query<{ exists: boolean }>(text, values);
    return result.rows[0].exists;
  },
};
