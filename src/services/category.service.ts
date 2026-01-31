import { categoryRepo } from '../database/repositories';
import {
  CreateCategoryInput,
  UpdateCategoryInput,
  CategoryRow,
} from '../database/types/category';

export const categoryService = {
  async create(input: CreateCategoryInput): Promise<CategoryRow> {
    // Check if category with same name exists
    const existing = await categoryRepo.findAll({ search: input.name });
    if (existing.length > 0) {
      throw new Error('Category with the same name already exists');
    }

    return await categoryRepo.create(input);
  },

  async update(id: string, input: UpdateCategoryInput): Promise<CategoryRow> {
    // Verify category exists
    const existing = await categoryRepo.findById(id);
    if (!existing) {
      throw new Error('Category not found');
    }

    return await categoryRepo.update(id, input);
  },

  async findById(id: string): Promise<CategoryRow> {
    const category = await categoryRepo.findById(id);
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  },

  async findAll(filters?: {
    name?: string;
    sortBy?: 'name' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
  }): Promise<CategoryRow[]> {
    const { page, pageSize, name, ...rest } = filters || {};
    const limit = pageSize;
    const offset = page && pageSize ? (page - 1) * pageSize : undefined;
    
    return await categoryRepo.findAll({ 
      ...rest, 
      ...(name && { search: name }), // Map 'name' to 'search' for repository
      limit, 
      offset 
    });
  },

  async findAllDefault(params?: { page?: number; pageSize?: number }): Promise<CategoryRow[]> {
    const { page, pageSize } = params || {};
    const limit = pageSize;
    const offset = page && pageSize ? (page - 1) * pageSize : undefined;
    return await categoryRepo.findAll({
      sortBy: 'name',
      sortOrder: 'asc',
      limit,
      offset,
    });
  },

  // Restricted for now
  async delete(id: string): Promise<CategoryRow> {
    // Verify category exists
    const existing = await categoryRepo.findById(id);
    if (!existing) {
      throw new Error('Category not found');
    }

    // Business rule: Check if category has products+variants+line items of these+movements before deleting
    // This could be implemented in future if possible
    // Only for testing purposes now

    return await categoryRepo.delete(id);
  },
};
