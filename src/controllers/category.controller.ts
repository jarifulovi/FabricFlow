import { Request, Response } from 'express';
import { categoryServicePrivate, categoryServicePublic } from '../services';
import { createCategorySchema, updateCategorySchema } from '../database/types/category';
import { categoryParamsSchema, categoryApiQuerySchema } from '../types/category.types';
import { asyncHandler } from '../utils/async-handler';


export const categoryController = {
  // POST /categories
  create: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const input = createCategorySchema.parse(req.body);
    const newCategory = await categoryServicePublic.create(input);
    res.status(201).json({
      success: true,
      data: newCategory,
      message: 'Category created successfully'
    });
  }),

  // PATCH /categories/:id
  update: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = categoryParamsSchema.parse(req.params);
    const input = updateCategorySchema.parse(req.body);
    const updatedCategory = await categoryServicePublic.update(id, input);
    res.status(200).json({
      success: true,
      data: updatedCategory,
      message: 'Category updated successfully'
    });
  }),

  // GET /categories/:id
  findById: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = categoryParamsSchema.parse(req.params);
    const category = await categoryServicePublic.findById(id);
    res.status(200).json({
      success: true,
      data: category
    });
  }),

  // GET /categories
  findAll: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const filters = categoryApiQuerySchema.parse(req.query);
    const categories = await categoryServicePublic.findAll(filters);
    res.status(200).json({
      success: true,
      data: categories,
      pagination: {
        ...(filters.page && filters.pageSize && {
          currentPage: filters.page,
          pageSize: filters.pageSize
        })
      }
    });
  }),

  // GET /categories/default
  findAllDefault: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const filters = categoryApiQuerySchema.pick({ page: true, pageSize: true }).parse(req.query);
    const categories = await categoryServicePublic.findAllDefault(filters);
    res.status(200).json({
      success: true,
      data: categories,
      pagination: {
        ...(filters.page && filters.pageSize && {
          currentPage: filters.page,
          pageSize: filters.pageSize
        })
      }
    });
  }),

  // DELETE /categories/:id - Soft delete category
  softDelete: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = categoryParamsSchema.parse(req.params);
    const deletedCategory = await categoryServicePublic.softDelete(id);
    res.status(200).json({
      success: true,
      data: deletedCategory,
      message: 'Category deleted successfully'
    });
  }),

  // DELETE /categories/:id/hard - Hard delete category (only for testing and clean-up)
  hardDelete: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = categoryParamsSchema.parse(req.params);
    const deletedCategory = await categoryServicePrivate.hardDelete(id);
    res.status(200).json({
      success: true,
      data: deletedCategory,
      message: 'Category permanently deleted successfully'
    });
  })
};