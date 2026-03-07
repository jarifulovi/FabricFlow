import request from 'supertest';
import app from '../../src/app';
import pool from '../../src/database/connection';
import { makeCategory, makeProduct, makeVariant } from '../helpers/generators';


describe('Product API', () => {

  const endpoint = '/api/products';
  const categoryEndpoint = '/api/categories';
  const variantEndpoint = '/api/variants';
  let testCategoryId: string;

  beforeAll(async () => {
    // Create a test category for product tests
    const categoryResponse = await request(app)
      .post(categoryEndpoint)
      .send(makeCategory({ description: 'Category for product testing' }))
      .expect(201);
    
    testCategoryId = categoryResponse.body.data.id;
  });

  afterAll(async () => {
    // Clean up test category - first delete all remaining products in that category
    if (testCategoryId) {
      try {
        // Get all products in the test category (including soft deleted)
        const productsResponse = await request(app)
          .get(endpoint)
          .query({ categoryId: testCategoryId, includeDeleted: 'true' });
        
        // Hard delete all products
        if (productsResponse.body.data && Array.isArray(productsResponse.body.data)) {
          for (const product of productsResponse.body.data) {
            await request(app)
              .delete(`${endpoint}/${product.id}/hard`)
              .catch(() => {}); // Ignore errors
          }
        }

        // Now delete the category
        await request(app)
          .delete(`${categoryEndpoint}/${testCategoryId}/hard`);
      } catch (error) {
        // Ignore cleanup errors
        console.log('Cleanup warning:', error);
      }
    }
    await pool.end();
  });

  describe('create product', () => {
    let createdProductId: string;
    let productData: ReturnType<typeof makeProduct>;
    let testProductSku: string;

    beforeAll(() => {
      productData = makeProduct(testCategoryId, {
        description: 'This is a test product',
        brandName: 'Test Brand',
        brandCode: 'TB001',
        tags: ['test', 'sample']
      });
      testProductSku = productData.sku;
    });

    it('should create a new product', async () => {
      const response = await request(app)
        .post(endpoint)
        .send(productData)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.sku).toBe(productData.sku);
      expect(response.body.data.name).toBe(productData.name);
      expect(response.body.data.description).toBe(productData.description);
      expect(response.body.data.category_id).toBe(testCategoryId);

      // Save ID for cleanup and further tests
      createdProductId = response.body.data.id;
      expect(createdProductId).toBeDefined();
    });

    it('should not create a product with duplicate SKU', async () => {
      const response = await request(app)
        .post(endpoint)
        .send(makeProduct(testCategoryId, { sku: testProductSku, name: 'Another Product', unit: 'meter' }))
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });

    it('should create with minimum required fields', async () => {
      const minimalProduct = makeProduct(testCategoryId);

      const response = await request(app)
        .post(endpoint)
        .send(minimalProduct)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.sku).toBe(minimalProduct.sku);
      expect(response.body.data.description).toBeNull();
      expect(response.body.data.brand_name).toBeNull();
    });

    it('should fail to create a product without required fields', async () => {
      const response = await request(app)
        .post(endpoint)
        .send({ description: 'Missing required fields' })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });

    it('should fail to create a product with non-existent category', async () => {
      const response = await request(app)
        .post(endpoint)
        .send(makeProduct('00000000-0000-0000-0000-000000000000'))
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });

    it('should allow creation of product with same SKU after soft delete', async () => {
      // First, soft delete the original product
      await request(app)
        .delete(`${endpoint}/${createdProductId}`)
        .expect('Content-Type', /json/)
        .expect(200);

      // Now, try to create a new product with the same SKU
      const response = await request(app)
        .post(endpoint)
        .send(makeProduct(testCategoryId, { sku: testProductSku, name: 'Recreated Product' }))
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.sku).toBe(testProductSku);
      
      // Update createdProductId for cleanup
      createdProductId = response.body.data.id;
    });

    afterAll(async () => {
      // Clean up created product
      if (createdProductId) {
        await request(app)
          .delete(`${endpoint}/${createdProductId}/hard`)
          .expect(200);
      }
    });
  });

  describe('get product', () => {

    let createdProductId: string;
    let createdProductSku: string;
    let createdProductName: string;

    beforeAll(async () => {
      // Seed a product to test retrieval
      const productData = makeProduct(testCategoryId, {
        description: 'Product for testing retrieval by ID',
        unit: 'meter'
      });
      createdProductSku = productData.sku;
      createdProductName = productData.name;
      const response = await request(app)
        .post(endpoint)
        .send(productData)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id');
      // Save the created product ID for retrieval test
      createdProductId = response.body.data.id;
    });

    afterAll(async () => {
      // Clean up by hard deleting the created product
      if (createdProductId) {
        await request(app)
          .delete(`${endpoint}/${createdProductId}/hard`)
          .expect(200);
      }
    });

    it('should get a product by ID', async () => {
      const response = await request(app)
        .get(`${endpoint}/${createdProductId}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.id).toBe(createdProductId);
      expect(response.body.data.name).toBe(createdProductName);
      expect(response.body.data.sku).toBe(createdProductSku);
    });

    it('should get a product by SKU', async () => {
      const response = await request(app)
        .get(`${endpoint}/sku/${createdProductSku}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.id).toBe(createdProductId);
      expect(response.body.data.sku).toBe(createdProductSku);
    });

    it('should return 404 for non-existent product', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      const response = await request(app)
        .get(`${endpoint}/${nonExistentId}`)
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 for invalid product ID format', async () => {
      const invalidId = 'invalid-id';
      const response = await request(app)
        .get(`${endpoint}/${invalidId}`)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('get products', () => {
    
    let productIds: string[] = [];

    beforeAll(async () => {
      // Seed multiple products for testing list retrieval and filters
      const productsToSeed = [
        makeProduct(testCategoryId, { status: 'active',   unit: 'piece', tags: ['list-test'] }),
        makeProduct(testCategoryId, { status: 'inactive', unit: 'meter', tags: ['list-test'] }),
        makeProduct(testCategoryId, { name: `SearchableProduct ${Date.now()}`, status: 'active', unit: 'piece', tags: ['searchable'] }),
      ];

      for (const product of productsToSeed) {
        const response = await request(app)
          .post(endpoint)
          .send(product)
          .expect(201);
        productIds.push(response.body.data.id);
      }
    });

    afterAll(async () => {
      // Clean up by hard deleting all products created for this test
      for (const id of productIds) {
        await request(app)
          .delete(`${endpoint}/${id}/hard`)
          .expect(200);
      }
    });

    it('should get a list of products (default)', async () => {
      const response = await request(app)
        .get(`${endpoint}/default`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThanOrEqual(2); // At least 2 active products
    });

    it('should get a list of products with pagination', async () => {
      const response = await request(app)
        .get(`${endpoint}/default`)
        .query({ pageSize: 2, page: 1 })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeLessThanOrEqual(2);
    });

    it('should filter products by search query', async () => {
      const response = await request(app)
        .get(endpoint)
        .query({ search: 'SearchableProduct' })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].name).toContain('SearchableProduct');
    });

    it('should filter products by status', async () => {
      const response = await request(app)
        .get(endpoint)
        .query({ status: 'inactive' })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data.every((p: any) => p.status === 'inactive')).toBe(true);
    });

    it('should filter products by categoryId', async () => {
      const response = await request(app)
        .get(endpoint)
        .query({ categoryId: testCategoryId })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data.every((p: any) => p.category_id === testCategoryId)).toBe(true);
    });

    it('should return empty array if no products match search query', async () => {
      const searchQuery = 'NonExistentProductName999';
      const response = await request(app)
        .get(endpoint)
        .query({ search: searchQuery })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(0);
    });

    it('should filter products by sorting', async () => {
      const response = await request(app)
        .get(endpoint)
        .query({ sortBy: 'name', sortOrder: 'desc' })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      // Check if sorted in descending order
      const names = response.body.data.map((p: any) => p.name);
      for (let i = 0; i < names.length - 1; i++) {
        expect(names[i].localeCompare(names[i + 1])).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe('update product', () => {
    
    let createdProductId: string;
    let originalData: ReturnType<typeof makeProduct>;
    let originalProductSku: string;
    let updatedProductName: string;

    beforeAll(async () => {
      originalData = makeProduct(testCategoryId, { description: 'Product for testing update' });
      originalProductSku = originalData.sku;
      updatedProductName = makeProduct(testCategoryId).name;

      // Seed a product to test update
      const response = await request(app)
        .post(endpoint)
        .send(originalData)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id');
      // Save the created product ID for update test
      createdProductId = response.body.data.id;
    });

    afterAll(async () => {
      // Clean up by hard deleting the created product
      if (createdProductId) {
        await request(app)
          .delete(`${endpoint}/${createdProductId}/hard`)
          .expect(200);
      }
    });

    it('should update a product', async () => {
      const updatedData = {
        name: updatedProductName,
        description: 'Updated description',
        status: 'inactive'
      };

      const response = await request(app)
        .patch(`${endpoint}/${createdProductId}`)
        .send(updatedData)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.id).toBe(createdProductId);
      expect(response.body.data.name).toBe(updatedData.name);
      expect(response.body.data.description).toBe(updatedData.description);
      expect(response.body.data.status).toBe(updatedData.status);
    });

    it('should allow partial updates', async () => {
      const partialUpdateData = {
        description: 'Partially updated description',
      };

      const response = await request(app)
        .patch(`${endpoint}/${createdProductId}`)
        .send(partialUpdateData)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.id).toBe(createdProductId);
      expect(response.body.data.name).toBe(updatedProductName); // Name should remain unchanged
      expect(response.body.data.description).toBe(partialUpdateData.description);
    });

    it('should return 404 for updating non-existent product', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      const response = await request(app)
        .patch(`${endpoint}/${nonExistentId}`)
        .send({ name: 'Should Not Update' })
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 for invalid update data', async () => {
      const invalidUpdateData = {
        name: '', // Name should not be empty
      };

      const response = await request(app)
        .patch(`${endpoint}/${createdProductId}`)
        .send(invalidUpdateData)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });

    it('should not allow updating to a duplicate product SKU', async () => {
      // First, create another product
      const conflictData = makeProduct(testCategoryId);
      const conflictResponse = await request(app)
        .post(endpoint)
        .send(conflictData)
        .expect(201);

      expect(conflictResponse.body).toHaveProperty('success', true);
      const conflictingProductId = conflictResponse.body.data.id;

      // Now, try to update the newly created product to have the same SKU as the original
      const response = await request(app)
        .patch(`${endpoint}/${conflictingProductId}`)
        .send({ sku: originalProductSku })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');

      // Clean up the conflicting product
      await request(app)
        .delete(`${endpoint}/${conflictingProductId}/hard`)
        .expect(200);
    });

    it('should fail to update with non-existent category', async () => {
      const response = await request(app)
        .patch(`${endpoint}/${createdProductId}`)
        .send({ categoryId: '00000000-0000-0000-0000-000000000000' })
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('delete product', () => {
    
    let createdProductId: string;
    let productData: ReturnType<typeof makeProduct>;
    let productName: string;

    beforeAll(async () => {
      productData = makeProduct(testCategoryId, { description: 'Product for testing deletion' });
      productName = productData.name;

      // Seed a product to test deletion
      const response = await request(app)
        .post(endpoint)
        .send(productData)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id');
      // Save the created product ID for deletion test
      createdProductId = response.body.data.id;
    });

    afterAll(async () => {
      // Clean up by hard deleting the created product (in case it wasn't deleted in the test)
      if (createdProductId) {
        await request(app)
          .delete(`${endpoint}/${createdProductId}/hard`)
          .expect(200);
      }
    });

    it('should soft delete a product', async () => {
      const response = await request(app)
        .delete(`${endpoint}/${createdProductId}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.id).toBe(createdProductId);
      expect(response.body.data.deleted_at).not.toBeNull();
    });

    it('should not find soft deleted product by ID', async () => {
      const response = await request(app)
        .get(`${endpoint}/${createdProductId}`)
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });

    it('should not find soft deleted product in list', async () => {
      const response = await request(app)
        .get(endpoint)
        .query({ search: productName })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(0);
    });

    it('should find soft deleted product when includeDeleted=true', async () => {
      const response = await request(app)
        .get(endpoint)
        .query({ search: productName, includeDeleted: 'true' })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].id).toBe(createdProductId);
    });

    it('should return 404 when trying to soft delete a non-existent product', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      const response = await request(app)
        .delete(`${endpoint}/${nonExistentId}`)
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });
  });

  // Add variant-product integrity tests
  describe('product-variant integrity', () => {
    let categoryId: string;
    let productForIntegrityTestId: string;
    let variantForIntegrityTestId: string;

    beforeAll(async () => {
      // Create a category for the integrity test
      const categoryResponse = await request(app)
        .post(categoryEndpoint)
        .send(makeCategory({ description: 'Category for product-variant integrity testing' }))
        .expect(201);
      
      categoryId = categoryResponse.body.data.id;

      // Create a product to test variant integrity
      const productResponse = await request(app)
        .post(endpoint)
        .send(makeProduct(categoryId, { description: 'Product for variant integrity test' }))
        .expect(201);
      
      productForIntegrityTestId = productResponse.body.data.id;

      // Create a variant for the integrity test
      const variantResponse = await request(app)
        .post(variantEndpoint)
        .send(makeVariant(productForIntegrityTestId))
        .expect(201);
      
      variantForIntegrityTestId = variantResponse.body.data.id;
    });

    afterAll(async () => {
      // Clean up by hard deleting the created variant, product, and category
      if (variantForIntegrityTestId) {
        await request(app)
          .delete(`${variantEndpoint}/${variantForIntegrityTestId}/hard`)
          .expect(200);
      }
      if (productForIntegrityTestId) {
        await request(app)
          .delete(`${endpoint}/${productForIntegrityTestId}/hard`)
          .expect(200);
      }
      if (categoryId) {
        await request(app)
          .delete(`${categoryEndpoint}/${categoryId}/hard`)
          .expect(200);
      }
    });

    it('should not allow deleting a product that has active variants', async () => {
      const response = await request(app)
        .delete(`${endpoint}/${productForIntegrityTestId}`)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });

    it('should allow deleting a product after its variants are deleted', async () => {
      // First, delete the variant
      await request(app)
        .delete(`${variantEndpoint}/${variantForIntegrityTestId}`)
        .expect(200);

      // Now, try to delete the product again
      const response = await request(app)
        .delete(`${endpoint}/${productForIntegrityTestId}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.id).toBe(productForIntegrityTestId);
    });
  });

});