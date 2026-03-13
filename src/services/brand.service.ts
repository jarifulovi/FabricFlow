import { brandRepo, productRepo } from '../database/repositories';
import {
  CreateBrandInput,
  UpdateBrandInput,
  BrandFindAllFilters,
  BrandRow,
} from '../database/types/brand';
import { BrandApiQuery } from '../types/brand.types';
import { BadRequestError, ConflictError, NotFoundError } from '../utils/errors';
import { convertToLimitAndOffset, hasUpdateFields } from '../utils/service-utils';

export const brandService = {
  async create(input: CreateBrandInput): Promise<BrandRow> {
    const existsByName = await brandRepo.exists({ name: input.name });
    if (existsByName) {
      throw new ConflictError('Brand with the same name already exists');
    }

    if (input.code) {
      const existsByCode = await brandRepo.exists({ code: input.code });
      if (existsByCode) {
        throw new ConflictError('Brand with the same code already exists');
      }
    }

    return await brandRepo.create(input);
  },

  async update(id: string, input: UpdateBrandInput): Promise<BrandRow> {
    if (!hasUpdateFields(input)) {
      throw new BadRequestError('No fields provided to update');
    }

    const existing = await brandRepo.exists({ id });
    if (!existing) {
      throw new NotFoundError('Brand not found');
    }

    if (input.name) {
      const nameTaken = await brandRepo.exists({ name: input.name, excludeIds: [id] });
      if (nameTaken) {
        throw new ConflictError('Another brand with the same name already exists');
      }
    }

    if (input.code) {
      const codeTaken = await brandRepo.exists({ code: input.code, excludeIds: [id] });
      if (codeTaken) {
        throw new ConflictError('Another brand with the same code already exists');
      }
    }

    return await brandRepo.update(id, input);
  },

  async findById(id: string): Promise<BrandRow> {
    const brand = await brandRepo.findById(id);
    if (!brand) {
      throw new NotFoundError('Brand not found');
    }
    return brand;
  },

  async findAll(filters?: BrandApiQuery): Promise<BrandRow[]> {
    const { page, pageSize, ...rest } = filters || {};
    const { limit, offset } = convertToLimitAndOffset(page, pageSize);

    const dbFilters: BrandFindAllFilters = {
      ...rest,
      limit,
      offset,
    };

    return await brandRepo.findAll(dbFilters);
  },

  async delete(id: string): Promise<BrandRow> {
    const existing = await brandRepo.exists({ id });
    if (!existing) {
      throw new NotFoundError('Brand not found');
    }

    const productsCount = await productRepo.count({ brandId: id, includeDeleted: false });
    if (productsCount > 0) {
      throw new BadRequestError('Cannot delete brand with associated products');
    }

    return await brandRepo.delete(id);
  },
};
