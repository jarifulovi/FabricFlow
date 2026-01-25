import pool, { Pool, PoolClient } from './../connection';

import {
  buildInsertCategoryQuery,
  buildPatchCategoryQuery,
  buildDeleteCategoriesQuery,
  buildSelectCategoriesQuery,
  buildSelectCategoryByIdQuery,
} from './../queries/index';
import { CategoryRow, CreateCategoryInput, UpdateCategoryInput } from './../types/category';
import { dbValidator } from '../validators/base.validator';


export const categoryRepo = {
  async create(input: CreateCategoryInput, executor?: Pool | PoolClient): Promise<CategoryRow> {
    const db = executor || pool;
    if (!dbValidator.isValidString(input.name)) {
      throw new Error('Invalid category name');
    }
    if (!dbValidator.isValidOptionalString(input.description)) {
      throw new Error('Invalid category description');
    }
    const { text, values } = buildInsertCategoryQuery(input);
    const result = await db.query<CategoryRow>(text, values);
    return result.rows[0];
  },

  async update(id: string, input: UpdateCategoryInput, executor?: Pool | PoolClient): Promise<CategoryRow> {
    const db = executor || pool;
    if (!dbValidator.isValidUUID(id)) {
      throw new Error('Invalid category ID');
    }
    if (!dbValidator.isValidOptionalString(input.name)) {
      throw new Error('Invalid category name');
    }
    if (!dbValidator.isValidOptionalString(input.description)) {
      throw new Error('Invalid category description');
    }
    const { text, values } = buildPatchCategoryQuery(id, input);
    const result = await db.query<CategoryRow>(text, values);
    return result.rows[0];
  },

  async findById(id: string, executor?: Pool | PoolClient): Promise<CategoryRow | null> {
    const db = executor || pool;
    if (!dbValidator.isValidUUID(id)) {
      throw new Error('Invalid category ID');
    }
    const { text, values } = buildSelectCategoryByIdQuery(id);
    const result = await db.query<CategoryRow>(text, values);
    return result.rows[0] || null;
  },

  async findAll(filters?: {
    search?: string;
    sortBy?: 'name' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
  }, executor?: Pool | PoolClient): Promise<CategoryRow[]> {
    const db = executor || pool;
    const { text, values } = buildSelectCategoriesQuery(filters);
    const result = await db.query<CategoryRow>(text, values);
    return result.rows;
  },

  // Delete is restricted for categories, only for testing purposes
  async delete(id: string, executor?: Pool | PoolClient): Promise<CategoryRow> {
    const db = executor || pool;
    if (!dbValidator.isValidUUID(id)) {
      throw new Error('Invalid category ID');
    }
    const { text, values } = buildDeleteCategoriesQuery([id]);
    const result = await db.query<CategoryRow>(text, values);
    return result.rows[0];
  },
};
