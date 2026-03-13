import { Request, Response } from 'express';
import { brandServicePublic } from '../services';
import { asyncHandler } from '../utils/async-handler';
import { createBrandSchema, updateBrandSchema } from '../database/types/brand';
import { brandApiQuerySchema, brandParamsSchema } from '../types/brand.types';

export const brandController = {
  // POST /brands
  create: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const brandData = createBrandSchema.parse(req.body);
    const newBrand = await brandServicePublic.create(brandData);
    res.status(201).json({
      success: true,
      data: newBrand,
      message: 'Brand created successfully',
    });
  }),

  // PATCH /brands/:id
  update: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = brandParamsSchema.parse(req.params);
    const updateData = updateBrandSchema.parse(req.body);
    const updatedBrand = await brandServicePublic.update(id, updateData);
    res.status(200).json({
      success: true,
      data: updatedBrand,
      message: 'Brand updated successfully',
    });
  }),

  // GET /brands/:id
  findById: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = brandParamsSchema.parse(req.params);
    const brand = await brandServicePublic.findById(id);
    res.status(200).json({
      success: true,
      data: brand,
    });
  }),

  // GET /brands
  findAll: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const filters = brandApiQuerySchema.parse(req.query);
    const brands = await brandServicePublic.findAll(filters);
    res.status(200).json({
      success: true,
      data: brands,
      pagination: {
        ...(filters.page && filters.pageSize && {
          currentPage: filters.page,
          pageSize: filters.pageSize,
        }),
      },
    });
  }),

  // DELETE /brands/:id
  delete: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = brandParamsSchema.parse(req.params);
    const deletedBrand = await brandServicePublic.delete(id);
    res.status(200).json({
      success: true,
      data: deletedBrand,
      message: 'Brand deleted successfully',
    });
  }),
};
