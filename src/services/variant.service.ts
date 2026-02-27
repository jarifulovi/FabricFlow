import { variantRepo, productRepo } from '../database/repositories';
import {
  CreateProductVariantInput,
  UpdateProductVariantInput,
  ProductVariantRow,
  ProductVariantWithProductRow,
  ProductVariantListRow,
  VariantFindAllFilters,
} from '../database/types/variant';
import { VariantApiQuery } from '../types/variant.types';

export const variantService = {
  async create(input: CreateProductVariantInput): Promise<ProductVariantRow> {
    // Check parent product status before allowing variant creation
    const product = await productRepo.findById(input.productId, false);
    if (!product) {
      throw new Error('Product not found');
    }
    if (product.status === 'inactive') {
      throw new Error('Cannot create variant for an inactive product');
    }
    if (product.status === 'discontinued') {
      throw new Error('Cannot create variant for a discontinued product');
    }

    // Check if variant SKU already exists (excluding deleted variants)
    const existingBySku = await variantRepo.exists({ sku: input.sku, includeDeleted: false });
    if (existingBySku) {
      throw new Error('Variant with the same SKU already exists');
    }

    return await variantRepo.create(input);
  },

  async update(id: string, input: UpdateProductVariantInput): Promise<ProductVariantRow> {
    // Verify variant exists and fetch with product info to check status
    const existing = await variantRepo.findById(id, false);
    if (!existing) {
      throw new Error('Variant not found');
    }
    // Block all updates for variants of discontinued products
    if (existing.product.status === 'discontinued') {
      throw new Error('Cannot update variant of a discontinued product');
    }
    // Check if sku already exists for another variant (excluding deleted variants) - only when SKU is being updated
    if (input.sku) {
      const existingBySku = await variantRepo.exists({ sku: input.sku, excludeIds: [id], includeDeleted: false });
      if (existingBySku) {
        throw new Error('Another variant with the same SKU already exists');
      }
    }

    return await variantRepo.update(id, input);
  },

  async findById(id: string): Promise<ProductVariantWithProductRow> {
    const variant = await variantRepo.findById(id, false); // Explicitly exclude deleted
    if (!variant) {
      throw new Error('Variant not found');
    }
    return variant;
  },

  async findBySku(sku: string): Promise<ProductVariantWithProductRow> {
    const variant = await variantRepo.findBySku(sku, false); // Explicitly exclude deleted
    if (!variant) {
      throw new Error('Variant not found');
    }
    return variant;
  },

  async findAll(filters?: VariantApiQuery): Promise<ProductVariantListRow[]> {
    const { page, pageSize, includeDeleted = false, ...rest } = filters || {};
    
    // Convert API params to database filters
    const dbFilters: VariantFindAllFilters = {
      ...rest,
      includeDeleted,
      limit: pageSize,
      offset: page && pageSize ? (page - 1) * pageSize : undefined
    };
    
    return await variantRepo.findAll(dbFilters);
  },

  async findAllDefault(params?: Pick<VariantApiQuery, 'page' | 'pageSize'>): Promise<ProductVariantListRow[]> {
    const { page, pageSize } = params || {};

    const dbFilters: VariantFindAllFilters = {
      includeDeleted: false,
      sortBy: 'sku',
      sortOrder: 'asc',
      limit: pageSize,
      offset: page && pageSize ? (page - 1) * pageSize : undefined
    };
    
    return await variantRepo.findAll(dbFilters);
  },

  async softDelete(id: string): Promise<ProductVariantRow> {
    // Verify variant exists (excluding already deleted variants)
    const existing = await variantRepo.exists({ id, includeDeleted: false });
    if (!existing) {
      throw new Error('Variant not found');
    }

    return await variantRepo.softDelete(id);
  },

  // Hard delete (only for testing purposes and batch clean-ups)
  async hardDelete(id: string): Promise<ProductVariantRow> {
    // Verify variant exists (including deleted variants for hard delete)
    const existing = await variantRepo.exists({ id, includeDeleted: true });
    if (!existing) {
      throw new Error('Variant not found');
    }

    return await variantRepo.hardDelete(id);
  },
};
