import request from 'supertest';
import app from '../../src/app.js';
import pool from '../../src/database/connection.js';

describe('Category API', () => {

  const endpoint = '/api/categories';

  beforeAll(async () => {
    // Add any setup logic if necessary (e.g., seeding test data)
  });

  afterAll(async () => {
    // Add cleanup logic if necessary
    await pool.end();
  });

  describe('create category', () => {
    let createdCategoryId: string;
    const timestamp = Date.now();
    const testCategoryName = `Test Category ${timestamp}`;

    it('should create a new category', async () => {
      const newCategory = {
        name: testCategoryName,
        description: 'This is a test category',
      };

      const response = await request(app)
        .post(endpoint)
        .send(newCategory)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe(newCategory.name);
      expect(response.body.data.description).toBe(newCategory.description);

      // Save ID for cleanup and further tests
      createdCategoryId = response.body.data.id;
      expect(createdCategoryId).toBeDefined();
    });

    it('should not create a category with duplicate name', async () => {
      const duplicateCategory = {
        name: testCategoryName,
        description: 'Duplicate category test',
      };

      const response = await request(app)
        .post(endpoint)
        .send(duplicateCategory)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });

    it('should not create a category with duplicate name but different case', async () => {
      const duplicateCategory = {
        name: testCategoryName.toUpperCase(),
        description: 'Duplicate category case sensitivity test',
      };

      const response = await request(app)
        .post(endpoint)
        .send(duplicateCategory)
        .expect('Content-Type', /json/)
        .expect(400);
        
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });

    it('should create with minimum required fields', async () => {
      const minimalCategory = {
        name: `Minimal Category ${timestamp}`,
      };

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
        .send({
          name: testCategoryName,
          description: 'Recreating category after soft delete',
        })
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe(testCategoryName);
    });
  });

  describe('get category', () => {

    let createdCategoryId: string;
    let createdCategoryName: string;

    beforeAll(async () => {
      // Seed a category to test retrieval
      createdCategoryName = `Retrieval Test Category ${Date.now()}`;
      const newCategory = {
        name: createdCategoryName,
        description: 'Category for testing retrieval by ID',
      };
      const response = await request(app)
        .post(endpoint)
        .send(newCategory)
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
        { name: `List Test Category 1 ${Date.now()}`, description: 'First category for list retrieval test' },
        { name: `List Test Category 2 ${Date.now()}`, description: 'Second category for list retrieval test' },
        { name: `Another Category ${Date.now()}`, description: 'Category to test search filter' },
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
    const timestamp = Date.now();
    const originalCategoryName = `Update Test Category ${timestamp}`;
    const updatedCategoryName = `Updated Category Name ${timestamp}`;

    beforeAll(async () => {
      // Seed a category to test update
      const newCategory = {
        name: originalCategoryName,
        description: 'Category for testing update',
      };
      const response = await request(app)
        .post(endpoint)
        .send(newCategory)
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
      const conflictingCategoryName = `Conflicting Category ${Date.now()}`;
      const conflictResponse = await request(app)
        .post(endpoint)
        .send({ name: conflictingCategoryName })
        .expect(201);

      expect(conflictResponse.body).toHaveProperty('success', true);
      const conflictingCategoryId = conflictResponse.body.data.id;

      // Now, try to update the newly created category to have the same name as updated one
      const response = await request(app)
        .patch(`${endpoint}/${conflictingCategoryId}`)
        .send({ name: updatedCategoryName })
        .expect('Content-Type', /json/)
        .expect(400);

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
    const timestamp = Date.now();
    const categoryName = `Delete Test Category ${timestamp}`;

    beforeAll(async () => {
      // Seed a category to test deletion
      const newCategory = {
        name: categoryName,
        description: 'Category for testing deletion',
      };
      const response = await request(app)
        .post(endpoint)
        .send(newCategory)
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
});
