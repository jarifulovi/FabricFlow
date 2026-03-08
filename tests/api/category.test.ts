import request from 'supertest';
import app from '../../src/app';
import pool from '../../src/database/connection';
import { makeCategory, makeProduct } from '../helpers/generators';

describe('Category API', () => {

  const endpoint = '/api/categories';
  const productEndpoint = '/api/products';

  beforeAll(async () => {
    // Add any setup logic if necessary (e.g., seeding test data)
  });

  afterAll(async () => {
    // Add cleanup logic if necessary
    await pool.end();
  });

  describe('create category', () => {
    let createdCategoryId: string;
    const categoryData = makeCategory({ description: 'This is a test category' });

    it('should create a new category', async () => {
      const response = await request(app)
        .post(endpoint)
        .send(categoryData)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe(categoryData.name);
      expect(response.body.data.description).toBe(categoryData.description);

      // Save ID for cleanup and further tests
      createdCategoryId = response.body.data.id;
      expect(createdCategoryId).toBeDefined();
    });

    it('should create a new category with same name but different type', async () => {
      const response = await request(app)
        .post(endpoint)
        .send(makeCategory({ name: categoryData.name, type: 'raw_material', description: 'Same name but different type' }))
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message');
    });

    it('should not create a category with duplicate name', async () => {
      const response = await request(app)
        .post(endpoint)
        .send(makeCategory({ name: categoryData.name, description: 'Duplicate category test' }))
        .expect('Content-Type', /json/)
        .expect(409);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });

    it('should not create a category with duplicate name but different case', async () => {
      const response = await request(app)
        .post(endpoint)
        .send(makeCategory({ name: categoryData.name.toUpperCase(), description: 'Duplicate category case sensitivity test' }))
        .expect('Content-Type', /json/)
        .expect(409);
        
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });

    it('should create with minimum required fields', async () => {
      const minimalCategory = makeCategory();

      const response = await request(app)
        .post(endpoint)
        .send(minimalCategory)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe(minimalCategory.name);
      expect(response.body.data.description).toBeNull();
    });

    it('should fail to create a category without a name', async () => {
      const invalidCategory = {
        description: 'No name provided',
      };

      const response = await request(app)
        .post(endpoint)
        .send(invalidCategory)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });

    it('should allow creation of category with same name after soft delete', async () => {
      // First, soft delete the original category
      await request(app)
        .delete(`${endpoint}/${createdCategoryId}`)
        .expect('Content-Type', /json/)
        .expect(200);

      // Now, try to create a new category with the same name
      const response = await request(app)
        .post(endpoint)
        .send(makeCategory({ name: categoryData.name, description: 'Recreating category after soft delete' }))
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe(categoryData.name);
    });
  });

  describe('get category', () => {

    let createdCategoryId: string;
    let createdCategoryName: string;

    beforeAll(async () => {
      // Seed a category to test retrieval
      const categoryData = makeCategory({ description: 'Category for testing retrieval by ID' });
      createdCategoryName = categoryData.name;
      const response = await request(app)
        .post(endpoint)
        .send(categoryData)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id');
      // Save the created category ID for retrieval test
      createdCategoryId = response.body.data.id;
    });

    afterAll(async () => {
      // Clean up by hard deleting the created category
      await request(app)
        .delete(`${endpoint}/${createdCategoryId}/hard`)
        .expect(200);
    });

    it('should get a category by ID', async () => {
      const response = await request(app)
        .get(`${endpoint}/${createdCategoryId}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.id).toBe(createdCategoryId);
      expect(response.body.data.name).toBe(createdCategoryName);
    });

    it('should return 404 for non-existent category', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      const response = await request(app)
        .get(`${endpoint}/${nonExistentId}`)
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 for invalid category ID format', async () => {
      const invalidId = 'invalid-id';
      const response = await request(app)
        .get(`${endpoint}/${invalidId}`)
        .expect('Content-Type', /json/)
        .expect(400); // check correct status code for invalid ID format

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('get categories', () => {
    
    beforeAll(async () => {
      // Seed multiple categories for testing list retrieval and filters
      const categoriesToSeed = [
        makeCategory({ name: `List Test Category 1 ${Date.now()}`, description: 'First category for list retrieval test' }),
        makeCategory({ name: `List Test Category 2 ${Date.now()}`, description: 'Second category for list retrieval test' }),
        makeCategory({ name: `Another Category ${Date.now()}`, description: 'Category to test search filter' }),
      ];

      for (const category of categoriesToSeed) {
        await request(app)
          .post(endpoint)
          .send(category)
          .expect(201);
      }
    });

    afterAll(async () => {
      // Clean up by hard deleting all categories created for this test
      const response = await request(app)
        .get(endpoint)
        .query({ name: `List Test Category` })
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);

      for (const category of response.body.data) {
        await request(app)
          .delete(`${endpoint}/${category.id}/hard`)
          .expect(200);
      }

      // Also delete the "Another Category"
      const anotherResponse = await request(app)
        .get(endpoint)
        .query({ name: `Another Category` })
        .expect(200);

      if (anotherResponse.body.data.length > 0) {
        await request(app)
          .delete(`${endpoint}/${anotherResponse.body.data[0].id}/hard`)
          .expect(200);
      }
    });

    it('should get a list of categories (default)', async () => {
      const response = await request(app)
        .get(`${endpoint}/default`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThanOrEqual(3);
    });

    it('should get a list of categories with pagination', async () => {
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

    it('should filter categories by search query', async () => {
      const searchQuery = 'Another Category';
      const response = await request(app)
        .get(endpoint)
        .query({ name: searchQuery })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].name).toContain('Another');
    });

    it('should return empty array if no categories match search query', async () => {
      const searchQuery = 'NonExistentCategoryName';
      const response = await request(app)
        .get(endpoint)
        .query({ name: searchQuery })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(0);
    });

    it('should filter categories by sorting', async () => {
      const response = await request(app)
        .get(endpoint)
        .query({ sortBy: 'name', sortOrder: 'desc' })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      // Check if the first category is the one that should come last alphabetically
      const names = response.body.data.map((cat: any) => cat.name);
      for (let i = 0; i < names.length - 1; i++) {
        expect(names[i].localeCompare(names[i + 1])).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe('update category', () => {
    
    let createdCategoryId: string;
    const originalData = makeCategory({ description: 'Category for testing update' });
    const { name: updatedCategoryName } = makeCategory();

    beforeAll(async () => {
      // Seed a category to test update
      const response = await request(app)
        .post(endpoint)
        .send(originalData)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id');
      // Save the created category ID for update test
      createdCategoryId = response.body.data.id;
    });

    afterAll(async () => {
      // Clean up by hard deleting the created category
      await request(app)
        .delete(`${endpoint}/${createdCategoryId}/hard`)
        .expect(200);
    });

    it('should update a category', async () => {
      const updatedData = {
        name: updatedCategoryName,
        description: 'Updated description',
      };

      const response = await request(app)
        .patch(`${endpoint}/${createdCategoryId}`)
        .send(updatedData)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.id).toBe(createdCategoryId);
      expect(response.body.data.name).toBe(updatedData.name);
      expect(response.body.data.description).toBe(updatedData.description);
    });

    it('should allow partial updates', async () => {
      const partialUpdateData = {
        description: 'Partially updated description',
      };

      const response = await request(app)
        .patch(`${endpoint}/${createdCategoryId}`)
        .send(partialUpdateData)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.id).toBe(createdCategoryId);
      expect(response.body.data.name).toBe(updatedCategoryName); // Name should remain unchanged
      expect(response.body.data.description).toBe(partialUpdateData.description); // Description should be updated
    });

    it('should return 404 for updating non-existent category', async () => {
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
        .patch(`${endpoint}/${createdCategoryId}`)
        .send(invalidUpdateData)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });

    it('should not allow updating to a duplicate category name', async () => {
      // First, create another category
      const conflictingData = makeCategory();
      const conflictResponse = await request(app)
        .post(endpoint)
        .send(conflictingData)
        .expect(201);

      expect(conflictResponse.body).toHaveProperty('success', true);
      const conflictingCategoryId = conflictResponse.body.data.id;

      // Now, try to update the newly created category to have the same name as updated one
      const response = await request(app)
        .patch(`${endpoint}/${conflictingCategoryId}`)
        .send({ name: updatedCategoryName })
        .expect('Content-Type', /json/)
        .expect(409);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');

      // Clean up the conflicting category
      await request(app)
        .delete(`${endpoint}/${conflictingCategoryId}/hard`)
        .expect(200);
    });
  });

  describe('delete category', () => {
    
    let createdCategoryId: string;
    const categoryData = makeCategory({ description: 'Category for testing deletion' });
    const categoryName = categoryData.name;

    beforeAll(async () => {
      // Seed a category to test deletion
      const response = await request(app)
        .post(endpoint)
        .send(categoryData)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id');
      // Save the created category ID for deletion test
      createdCategoryId = response.body.data.id;
    });

    afterAll(async () => {
      // Clean up by hard deleting the created category (in case it wasn't deleted in the test)
      await request(app)
        .delete(`${endpoint}/${createdCategoryId}/hard`)
        .expect(200);
    });

    it('should soft delete a category', async () => {
      const response = await request(app)
        .delete(`${endpoint}/${createdCategoryId}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.id).toBe(createdCategoryId);
      expect(response.body.data.deletedAt).not.toBeNull();
    });

    it('should not find soft deleted category by ID', async () => {
      const response = await request(app)
        .get(`${endpoint}/${createdCategoryId}`)
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });

    it('should not find soft deleted category in list', async () => {
      const response = await request(app)
        .get(endpoint)
        .query({ name: categoryName })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(0);
    });

    it('should find soft deleted category when includeDeleted=true', async () => {
      const response = await request(app)
        .get(endpoint)
        .query({ name: categoryName, includeDeleted: true })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].id).toBe(createdCategoryId);
    });

    it('should return 404 when trying to soft delete a non-existent category', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      const response = await request(app)
        .delete(`${endpoint}/${nonExistentId}`)
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('category-product integrity', () => {
    let categoryForIntegrityTest: string;
    let productForIntegrityTest: string;

    beforeAll(async () => {
      // Create a category specifically for integrity testing
      const categoryResponse = await request(app)
        .post(endpoint)
        .send(makeCategory({ description: 'Category for testing referential integrity' }))
        .expect(201);
      
      categoryForIntegrityTest = categoryResponse.body.data.id;

      // Create a product linked to this category
      const productResponse = await request(app)
        .post(productEndpoint)
        .send(makeProduct(categoryForIntegrityTest))
        .expect(201);

      productForIntegrityTest = productResponse.body.data.id;
    });

    afterAll(async () => {
      // Clean up
      if (productForIntegrityTest) {
        await request(app)
          .delete(`${productEndpoint}/${productForIntegrityTest}/hard`)
          .expect(200);
      }
      if (categoryForIntegrityTest) {
        await request(app)
          .delete(`${endpoint}/${categoryForIntegrityTest}/hard`)
          .expect(200);
      }
    });

    it('should not allow deleting category with active products', async () => {
      const response = await request(app)
        .delete(`${endpoint}/${categoryForIntegrityTest}`)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Cannot delete category');
    });

    it('should allow deleting category after soft deleting its products', async () => {
      // First, soft delete the product
      await request(app)
        .delete(`${productEndpoint}/${productForIntegrityTest}`)
        .expect(200);

      // Now, should be able to delete the category
      const response = await request(app)
        .delete(`${endpoint}/${categoryForIntegrityTest}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data.id).toBe(categoryForIntegrityTest);
    });
  });
});
