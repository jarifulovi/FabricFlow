import request from 'supertest';
import app from '../../src/app';
import pool from '../../src/database/connection';
import { makeCategory, makeProduct, makeVariant, makeFullVariant } from '../helpers/generators';

describe('Variant API', () => {

  const endpoint = '/api/variants';
  const productEndpoint = '/api/products';
  const categoryEndpoint = '/api/categories';

  let testCategoryId: string;
  let testProductId: string;

  beforeAll(async () => {
    // Create a shared category and active product for all variant tests
    const categoryResponse = await request(app)
      .post(categoryEndpoint)
      .send(makeCategory({ description: 'Category for variant testing' }))
      .expect(201);
    testCategoryId = categoryResponse.body.data.id;

    const productResponse = await request(app)
      .post(productEndpoint)
      .send(makeProduct(testCategoryId, { description: 'Product for variant testing' }))
      .expect(201);
    testProductId = productResponse.body.data.id;
  });

  afterAll(async () => {
    if (testProductId) {
      await request(app)
        .delete(`${productEndpoint}/${testProductId}/hard`)
        .catch(() => {});
    }
    if (testCategoryId) {
      await request(app)
        .delete(`${categoryEndpoint}/${testCategoryId}/hard`)
        .catch(() => {});
    }
    await pool.end();
  });

  // ─────────────────────────────────────────────────────────────────────────
  describe('create variant', () => {

    let createdVariantId: string;
    let variantData: ReturnType<typeof makeVariant>;
    let testVariantSku: string;

    beforeAll(() => {
      variantData = makeVariant(testProductId, { color: 'Red', size: 'M' });
      testVariantSku = variantData.sku;
    });

    afterAll(async () => {
      if (createdVariantId) {
        await request(app)
          .delete(`${endpoint}/${createdVariantId}/hard`)
          .expect(200);
      }
    });

    it('should create a new variant', async () => {
      const response = await request(app)
        .post(endpoint)
        .send(variantData)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.sku).toBe(variantData.sku);
      expect(response.body.data.productId).toBe(testProductId);

      createdVariantId = response.body.data.id;
      expect(createdVariantId).toBeDefined();
    });

    it('should create a new variant with all fields', async () => {
      const fullVariantData = makeFullVariant(testProductId);
      const response = await request(app)
        .post(endpoint)
        .send(fullVariantData)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.sku).toBe(fullVariantData.sku);
      expect(response.body.data.productId).toBe(testProductId);
      expect(response.body.data.id).toBeDefined();
      // check the structure of full variant fields
    });

    it('should not create a variant with duplicate SKU', async () => {
      const response = await request(app)
        .post(endpoint)
        .send(makeVariant(testProductId, { sku: testVariantSku }))
        .expect('Content-Type', /json/)
        .expect(409);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });

    it('should create with minimum required fields', async () => {
      const minimalVariant = makeVariant(testProductId);

      const response = await request(app)
        .post(endpoint)
        .send(minimalVariant)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.sku).toBe(minimalVariant.sku);
      expect(response.body.data.color).toBeNull();

      // Clean up
      await request(app)
        .delete(`${endpoint}/${response.body.data.id}/hard`)
        .expect(200);
    });

    it('should fail to create a variant without required fields', async () => {
      const response = await request(app)
        .post(endpoint)
        .send({ color: 'Blue' })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });

    it('should fail to create a variant for a non-existent product', async () => {
      const response = await request(app)
        .post(endpoint)
        .send(makeVariant('00000000-0000-0000-0000-000000000000'))
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });

    it('should fail to create a variant for an inactive product', async () => {
      // Create an inactive product
      const inactiveProductResponse = await request(app)
        .post(productEndpoint)
        .send(makeProduct(testCategoryId, { status: 'inactive' }))
        .expect(201);
      const inactiveProductId = inactiveProductResponse.body.data.id;

      const response = await request(app)
        .post(endpoint)
        .send(makeVariant(inactiveProductId))
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');

      // Clean up
      await request(app)
        .delete(`${productEndpoint}/${inactiveProductId}/hard`)
        .expect(200);
    });

    it('should fail to create a variant for a discontinued product', async () => {
      // Create a discontinued product
      const discontinuedProductResponse = await request(app)
        .post(productEndpoint)
        .send(makeProduct(testCategoryId, { status: 'discontinued' }))
        .expect(201);
      const discontinuedProductId = discontinuedProductResponse.body.data.id;

      const response = await request(app)
        .post(endpoint)
        .send(makeVariant(discontinuedProductId))
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');

      // Clean up
      await request(app)
        .delete(`${productEndpoint}/${discontinuedProductId}/hard`)
        .expect(200);
    });

    it('should allow creation of variant with same SKU after soft delete', async () => {
      // Soft delete the original variant
      await request(app)
        .delete(`${endpoint}/${createdVariantId}`)
        .expect(200);

      // Recreate with the same SKU
      const response = await request(app)
        .post(endpoint)
        .send(makeVariant(testProductId, { sku: testVariantSku }))
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data.sku).toBe(testVariantSku);

      createdVariantId = response.body.data.id;
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  describe('get variant', () => {

    let createdVariantId: string;
    let createdVariantSku: string;

    beforeAll(async () => {
      const variantData = makeVariant(testProductId, { color: 'Blue', size: 'L' });
      createdVariantSku = variantData.sku;

      const response = await request(app)
        .post(endpoint)
        .send(variantData)
        .expect(201);

      createdVariantId = response.body.data.id;
    });

    afterAll(async () => {
      if (createdVariantId) {
        await request(app)
          .delete(`${endpoint}/${createdVariantId}/hard`)
          .expect(200);
      }
    });

    it('should get a variant by ID', async () => {
      const response = await request(app)
        .get(`${endpoint}/${createdVariantId}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data.id).toBe(createdVariantId);
      expect(response.body.data.sku).toBe(createdVariantSku);
    });

    it('should get a variant by SKU', async () => {
      const response = await request(app)
        .get(`${endpoint}/sku/${createdVariantSku}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data.id).toBe(createdVariantId);
      expect(response.body.data.sku).toBe(createdVariantSku);
    });

    it('should return 404 for non-existent variant', async () => {
      const response = await request(app)
        .get(`${endpoint}/00000000-0000-0000-0000-000000000000`)
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 for invalid variant ID format', async () => {
      const response = await request(app)
        .get(`${endpoint}/invalid-id`)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  describe('get variants', () => {

    let variantIds: string[] = [];

    beforeAll(async () => {
      const variantsToSeed = [
        makeVariant(testProductId, { color: 'Red',  size: 'S' }),
        makeVariant(testProductId, { color: 'Green', size: 'M' }),
        makeVariant(testProductId, { sku: `SEARCHABLE-VAR-${Date.now()}`, color: 'Blue', size: 'L' }),
      ];

      for (const variant of variantsToSeed) {
        const response = await request(app)
          .post(endpoint)
          .send(variant)
          .expect(201);
        variantIds.push(response.body.data.id);
      }
    });

    afterAll(async () => {
      for (const id of variantIds) {
        await request(app)
          .delete(`${endpoint}/${id}/hard`)
          .expect(200);
      }
    });

    it('should get a list of variants (default)', async () => {
      const response = await request(app)
        .get(`${endpoint}/default`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThanOrEqual(3);
    });

    it('should get a list of variants with pagination', async () => {
      const response = await request(app)
        .get(`${endpoint}/default`)
        .query({ pageSize: 2, page: 1 })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeLessThanOrEqual(2);
    });

    it('should filter variants by search query (SKU)', async () => {
      const response = await request(app)
        .get(endpoint)
        .query({ search: 'SEARCHABLE-VAR' })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].sku).toContain('SEARCHABLE-VAR');
    });

    it('should filter variants by productId', async () => {
      const response = await request(app)
        .get(endpoint)
        .query({ productId: testProductId })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data.every((v: any) => v.productId === testProductId)).toBe(true);
    });

    it('should return empty array if no variants match search query', async () => {
      const response = await request(app)
        .get(endpoint)
        .query({ search: 'NonExistentVariantSKU999' })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(0);
    });

    it('should filter variants by sorting', async () => {
      const response = await request(app)
        .get(endpoint)
        .query({ sortBy: 'sku', sortOrder: 'desc' })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(Array.isArray(response.body.data)).toBe(true);
      const skus = response.body.data.map((v: any) => v.sku);
      for (let i = 0; i < skus.length - 1; i++) {
        expect(skus[i].localeCompare(skus[i + 1])).toBeGreaterThanOrEqual(0);
      }
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  describe('update variant', () => {

    let createdVariantId: string;
    let originalVariantSku: string;
    let updatedVariantSku: string;

    beforeAll(async () => {
      const variantData = makeVariant(testProductId, { color: 'White' });
      originalVariantSku = variantData.sku;
      updatedVariantSku = makeVariant(testProductId).sku;

      const response = await request(app)
        .post(endpoint)
        .send(variantData)
        .expect(201);

      createdVariantId = response.body.data.id;
    });

    afterAll(async () => {
      if (createdVariantId) {
        await request(app)
          .delete(`${endpoint}/${createdVariantId}/hard`)
          .expect(200);
      }
    });

    it('should update a variant', async () => {
      const updatedData = { sku: updatedVariantSku, color: 'Black', size: 'XL' };

      const response = await request(app)
        .patch(`${endpoint}/${createdVariantId}`)
        .send(updatedData)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data.id).toBe(createdVariantId);
      expect(response.body.data.sku).toBe(updatedData.sku);
      expect(response.body.data.color).toBe(updatedData.color);
      expect(response.body.data.size).toBe(updatedData.size);
    });

    it('should allow partial updates', async () => {
      const response = await request(app)
        .patch(`${endpoint}/${createdVariantId}`)
        .send({ color: 'Grey' })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data.id).toBe(createdVariantId);
      expect(response.body.data.sku).toBe(updatedVariantSku); // SKU unchanged
      expect(response.body.data.color).toBe('Grey');
    });

    it('should return 404 for updating non-existent variant', async () => {
      const response = await request(app)
        .patch(`${endpoint}/00000000-0000-0000-0000-000000000000`)
        .send({ color: 'Should Not Update' })
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 for invalid update data', async () => {
      const response = await request(app)
        .patch(`${endpoint}/${createdVariantId}`)
        .send({ sku: '' }) // SKU cannot be empty
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });

    it('should not allow updating to a duplicate variant SKU', async () => {
      // Create another variant
      const conflictData = makeVariant(testProductId);
      const conflictResponse = await request(app)
        .post(endpoint)
        .send(conflictData)
        .expect(201);
      const conflictingVariantId = conflictResponse.body.data.id;

      // Try to update it to use the already-taken SKU
      const response = await request(app)
        .patch(`${endpoint}/${conflictingVariantId}`)
        .send({ sku: updatedVariantSku })
        .expect('Content-Type', /json/)
        .expect(409);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');

      await request(app)
        .delete(`${endpoint}/${conflictingVariantId}/hard`)
        .expect(200);
    });

    it('should not allow updating a variant of a discontinued product', async () => {
      // Create a product and variant, then discontinue the product
      const discontinuedProductResponse = await request(app)
        .post(productEndpoint)
        .send(makeProduct(testCategoryId, { status: 'active' }))
        .expect(201);
      const discontinuedProductId = discontinuedProductResponse.body.data.id;

      const variantResponse = await request(app)
        .post(endpoint)
        .send(makeVariant(discontinuedProductId))
        .expect(201);
      const discontinuedVariantId = variantResponse.body.data.id;

      // Discontinue the product
      await request(app)
        .patch(`${productEndpoint}/${discontinuedProductId}`)
        .send({ status: 'discontinued' })
        .expect(200);

      // Try to update the variant
      const response = await request(app)
        .patch(`${endpoint}/${discontinuedVariantId}`)
        .send({ color: 'Purple' })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');

      // Clean up
      await request(app)
        .delete(`${endpoint}/${discontinuedVariantId}/hard`)
        .expect(200);
      await request(app)
        .delete(`${productEndpoint}/${discontinuedProductId}/hard`)
        .expect(200);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  describe('delete variant', () => {

    let createdVariantId: string;
    let variantSku: string;

    beforeAll(async () => {
      const variantData = makeVariant(testProductId, { color: 'Yellow' });
      variantSku = variantData.sku;

      const response = await request(app)
        .post(endpoint)
        .send(variantData)
        .expect(201);

      createdVariantId = response.body.data.id;
    });

    afterAll(async () => {
      if (createdVariantId) {
        await request(app)
          .delete(`${endpoint}/${createdVariantId}/hard`)
          .catch(() => {});
      }
    });

    it('should soft delete a variant', async () => {
      const response = await request(app)
        .delete(`${endpoint}/${createdVariantId}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data.id).toBe(createdVariantId);
      expect(response.body.data.deletedAt).not.toBeNull();
    });

    it('should not find soft deleted variant by ID', async () => {
      const response = await request(app)
        .get(`${endpoint}/${createdVariantId}`)
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });

    it('should not find soft deleted variant in list', async () => {
      const response = await request(app)
        .get(endpoint)
        .query({ search: variantSku })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(0);
    });

    it('should find soft deleted variant when includeDeleted=true', async () => {
      const response = await request(app)
        .get(endpoint)
        .query({ search: variantSku, includeDeleted: 'true' })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].id).toBe(createdVariantId);
    });

    it('should return 404 when trying to soft delete a non-existent variant', async () => {
      const response = await request(app)
        .delete(`${endpoint}/00000000-0000-0000-0000-000000000000`)
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });
  });

});
