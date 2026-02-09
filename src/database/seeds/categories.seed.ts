import pool from '../connection.js';
import { categoryRepo } from '../repositories/category.repo.js';
import type { CreateCategoryInput } from '../types/category.js';

const categoriesData: CreateCategoryInput[] = [
  {
    name: "Men's Wear",
    description: "Men's clothing and apparel",
  },
  {
    name: "Women's Wear",
    description: "Women's clothing and apparel",
  },
  {
    name: "Kids' Wear",
    description: "Children's clothing and apparel",
  },
  {
    name: 'Accessories',
    description: 'Fashion accessories like belts, bags, jewelry',
  },
  {
    name: 'Fabrics',
    description: 'Raw materials and textiles for garment production',
  },
  {
    name: 'Footwear',
    description: 'Shoes, sandals, boots and other footwear',
  },
  {
    name: 'Undergarments',
    description: 'Innerwear, lingerie, and undergarments',
  },
  {
    name: 'Activewear',
    description: 'Sportswear and athletic clothing',
  },
  {
    name: 'Formal Wear',
    description: 'Suits, dresses, and formal occasion clothing',
  },
  {
    name: 'Casual Wear',
    description: 'Everyday casual clothing and loungewear',
  },
  {
    name: 'Outerwear',
    description: 'Jackets, coats, and outer garments',
  },
  {
    name: 'Traditional Wear',
    description: 'Ethnic and traditional clothing',
  },
  {
    name: 'Denim',
    description: 'Jeans and denim-based clothing',
  },
  {
    name: 'Knitwear',
    description: 'Sweaters, cardigans, and knitted garments',
  },
  {
    name: 'Sleepwear',
    description: 'Pajamas, nightwear, and loungewear',
  },
];

export async function seedCategories() {
  console.log('🌱 Seeding categories...');
  
  try {
    const createdCategories = await Promise.all(
      categoriesData.map((category) => categoryRepo.create(category, pool))
    );

    console.log(`✅ Created ${createdCategories.length} categories`);
    return createdCategories;
  } catch (error) {
    console.error('❌ Failed to seed categories:', error);
    throw error;
  }
}

// Run directly if executed as a standalone script
if (import.meta.url === `file://${process.argv[1]}`) {
  seedCategories()
    .then(() => {
      console.log('✅ Category seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Category seeding failed:', error);
      process.exit(1);
    });
}
