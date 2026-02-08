import { categoryRepo, productRepo } from '../database/repositories';
import {
  CreateCategoryInput,
  UpdateCategoryInput,
  CategoryRow,
  CategoryFindAllFilters,
  CategoryExistsFilters
} from '../database/types/category';
import { CategoryApiQuery } from '../types/category.types';
import { deleteCategoryTransaction } from '../database/transactions';

export const categoryService = {
  async create(input: CreateCategoryInput): Promise<CategoryRow> {
    // Check if category with same name exists (excluding deleted categories)
    const existing = await categoryRepo.exists({ search: input.name, includeDeleted: false });
    if (existing) {
      throw new Error('Category with the same name already exists');
    }

    return await categoryRepo.create(input);
  },

  async update(id: string, input: UpdateCategoryInput): Promise<CategoryRow> {
    // Verify category exists (excluding deleted categories)
    const existing = await categoryRepo.exists({id, includeDeleted: false});
    if (!existing) {
      throw new Error('Category not found');
    }
    // Verify name doesn't exists (excluding updated category and deleted categories)
    if (input.name) {
      const nameExists = await categoryRepo.findAll({ search: input.name, includeDeleted: false });
      if (nameExists && nameExists.some(category => category.id !== id)) {
        throw new Error('Category with the same name already exists');
      }
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

  async findAll(filters?: CategoryApiQuery): Promise<CategoryRow[]> {
    const { page, pageSize, name, includeDeleted = false, ...rest } = filters || {};
    
    // Convert API params to database filters
    const dbFilters: CategoryFindAllFilters = {
      ...rest,
      ...(name && { search: name }), // Map 'name' to 'search' for repository
      includeDeleted,
      limit: pageSize,
      offset: page && pageSize ? (page - 1) * pageSize : undefined
    };
    
    return await categoryRepo.findAll(dbFilters);
  },

  async findAllDefault(params?: Pick<CategoryApiQuery, 'page' | 'pageSize'>): Promise<CategoryRow[]> {
    const { page, pageSize } = params || {};
    
    // Convert to database filters
    const dbFilters: CategoryFindAllFilters = {
      includeDeleted: false,
      sortBy: 'name',
      sortOrder: 'asc',
      limit: pageSize,
      offset: page && pageSize ? (page - 1) * pageSize : undefined
    };
    
    return await categoryRepo.findAll(dbFilters);
  },

  async softDelete(id: string): Promise<CategoryRow> {
    // Verify category exists (excluding already deleted categories)
    const existing = await categoryRepo.exists({id, includeDeleted: false});
    if (!existing) {
      throw new Error('Category not found');
    }

    return await deleteCategoryTransaction(id, false);
  },

  // Hard delete (only for testing purposes and batch clean-ups)
  async hardDelete(id: string): Promise<CategoryRow> {
    // Verify category exists (including deleted categories for hard delete)
    const existing = await categoryRepo.exists({id, includeDeleted: true});
    if (!existing) {
      throw new Error('Category not found');
    }

    return await deleteCategoryTransaction(id, true);
  },
};
