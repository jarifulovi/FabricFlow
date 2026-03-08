import { variantRepo, productRepo, receivingSlipLineRepo } from '../database/repositories';
import {
  CreateProductVariantInput,
  UpdateProductVariantInput,
  ProductVariantRow,
  ProductVariantWithProductRow,
  ProductVariantListRow,
  VariantFindAllFilters,
} from '../database/types/variant';
import { VariantApiQuery } from '../types/variant.types';
import { NotFoundError, ConflictError, BadRequestError } from '../utils/errors';
import { convertToLimitAndOffset } from '../utils/service-utils';
import { hasUpdateFields } from '../utils/service-utils';

export const variantService = {
  async create(input: CreateProductVariantInput): Promise<ProductVariantRow> {
    // Check parent product status before allowing variant creation
    const product = await productRepo.findById(input.productId, false);
    if (!product) {
      throw new NotFoundError('Product not found');
    }
    if (product.status === 'inactive') {
      throw new BadRequestError('Cannot create variant for an inactive product');
    }
    if (product.status === 'discontinued') {
      throw new BadRequestError('Cannot create variant for a discontinued product');
    }

    // Check if variant SKU already exists (excluding deleted variants)
    const existingBySku = await variantRepo.exists({ sku: input.sku, includeDeleted: false });
    if (existingBySku) {
      throw new ConflictError('Variant with the same SKU already exists');
    }

    return await variantRepo.create(input);
  },

  async update(id: string, input: UpdateProductVariantInput): Promise<ProductVariantRow> {
    if (!hasUpdateFields(input)) {
      throw new BadRequestError('No fields provided to update');
    }
    // Verify variant exists and fetch with product info to check status
    const existing = await variantRepo.findById(id, false);
    if (!existing) {
      throw new NotFoundError('Variant not found');
    }
    // Block all updates for variants of discontinued products
    if (existing.product.status === 'discontinued') {
      throw new BadRequestError('Cannot update variant of a discontinued product');
    }
    // Check if sku already exists for another variant (excluding deleted variants) - only when SKU is being updated
    if (input.sku) {
      const existingBySku = await variantRepo.exists({ sku: input.sku, excludeIds: [id], includeDeleted: false });
      if (existingBySku) {
        throw new ConflictError('Another variant with the same SKU already exists');
      }
    }
    return await variantRepo.update(id, input);
  },

  async findById(id: string): Promise<ProductVariantWithProductRow> {
    const variant = await variantRepo.findById(id, false); // Explicitly exclude deleted
    if (!variant) {
      throw new NotFoundError('Variant not found');
    }
    return variant;
  },

  async findBySku(sku: string): Promise<ProductVariantWithProductRow> {
    const variant = await variantRepo.findBySku(sku, false); // Explicitly exclude deleted
    if (!variant) {
      throw new NotFoundError('Variant not found');
    }
    return variant;
  },

  async findAll(filters?: VariantApiQuery): Promise<ProductVariantListRow[]> {
    const { page, pageSize, includeDeleted = false, ...rest } = filters || {};
    const { limit, offset } = convertToLimitAndOffset(page, pageSize);
    // Convert API params to database filters
    const dbFilters: VariantFindAllFilters = {
      ...rest,
      includeDeleted,
      limit,
      offset
    };
    return await variantRepo.findAll(dbFilters);
  },

  async findAllDefault(params?: Pick<VariantApiQuery, 'page' | 'pageSize'>): Promise<ProductVariantListRow[]> {
    const { page, pageSize } = params || {};
    const { limit, offset } = convertToLimitAndOffset(page, pageSize);
    const dbFilters: VariantFindAllFilters = {
      includeDeleted: false,
      sortBy: 'sku',
      sortOrder: 'asc',
      limit,
      offset
    };
    return await variantRepo.findAll(dbFilters);
  },

  async softDelete(id: string): Promise<ProductVariantRow> {
    await variantService.validateVariantDeletable(id);
    return await variantRepo.softDelete(id);
  },

  // Hard delete (only for testing purposes and batch clean-ups)
  async hardDelete(id: string): Promise<ProductVariantRow> {
    await variantService.validateVariantDeletable(id, true);
    return await variantRepo.hardDelete(id);
  },

  // Private methods for validations and complex logic
  async validateVariantDeletable(id: string, includeDeleted: boolean = false): Promise<void> {
    // Verify variant exists (including deleted variants for validation)
    const existing = await variantRepo.exists({ id, includeDeleted });
    if (!existing) {
      throw new NotFoundError('Variant not found');
    }
    // Check variant exists in receiving slip lines before allowing deletion
    const usedInSlips = await receivingSlipLineRepo.exists({ variantId: id });
    if (usedInSlips) {
      throw new BadRequestError('Cannot delete variant that is used in receiving slip lines');
    }
    // TODO: Add checks for sales in future when sales module is implemented
  }
};
