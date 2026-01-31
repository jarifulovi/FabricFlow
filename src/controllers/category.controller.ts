import { Request, Response } from 'express';
import { categoryServicePublic } from '../services';
import { CreateCategoryInput, UpdateCategoryInput } from '../database/types/category';
import { extractParamString, parsePaginationParams, extractQueryString } from '../utils/controller-parser';
import { asyncHandler } from '../utils/async-handler';


export const categoryController = {
  // POST /categories
  create: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const input: CreateCategoryInput = req.body;
    const result = await categoryServicePublic.create(input);
    res.status(201).json({
      success: true,
      data: result,
      message: 'Category created successfully'
    });
  }),

  // PATCH /categories/:id
  update: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const categoryId = extractParamString(req.params.id);
    const input: UpdateCategoryInput = req.body;
    const result = await categoryServicePublic.update(categoryId, input);
    res.status(200).json({
      success: true,
      data: result,
      message: 'Category updated successfully'
    });
  }),

  // GET /categories/:id
  findById: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const categoryId = extractParamString(req.params.id);
    const result = await categoryServicePublic.findById(categoryId);
    res.status(200).json({
      success: true,
      data: result
    });
  }),

  // GET /categories
  findAll: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { page, pageSize } = parsePaginationParams(req.query);
    const name = extractQueryString(req.query.name);
    const sortBy = extractQueryString(req.query.sortBy) as 'name' | 'createdAt' | undefined;
    const sortOrder = extractQueryString(req.query.sortOrder) as 'asc' | 'desc' | undefined;
    
    const filters = {
      ...(name && { name }),
      ...(sortBy && { sortBy }),
      ...(sortOrder && { sortOrder }),
      ...(page && { page }),
      ...(pageSize && { pageSize })
    };

    const result = await categoryServicePublic.findAll(filters);
    res.status(200).json({
      success: true,
      data: result,
      pagination: {
        ...(page && pageSize && {
          currentPage: page,
          pageSize: pageSize
        })
      }
    });
  }),

  // GET /categories/default
  findAllDefault: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { page, pageSize } = parsePaginationParams(req.query);
    
    const params = {
      ...(page && { page }),
      ...(pageSize && { pageSize })
    };

    const result = await categoryServicePublic.findAllDefault(params);
    res.status(200).json({
      success: true,
      data: result,
      pagination: {
        ...(page && pageSize && {
          currentPage: page,
          pageSize: pageSize
        })
      }
    });
  })

  // DELETE /categories/:id (will be placed in test routes only)
  // async delete(req: Request, res: Response): Promise<void> {
  //   try {
  //     const { id } = req.params;
  //     const categoryId = Array.isArray(id) ? id[0] : id;
  //     const result = await categoryService.delete(categoryId);
  //     res.status(200).json({
  //       success: true,
  //       data: result,
  //       message: 'Category deleted successfully'
  //     });
  //   } catch (error) {
  //     const statusCode = error instanceof Error && error.message === 'Category not found' ? 404 : 400;
  //     res.status(statusCode).json({
  //       success: false,
  //       message: error instanceof Error ? error.message : 'Failed to delete category'
  //     });
  //   }
  // }
};