import pool from '../connection.js';
import { categoryRepo } from '../repositories/category.repo.js';
import type { CreateCategoryInput } from '../types/category.js';

const categoriesData: CreateCategoryInput[] = [
  { type: 'product', name: "Men's Wear", description: "Men's clothing and apparel" },
  { type: 'product', name: "Women's Wear", description: "Women's clothing and apparel" },
  { type: 'product', name: "Kids' Wear", description: "Children's clothing and apparel" },
  { type: 'product', name: 'Accessories', description: 'Fashion accessories like belts, bags, jewelry' },
  { type: 'product', name: 'Footwear', description: 'Shoes, sandals, boots and other footwear' },
  { type: 'product', name: 'Undergarments', description: 'Innerwear, lingerie, and undergarments' },
  { type: 'product', name: 'Activewear', description: 'Sportswear and athletic clothing' },
  { type: 'product', name: 'Formal Wear', description: 'Suits, dresses, and formal occasion clothing' },
  { type: 'product', name: 'Casual Wear', description: 'Everyday casual clothing and loungewear' },
  { type: 'product', name: 'Outerwear', description: 'Jackets, coats, and outer garments' },
  { type: 'product', name: 'Traditional Wear', description: 'Ethnic and traditional clothing' },
  { type: 'product', name: 'Denim', description: 'Jeans and denim-based clothing' },
  { type: 'product', name: 'Knitwear', description: 'Sweaters, cardigans, and knitted garments' },
  { type: 'product', name: 'Sleepwear', description: 'Pajamas, nightwear, and loungewear' },
  // Raw material categories
  { type: 'raw_material', name: 'Fabrics', description: 'Raw textiles and cloth for garment production' },
  { type: 'raw_material', name: 'Trimmings', description: 'Buttons, zippers, threads, and finishing materials' },
  { type: 'raw_material', name: 'Packaging', description: 'Boxes, bags, tags, and packaging materials' },
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
