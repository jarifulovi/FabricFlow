import request from 'supertest';
import app from '../../src/app';
import pool from '../../src/database/connection';
import { makeBrand, makeCategory, makeProduct, makeVariant } from '../helpers/generators';

describe('Brand API', () => {
  const endpoint = '/api/brands';
  const categoryEndpoint = '/api/categories';
  const productEndpoint = '/api/products';
  const variantEndpoint = '/api/variants';

  afterAll(async () => {
    await pool.end();
  });

  describe('create brand', () => {
    let createdBrandId: string;
    let brandData: ReturnType<typeof makeBrand>;

    beforeAll(() => {
      brandData = makeBrand({
        description: 'This is a test brand',
        country: 'Bangladesh',
        website: 'https://brand.test',
      });
    });

    afterAll(async () => {
      if (createdBrandId) {
        await request(app).delete(`${endpoint}/${createdBrandId}`).expect(200);
      }
    });

    it('should create a new brand', async () => {
      const response = await request(app)
        .post(endpoint)
        .send(brandData)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe(brandData.name);
      expect(response.body.data.code).toBe(brandData.code);
      expect(response.body.data.productsCount).toBe(0);

      createdBrandId = response.body.data.id;
    });

    it('should not create a brand with duplicate name', async () => {
      const response = await request(app)
        .post(endpoint)
        .send(makeBrand({ name: brandData.name }))
        .expect('Content-Type', /json/)
        .expect(409);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });

    it('should not create a brand with duplicate code', async () => {
      const response = await request(app)
        .post(endpoint)
        .send(makeBrand({ code: brandData.code }))
        .expect('Content-Type', /json/)
        .expect(409);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });

    it('should create with minimum required fields', async () => {
      const minimalBrand = makeBrand({ code: undefined });

      const response = await request(app)
        .post(endpoint)
        .send(minimalBrand)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data.name).toBe(minimalBrand.name);
      expect(response.body.data.code).toBeNull();

      await request(app).delete(`${endpoint}/${response.body.data.id}`).expect(200);
    });

    it('should fail to create brand without required fields', async () => {
      const response = await request(app)
        .post(endpoint)
        .send({ description: 'Missing name' })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('get brands', () => {
    const createdBrandIds: string[] = [];

    beforeAll(async () => {
      const brands = [
        makeBrand({ name: `List Brand A ${Date.now()}`, country: 'Bangladesh' }),
        makeBrand({ name: `List Brand B ${Date.now()}`, country: 'India' }),
        makeBrand({ name: `SearchBrand ${Date.now()}`, country: 'Bangladesh' }),
      ];

      for (const brand of brands) {
        const response = await request(app).post(endpoint).send(brand).expect(201);
        createdBrandIds.push(response.body.data.id);
      }
    });

    afterAll(async () => {
      for (const id of createdBrandIds) {
        await request(app).delete(`${endpoint}/${id}`).expect(200);
      }
    });

    it('should get a list of brands', async () => {
      const response = await request(app)
        .get(endpoint)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThanOrEqual(3);
    });

    it('should get brands with pagination', async () => {
      const response = await request(app)
        .get(endpoint)
        .query({ page: 1, pageSize: 2 })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeLessThanOrEqual(2);
    });

    it('should filter brands by search query', async () => {
      const response = await request(app)
        .get(endpoint)
        .query({ search: 'SearchBrand' })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].name).toContain('SearchBrand');
    });

    it('should filter brands by country', async () => {
      const response = await request(app)
        .get(endpoint)
        .query({ country: 'Bangladesh' })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data.every((b: any) => b.country === 'Bangladesh')).toBe(true);
    });

    it('should sort brands by name desc', async () => {
      const response = await request(app)
        .get(endpoint)
        .query({ sortBy: 'name', sortOrder: 'desc' })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      const names = response.body.data.map((b: any) => b.name);
      for (let i = 0; i < names.length - 1; i++) {
        expect(names[i].localeCompare(names[i + 1])).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe('get/update/delete brand', () => {
    let createdBrandId: string;
    let brandData: ReturnType<typeof makeBrand>;

    beforeAll(async () => {
      brandData = makeBrand({ description: 'Brand for get/update/delete' });
      const response = await request(app).post(endpoint).send(brandData).expect(201);
      createdBrandId = response.body.data.id;
    });

    afterAll(async () => {
      if (createdBrandId) {
        await request(app).delete(`${endpoint}/${createdBrandId}`).expect(200);
      }
    });

    it('should get a brand by ID', async () => {
      const response = await request(app)
        .get(`${endpoint}/${createdBrandId}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data.id).toBe(createdBrandId);
      expect(response.body.data.name).toBe(brandData.name);
    });

    it('should return 404 for non-existent brand', async () => {
      const response = await request(app)
        .get(`${endpoint}/00000000-0000-0000-0000-000000000000`)
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });

    it('should update a brand', async () => {
      const response = await request(app)
        .patch(`${endpoint}/${createdBrandId}`)
        .send({
          name: makeBrand().name,
          country: 'Japan',
          website: 'https://updated-brand.test',
        })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data.id).toBe(createdBrandId);
      expect(response.body.data.country).toBe('Japan');
      expect(response.body.data.website).toBe('https://updated-brand.test');
    });

    it('should return 400 for empty update payload', async () => {
      const response = await request(app)
        .patch(`${endpoint}/${createdBrandId}`)
        .send({})
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });

    it('should delete a brand', async () => {
      const deletableBrand = await request(app)
        .post(endpoint)
        .send(makeBrand())
        .expect(201);

      const response = await request(app)
        .delete(`${endpoint}/${deletableBrand.body.data.id}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data.id).toBe(deletableBrand.body.data.id);
    });
  });

  describe('brand-product integration', () => {
    let categoryId: string;
    let brandId: string;
    let productId: string;

    beforeAll(async () => {
      const categoryResponse = await request(app)
        .post(categoryEndpoint)
        .send(makeCategory({ description: 'Category for brand-product integration' }))
        .expect(201);
      categoryId = categoryResponse.body.data.id;

      const brandResponse = await request(app)
        .post(endpoint)
        .send(makeBrand({ name: `Integration Brand ${Date.now()}` }))
        .expect(201);
      brandId = brandResponse.body.data.id;

      const productResponse = await request(app)
        .post(productEndpoint)
        .send(makeProduct(categoryId, { brandId }))
        .expect(201);
      productId = productResponse.body.data.id;
    });

    afterAll(async () => {
      if (productId) {
        await request(app).delete(`${productEndpoint}/${productId}/hard`).catch(() => {});
      }
      if (brandId) {
        await request(app).delete(`${endpoint}/${brandId}`).catch(() => {});
      }
      if (categoryId) {
        await request(app).delete(`${categoryEndpoint}/${categoryId}/hard`).catch(() => {});
      }
    });

    it('should return product with correct brandName', async () => {
      const productResponse = await request(app)
        .get(`${productEndpoint}/${productId}`)
        .expect('Content-Type', /json/)
        .expect(200);

      const brandResponse = await request(app)
        .get(`${endpoint}/${brandId}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(productResponse.body.data.brandId).toBe(brandId);
      expect(productResponse.body.data.brandName).toBe(brandResponse.body.data.name);
    });

    it('should return productsCount correctly for brand', async () => {
      const response = await request(app)
        .get(`${endpoint}/${brandId}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data.productsCount).toBe(1);
    });

    it('should not allow deleting a brand with associated products', async () => {
      const response = await request(app)
        .delete(`${endpoint}/${brandId}`)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('Cannot delete brand');
    });

    it('should allow deleting brand after product is soft deleted', async () => {
      await request(app)
        .delete(`${productEndpoint}/${productId}`)
        .expect(200);

      const response = await request(app)
        .delete(`${endpoint}/${brandId}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data.id).toBe(brandId);

      brandId = '';
    });
  });

  describe('brand-variant integrity', () => {
    let categoryId: string;
    let brandId: string;
    let productId: string;
    let variantId: string;

    beforeAll(async () => {
      const categoryResponse = await request(app)
        .post(categoryEndpoint)
        .send(makeCategory({ description: 'Category for brand-variant integrity' }))
        .expect(201);
      categoryId = categoryResponse.body.data.id;

      const brandResponse = await request(app)
        .post(endpoint)
        .send(makeBrand({ name: `Variant Brand ${Date.now()}` }))
        .expect(201);
      brandId = brandResponse.body.data.id;

      const productResponse = await request(app)
        .post(productEndpoint)
        .send(makeProduct(categoryId, { brandId }))
        .expect(201);
      productId = productResponse.body.data.id;

      const variantResponse = await request(app)
        .post(variantEndpoint)
        .send(makeVariant(productId))
        .expect(201);
      variantId = variantResponse.body.data.id;
    });

    afterAll(async () => {
      if (variantId) {
        await request(app).delete(`${variantEndpoint}/${variantId}/hard`).catch(() => {});
      }
      if (productId) {
        await request(app).delete(`${productEndpoint}/${productId}/hard`).catch(() => {});
      }
      if (brandId) {
        await request(app).delete(`${endpoint}/${brandId}`).catch(() => {});
      }
      if (categoryId) {
        await request(app).delete(`${categoryEndpoint}/${categoryId}/hard`).catch(() => {});
      }
    });

    it('should not allow deleting brand while product with active variant exists', async () => {
      const response = await request(app)
        .delete(`${endpoint}/${brandId}`)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('Cannot delete brand');
    });

    it('should allow deleting brand after variant and product are deleted', async () => {
      await request(app).delete(`${variantEndpoint}/${variantId}`).expect(200);
      await request(app).delete(`${productEndpoint}/${productId}`).expect(200);

      const response = await request(app)
        .delete(`${endpoint}/${brandId}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data.id).toBe(brandId);

      variantId = '';
      productId = '';
      brandId = '';
    });
  });
});
