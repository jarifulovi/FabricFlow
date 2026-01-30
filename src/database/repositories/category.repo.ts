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
    if (!dbValidator.isValidString(input.description, 500, true)) {
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
    if (!dbValidator.isValidString(input.name, 500, true)) {
      throw new Error('Invalid category name');
    }
    if (!dbValidator.isValidString(input.description, 500, true)) {
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
    if (!dbValidator.isValidString(filters?.search, 500, true)) {
      throw new Error('Invalid search term');
    }
    if (!dbValidator.isValidEnum(filters?.sortBy, ['name', 'createdAt'], true)) {
      throw new Error('Invalid sortBy value');
    }
    if (!dbValidator.isValidEnum(filters?.sortOrder, ['asc', 'desc'], true)) {
      throw new Error('Invalid sortOrder value');
    }
    if (!dbValidator.isPositiveNumber(filters?.limit, true)) {
      throw new Error('Invalid limit value');
    }
    if (!dbValidator.isNonNegativeNumber(filters?.offset, true)) {
      throw new Error('Invalid offset value');
    }
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
