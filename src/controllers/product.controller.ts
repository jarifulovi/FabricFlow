import { Request, Response } from 'express';
import { productServicePublic } from '../services';
import { asyncHandler } from '../utils/async-handler';
import { createProductSchema, updateProductSchema } from '../database/types/product';
import { productParamsSchema, productSkuParamsSchema, productApiQuerySchema } from '../types/product.types';

export const productController = {
  // GET /products
  getProducts: asyncHandler(async (req: Request, res: Response) => {
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
  getProductsDefault: asyncHandler(async (req: Request, res: Response) => {
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

  // GET /products/:id
  getProductById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = productParamsSchema.parse(req.params);
    const product = await productServicePublic.findById(id);
    
    res.json({
      success: true,
      data: product
    });
  }),

  // GET /products/sku/:sku
  getProductBySku: asyncHandler(async (req: Request, res: Response) => {
    const { sku } = productSkuParamsSchema.parse(req.params);
    const product = await productServicePublic.findBySku(sku);
    
    res.json({
      success: true,
      data: product
    });
  }),

  // POST /products
  createProduct: asyncHandler(async (req: Request, res: Response) => {
    const productData = createProductSchema.parse(req.body);
    const newProduct = await productServicePublic.create(productData);
    res.status(201).json({
      success: true,
      data: newProduct,
      message: 'Product created successfully'
    });
  }),

  // PUT /products/:id
  updateProduct: asyncHandler(async (req: Request, res: Response) => {
    const { id } = productParamsSchema.parse(req.params);
    const updateData = updateProductSchema.parse(req.body);
    const updatedProduct = await productServicePublic.update(id, updateData);
    res.json({
      success: true,
      data: updatedProduct,
      message: 'Product updated successfully'
    });
  }),

  // DELETE /products/:id
  deleteProduct: asyncHandler(async (req: Request, res: Response) => {
    const { id } = productParamsSchema.parse(req.params);
    const deletedProduct = await productServicePublic.softDelete(id);
    
    res.json({
      success: true,
      data: deletedProduct,
      message: 'Product deleted successfully'
    });
  })
};