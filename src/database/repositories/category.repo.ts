import pool from './../connection';

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
  async create(input: CreateCategoryInput): Promise<CategoryRow> {
    if (!dbValidator.isValidString(input.name)) {
      throw new Error('Invalid category name');
    }
    if (!dbValidator.isValidOptionalString(input.description)) {
      throw new Error('Invalid category description');
    }
    const { text, values } = buildInsertCategoryQuery(input);
    const result = await pool.query<CategoryRow>(text, values);
    return result.rows[0];
  },

  async update(id: string, input: UpdateCategoryInput): Promise<CategoryRow> {
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
    const result = await pool.query<CategoryRow>(text, values);
    return result.rows[0];
  },

  async findById(id: string): Promise<CategoryRow | null> {
    if (!dbValidator.isValidUUID(id)) {
      throw new Error('Invalid category ID');
    }
    const { text, values } = buildSelectCategoryByIdQuery(id);
    const result = await pool.query<CategoryRow>(text, values);
    return result.rows[0] || null;
  },

  async findAll(filters?: {
    search?: string;
    sortBy?: 'name' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
  }): Promise<CategoryRow[]> {
    const { text, values } = buildSelectCategoriesQuery(filters);
    const result = await pool.query<CategoryRow>(text, values);
    return result.rows;
  },

  // Delete is restricted for categories, only for testing purposes
  async delete(id: string): Promise<CategoryRow> {
    if (!dbValidator.isValidUUID(id)) {
      throw new Error('Invalid category ID');
    }
    const { text, values } = buildDeleteCategoriesQuery([id]);
    const result = await pool.query<CategoryRow>(text, values);
    return result.rows[0];
  },
};
