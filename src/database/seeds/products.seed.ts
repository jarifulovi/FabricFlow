import pool from '../connection.js';
import { productRepo } from '../repositories/product.repo.js';
import { categoryRepo } from '../repositories/category.repo.js';
import type { CreateProductInput } from '../types/product.js';
import type { CategoryRow } from '../types/category.js';

export async function seedProducts(categories?: CategoryRow[]) {
  console.log('🌱 Seeding products...');
  
  try {
    // Fetch categories if not provided
    let categoriesMap: Map<string, string>;
    
    if (categories && categories.length > 0) {
      categoriesMap = new Map(categories.map((cat) => [cat.name, cat.id]));
    } else {
      const fetchedCategories = await categoryRepo.findAll({}, pool);
      if (fetchedCategories.length === 0) {
        throw new Error('No categories found. Please seed categories first.');
      }
      categoriesMap = new Map(fetchedCategories.map((cat) => [cat.name, cat.id]));
    }

    const productsData: CreateProductInput[] = [
      // Men's Wear
      {
        sku: 'MEN-TSH-001',
        name: 'Classic Cotton T-Shirt',
        description: 'Premium cotton t-shirt for everyday wear',
        categoryId: categoriesMap.get("Men's Wear")!,
        status: 'active',
        unit: 'piece',
        tags: ['casual', 'cotton', 'basic'],
      },
      {
        sku: 'MEN-SHT-001',
        name: 'Formal Dress Shirt',
        description: 'Elegant dress shirt for office and formal events',
        categoryId: categoriesMap.get("Men's Wear")!,
        status: 'active',
        unit: 'piece',
        tags: ['formal', 'office'],
      },
      {
        sku: 'MEN-PNT-001',
        name: 'Chino Pants',
        description: 'Comfortable chino pants for casual and semi-formal wear',
        categoryId: categoriesMap.get("Men's Wear")!,
        status: 'active',
        unit: 'piece',
        tags: ['casual', 'chino'],
      },
      
      // Women's Wear
      {
        sku: 'WMN-DRS-001',
        name: 'Summer Floral Dress',
        description: 'Light and breezy floral dress perfect for summer',
        categoryId: categoriesMap.get("Women's Wear")!,
        status: 'active',
        unit: 'piece',
        tags: ['dress', 'summer', 'floral'],
      },
      {
        sku: 'WMN-BLS-001',
        name: 'Silk Blouse',
        description: 'Elegant silk blouse for professional settings',
        categoryId: categoriesMap.get("Women's Wear")!,
        status: 'active',
        unit: 'piece',
        tags: ['formal', 'silk', 'blouse'],
      },
      {
        sku: 'WMN-SKT-001',
        name: 'Pleated Midi Skirt',
        description: 'Versatile pleated skirt for office and casual wear',
        categoryId: categoriesMap.get("Women's Wear")!,
        status: 'active',
        unit: 'piece',
        tags: ['skirt', 'pleated', 'versatile'],
      },
      
      // Kids' Wear
      {
        sku: 'KID-TSH-001',
        name: 'Cartoon Print T-Shirt',
        description: 'Fun and colorful t-shirt with cartoon prints for kids',
        categoryId: categoriesMap.get("Kids' Wear")!,
        status: 'active',
        unit: 'piece',
        tags: ['kids', 'casual', 'cartoon'],
      },
      {
        sku: 'KID-SHR-001',
        name: 'Denim Shorts',
        description: 'Comfortable denim shorts for active kids',
        categoryId: categoriesMap.get("Kids' Wear")!,
        status: 'active',
        unit: 'piece',
        tags: ['kids', 'denim', 'shorts'],
      },
      
      // Denim
      {
        sku: 'DNM-JEA-001',
        name: 'Slim Fit Jeans',
        description: 'Modern slim fit jeans for a sleek look',
        categoryId: categoriesMap.get('Denim')!,
        status: 'active',
        unit: 'piece',
        tags: ['jeans', 'slim-fit', 'denim'],
      },
      {
        sku: 'DNM-JKT-001',
        name: 'Classic Denim Jacket',
        description: 'Timeless denim jacket for all seasons',
        categoryId: categoriesMap.get('Denim')!,
        status: 'active',
        unit: 'piece',
        tags: ['jacket', 'denim', 'classic'],
      },
      
      // Activewear
      {
        sku: 'ACT-LEG-001',
        name: 'High-Performance Leggings',
        description: 'Moisture-wicking leggings for intense workouts',
        categoryId: categoriesMap.get('Activewear')!,
        status: 'active',
        unit: 'piece',
        tags: ['activewear', 'leggings', 'workout'],
      },
      {
        sku: 'ACT-TOP-001',
        name: 'Sports Tank Top',
        description: 'Breathable tank top for gym and outdoor activities',
        categoryId: categoriesMap.get('Activewear')!,
        status: 'active',
        unit: 'piece',
        tags: ['activewear', 'tank', 'sports'],
      },
      
      // Formal Wear
      {
        sku: 'FRM-SUT-001',
        name: 'Two-Piece Business Suit',
        description: 'Professional two-piece suit for business meetings',
        categoryId: categoriesMap.get('Formal Wear')!,
        status: 'active',
        unit: 'piece',
        tags: ['suit', 'formal', 'business'],
      },
      {
        sku: 'FRM-EVN-001',
        name: 'Evening Gown',
        description: 'Luxurious evening gown for special occasions',
        categoryId: categoriesMap.get('Formal Wear')!,
        status: 'active',
        unit: 'piece',
        tags: ['gown', 'formal', 'evening'],
      },
      
      // Accessories
      {
        sku: 'ACC-BLT-001',
        name: 'Leather Belt',
        description: 'Genuine leather belt with classic buckle',
        categoryId: categoriesMap.get('Accessories')!,
        status: 'active',
        unit: 'piece',
        tags: ['belt', 'leather', 'accessory'],
      },
      {
        sku: 'ACC-BAG-001',
        name: 'Canvas Tote Bag',
        description: 'Eco-friendly canvas tote for everyday use',
        categoryId: categoriesMap.get('Accessories')!,
        status: 'active',
        unit: 'piece',
        tags: ['bag', 'canvas', 'eco'],
      },
      
      // Fabrics
      {
        sku: 'FAB-CTN-001',
        name: 'Premium Cotton Fabric',
        description: '100% cotton fabric roll for garment production',
        categoryId: categoriesMap.get('Fabrics')!,
        status: 'active',
        unit: 'roll',
        tags: ['fabric', 'cotton', 'raw-material'],
      },
      {
        sku: 'FAB-SLK-001',
        name: 'Silk Fabric Roll',
        description: 'Luxurious silk fabric for premium garments',
        categoryId: categoriesMap.get('Fabrics')!,
        status: 'active',
        unit: 'meter',
        tags: ['fabric', 'silk', 'premium'],
      },
      
      // Knitwear
      {
        sku: 'KNT-SWE-001',
        name: 'Wool Sweater',
        description: 'Warm and cozy wool sweater for winter',
        categoryId: categoriesMap.get('Knitwear')!,
        status: 'active',
        unit: 'piece',
        tags: ['sweater', 'wool', 'winter'],
      },
      {
        sku: 'KNT-CDG-001',
        name: 'Cardigan',
        description: 'Comfortable knitted cardigan for layering',
        categoryId: categoriesMap.get('Knitwear')!,
        status: 'active',
        unit: 'piece',
        tags: ['cardigan', 'knit', 'layering'],
      },
      
      // Outerwear
      {
        sku: 'OUT-JKT-001',
        name: 'Waterproof Rain Jacket',
        description: 'Durable waterproof jacket for rainy weather',
        categoryId: categoriesMap.get('Outerwear')!,
        status: 'active',
        unit: 'piece',
        tags: ['jacket', 'waterproof', 'rain'],
      },
      {
        sku: 'OUT-COT-001',
        name: 'Winter Coat',
        description: 'Insulated winter coat for extreme cold',
        categoryId: categoriesMap.get('Outerwear')!,
        status: 'active',
        unit: 'piece',
        tags: ['coat', 'winter', 'insulated'],
      },
    ];

    const createdProducts = await Promise.all(
      productsData.map((product) => productRepo.create(product, pool))
    );

    console.log(`✅ Created ${createdProducts.length} products`);
    return createdProducts;
  } catch (error) {
    console.error('❌ Failed to seed products:', error);
    throw error;
  }
}

// Run directly if executed as a standalone script
if (import.meta.url === `file://${process.argv[1]}`) {
  seedProducts()
    .then(() => {
      console.log('✅ Product seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Product seeding failed:', error);
      process.exit(1);
    });
}
