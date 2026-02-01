import { categoryRepo } from '../database/repositories';
import {
  CreateCategoryInput,
  UpdateCategoryInput,
  CategoryRow,
} from '../database/types/category';

export const categoryService = {
  async create(input: CreateCategoryInput): Promise<CategoryRow> {
    // Check if category with same name exists (excluding deleted categories)
    const existing = await categoryRepo.findAll({ search: input.name, includeDeleted: false });
    if (existing.length > 0) {
      throw new Error('Category with the same name already exists');
    }

    return await categoryRepo.create(input);
  },

  async update(id: string, input: UpdateCategoryInput): Promise<CategoryRow> {
    // Verify category exists (excluding deleted categories)
    const existing = await categoryRepo.findById(id, false);
    if (!existing) {
      throw new Error('Category not found');
    }

    return await categoryRepo.update(id, input);
  },

  async findById(id: string): Promise<CategoryRow> {
    const category = await categoryRepo.findById(id, false); // Explicitly exclude deleted
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  },

  async findAll(filters?: {
    name?: string;
    includeDeleted?: boolean;
    sortBy?: 'name' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
  }): Promise<CategoryRow[]> {
    const { page, pageSize, name, includeDeleted = false, ...rest } = filters || {};
    const limit = pageSize;
    const offset = page && pageSize ? (page - 1) * pageSize : undefined;
    
    return await categoryRepo.findAll({ 
      ...rest, 
      ...(name && { search: name }), // Map 'name' to 'search' for repository
      includeDeleted, // Explicitly pass the defaulted value
      limit, 
      offset 
    });
  },

  async findAllDefault(params?: { page?: number; pageSize?: number }): Promise<CategoryRow[]> {
    const { page, pageSize } = params || {};
    const limit = pageSize;
    const offset = page && pageSize ? (page - 1) * pageSize : undefined;
    return await categoryRepo.findAll({
      includeDeleted: false, // Explicitly exclude deleted categories
      sortBy: 'name',
      sortOrder: 'asc',
      limit,
      offset,
    });
  },

  async softDelete(id: string): Promise<CategoryRow> {
    // Verify category exists (excluding already deleted categories)
    const existing = await categoryRepo.findById(id, false);
    if (!existing) {
      throw new Error('Category not found');
    }

    // Business rule: Check if category has active products before deleting
    // This could be implemented in future if needed
    // For now, allow soft delete

    return await categoryRepo.softDelete(id);
  },

  // Hard delete (only for testing purposes and batch clean-ups)
  async hardDelete(id: string): Promise<CategoryRow> {
    // Verify category exists (including deleted categories for hard delete)
    const existing = await categoryRepo.findById(id, true);
    if (!existing) {
      throw new Error('Category not found');
    }

    return await categoryRepo.hardDelete(id);
  },
};
