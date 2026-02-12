import { Request, Response } from 'express';
import { productServicePublic, productServicePrivate } from '../services';
import { asyncHandler } from '../utils/async-handler';
import { createProductSchema, updateProductSchema } from '../database/types/product';
import { productParamsSchema, productSkuParamsSchema, productApiQuerySchema } from '../types/product.types';

export const productController = {
  // POST /products
  create: asyncHandler(async (req: Request, res: Response) => {
    const productData = createProductSchema.parse(req.body);
    const newProduct = await productServicePublic.create(productData);
    res.status(201).json({
      success: true,
      data: newProduct,
      message: 'Product created successfully'
    });
  }),

  // PATCH /products/:id
  update: asyncHandler(async (req: Request, res: Response) => {
    const { id } = productParamsSchema.parse(req.params);
    const updateData = updateProductSchema.parse(req.body);
    const updatedProduct = await productServicePublic.update(id, updateData);
    res.json({
      success: true,
      data: updatedProduct,
      message: 'Product updated successfully'
    });
  }),

  // GET /products/:id
  findById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = productParamsSchema.parse(req.params);
    const product = await productServicePublic.findById(id);
    res.json({
      success: true,
      data: product
    });
  }),

  // GET /products/sku/:sku
  findBySku: asyncHandler(async (req: Request, res: Response) => {
    const { sku } = productSkuParamsSchema.parse(req.params);
    const product = await productServicePublic.findBySku(sku);
    res.json({
      success: true,
      data: product
    });
  }),

  // GET /products
  findAll: asyncHandler(async (req: Request, res: Response) => {
    const filters = productApiQuerySchema.parse(req.query);
    const products = await productServicePublic.findAll(filters);
    res.json({
      success: true,
      data: products,
      pagination: {
        ...(filters.page && filters.pageSize && {
          currentPage: filters.page,
          pageSize: filters.pageSize
        })
      }
    });
  }),

  // GET /products/default
  findAllDefault: asyncHandler(async (req: Request, res: Response) => {
    const filters = productApiQuerySchema.pick({ page: true, pageSize: true }).parse(req.query);
    const products = await productServicePublic.findAllDefault(filters);
    res.json({
      success: true,
      data: products,
      pagination: {
        ...(filters.page && filters.pageSize && {
          currentPage: filters.page,
          pageSize: filters.pageSize
        })
      }
    });
  }),

  // DELETE /products/:id - Soft delete product
  softDelete: asyncHandler(async (req: Request, res: Response) => {
    const { id } = productParamsSchema.parse(req.params);
    const deletedProduct = await productServicePublic.softDelete(id);
    res.json({
      success: true,
      data: deletedProduct,
      message: 'Product deleted successfully'
    });
  }),

  // DELETE /products/:id/hard - Hard delete product (only for testing and clean-up)
  hardDelete: asyncHandler(async (req: Request, res: Response) => {
    const { id } = productParamsSchema.parse(req.params);
    const deletedProduct = await productServicePrivate.hardDelete(id);
    res.json({
      success: true,
      data: deletedProduct,
      message: 'Product permanently deleted successfully'
    });
  })
};