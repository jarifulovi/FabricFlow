import pool, { Pool, PoolClient } from './../connection';
import { mapRowToCamel, mapRowsToCamel } from './../utils/row-mapper.js';

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
    const result = await db.query(text, values);
    return mapRowToCamel<CategoryRow>(result.rows[0]);
  },

  async update(id: string, input: UpdateCategoryInput, executor?: Pool | PoolClient): Promise<CategoryRow> {
    const db = executor || pool;
    const { text, values } = buildPatchCategoryQuery(id, input);
    const result = await db.query(text, values);
    return mapRowToCamel<CategoryRow>(result.rows[0]);
  },

  async findById(id: string, includeDeleted: boolean = false, executor?: Pool | PoolClient): Promise<CategoryRow | null> {
    const db = executor || pool;
    const { text, values } = includeDeleted 
      ? buildSelectCategoryByIdIncludedDeletedQuery(id)
      : buildSelectCategoryByIdQuery(id);
    const result = await db.query(text, values);
    return result.rows[0] ? mapRowToCamel<CategoryRow>(result.rows[0]) : null;
  },

  async findAll(filters?: CategoryFindAllFilters, executor?: Pool | PoolClient): Promise<CategoryRow[]> {
    const db = executor || pool;
    const { text, values } = buildSelectCategoriesQuery(filters);
    const result = await db.query(text, values);
    return mapRowsToCamel<CategoryRow>(result.rows);
  },

  async softDelete(id: string, executor?: Pool | PoolClient): Promise<CategoryRow> {
    const db = executor || pool;
    const { text, values } = buildBulkSoftDeleteCategoriesQuery([id]);
    const result = await db.query(text, values);
    return mapRowToCamel<CategoryRow>(result.rows[0]);
  },

  async hardDelete(id: string, executor?: Pool | PoolClient): Promise<CategoryRow> {
    const db = executor || pool;
    const { text, values } = buildBulkHardDeleteCategoriesQuery([id]);
    const result = await db.query(text, values);
    return mapRowToCamel<CategoryRow>(result.rows[0]);
  },

  async count(filters?: CategoryCountFilters, executor?: Pool | PoolClient): Promise<number> {
    const db = executor || pool;
    const { text, values } = buildCountCategoriesQuery(filters);
    const result = await db.query<{ count: string }>(text, values);
    return parseInt(result.rows[0].count, 10);
  },

  async exists(filters?: CategoryExistsFilters, executor?: Pool | PoolClient): Promise<boolean> {
    const db = executor || pool;
    const { text, values } = buildExistsCategoryQuery(filters);
    const result = await db.query<{ exists: boolean }>(text, values);
    return result.rows[0].exists;
  },
};
