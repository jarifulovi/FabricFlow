import { Request, Response } from 'express';
import { productServicePublic } from '../services';
import { asyncHandler } from '../utils/async-handler';
import { extractParamString, parsePaginationParams, extractQueryString, parseQueryBoolean } from '../utils/controller-parser';

export const productController = {
  // GET /products
  getProducts: asyncHandler(async (req: Request, res: Response) => {
    const { page, pageSize } = parsePaginationParams(req.query);
    const categoryId = extractQueryString(req.query.categoryId);
    const search = extractQueryString(req.query.search);
    const status = extractQueryString(req.query.status) as 'active' | 'inactive' | 'discontinued' | undefined;
    const tag = extractQueryString(req.query.tag); // Add tag extraction
    const includeDeleted = parseQueryBoolean(req.query.includeDeleted);
    const sortBy = extractQueryString(req.query.sortBy) as 'name' | 'createdAt' | undefined;
    const sortOrder = extractQueryString(req.query.sortOrder) as 'asc' | 'desc' | undefined;

    const filters = {
      ...(categoryId && { categoryId }),
      ...(search && { search }),
      ...(status && { status }),
      ...(tag && { tag }), // Add tag to filters
      ...(includeDeleted !== undefined && { includeDeleted }),
      ...(sortBy && { sortBy }),
      ...(sortOrder && { sortOrder }),
      ...(page && { page }),
      ...(pageSize && { pageSize })
    };

    const products = await productServicePublic.findAll(filters);
    res.json({
      success: true,
      data: products,
      pagination: {
        ...(page && pageSize && {
          currentPage: page,
          pageSize: pageSize
        })
      }
    });
  }),

  // GET /products/default
  getProductsDefault: asyncHandler(async (req: Request, res: Response) => {
    const { page, pageSize } = parsePaginationParams(req.query);
    
    const params = {
      ...(page && { page }),
      ...(pageSize && { pageSize })
    };

    const products = await productServicePublic.findAllDefault(params);
    res.json({
      success: true,
      data: products,
      pagination: {
        ...(page && pageSize && {
          currentPage: page,
          pageSize: pageSize
        })
      }
    });
  }),

  // GET /products/:id
  getProductById: asyncHandler(async (req: Request, res: Response) => {
    const productId = extractParamString(req.params.id);
    const product = await productServicePublic.findById(productId);
    
    res.json({
      success: true,
      data: product
    });
  }),

  // GET /products/sku/:sku
  getProductBySku: asyncHandler(async (req: Request, res: Response) => {
    const productSku = extractParamString(req.params.sku);
    const product = await productServicePublic.findBySku(productSku);
    
    res.json({
      success: true,
      data: product
    });
  }),

  // POST /products
  createProduct: asyncHandler(async (req: Request, res: Response) => {
    const productData = req.body;
    const newProduct = await productServicePublic.create(productData);
    res.status(201).json({
      success: true,
      data: newProduct,
      message: 'Product created successfully'
    });
  }),

  // PUT /products/:id
  updateProduct: asyncHandler(async (req: Request, res: Response) => {
    const productId = extractParamString(req.params.id);
    const updateData = req.body;
    const updatedProduct = await productServicePublic.update(productId, updateData);
    res.json({
      success: true,
      data: updatedProduct,
      message: 'Product updated successfully'
    });
  }),

  // DELETE /products/:id
  deleteProduct: asyncHandler(async (req: Request, res: Response) => {
    const productId = extractParamString(req.params.id);
    const deletedProduct = await productServicePublic.softDelete(productId);
    
    res.json({
      success: true,
      data: deletedProduct,
      message: 'Product deleted successfully'
    });
  })
};