# Database Seeds

This directory contains code-based seed scripts for populating the FabricFlow database with initial data.

## Overview

The seeds use TypeScript and repository methods to insert data, allowing for:
- **Dynamic data handling** - Foreign key references are resolved at runtime
- **Type safety** - Full TypeScript type checking
- **Repository integration** - Uses the same repository methods as the application
- **ES Module support** - Works with the project's ESNext module system

## Structure

```
seeds/
├── categories.seed.ts    # Seed categories (no dependencies)
├── warehouses.seed.ts    # Seed warehouses (no dependencies)
├── products.seed.ts      # Seed products (depends on categories)
├── variants.seed.ts      # Seed variants (depends on products)
└── index.ts              # Centralized seed runner
```

## Running Seeds

### Run All Seeds (Recommended)

This will seed all tables in the correct order:

```bash
npm run seed
```

### Run Individual Seeds

You can also run seeds for individual features:

```bash
# Seed only categories
npm run seed:categories

# Seed only warehouses
npm run seed:warehouses

# Seed only products (requires categories to exist)
npm run seed:products

# Seed only variants (requires products to exist)
npm run seed:variants
```

### Clear All Seeded Data

To remove all seeded data and start fresh:

```bash
npm run seed:clear
```

This will delete all data from the seeded tables in the correct order (respecting foreign key constraints).

## Data Overview

### Categories (15 items)
- Men's Wear, Women's Wear, Kids' Wear
- Accessories, Fabrics, Footwear
- Undergarments, Activewear, Formal Wear
- Casual Wear, Outerwear, Traditional Wear
- Denim, Knitwear, Sleepwear

### Warehouses (8 items)
- Main Warehouse, North Branch, South Branch
- East Distribution Center, West Storage Facility
- Central Hub, Coastal Warehouse, Airport Logistics

### Products (22 items)
Various garment products across all categories including:
- T-shirts, shirts, pants, dresses, skirts
- Jeans, jackets, sweaters, suits
- Activewear, formal wear, accessories
- Raw fabrics for production

### Variants (43 items)
Product variants with different attributes:
- Colors (Black, White, Navy, Gray, etc.)
- Sizes (XS, S, M, L, XL, 30-42, 4Y-8Y)
- Genders (Male, Female, Unisex)
- Seasons (All Season, Summer, Winter, Spring)
- Fit types (Regular, Slim, Tailored, Compression)

## Dependencies

Seeds respect foreign key dependencies:
1. **Categories & Warehouses** - No dependencies, can run independently
2. **Products** - Depends on Categories
3. **Variants** - Depends on Products

## Error Handling

- If a seed is run multiple times, it will fail with a duplicate key error (expected behavior)
- To re-seed, first clear the existing data from the tables
- Seeds run in a transaction-like manner - if one fails, all subsequent seeds will also fail

## Adding New Seeds

To add a new seed file:

1. Create a new file: `your-feature.seed.ts`
2. Import the repository and types
3. Export a seed function that returns the created records
4. Add standalone execution handling
5. Add it to the `index.ts` runner
6. Add a script to `package.json`

Example template:

```typescript
import pool from '../connection.js';
import { yourRepo } from '../repositories/your.repo.js';
import type { CreateYourInput } from '../types/your.js';

const data: CreateYourInput[] = [
  // Your seed data here
];

export async function seedYourFeature() {
  console.log('🌱 Seeding your feature...');
  
  try {
    const created = await Promise.all(
      data.map((item) => yourRepo.create(item, pool))
    );

    console.log(`✅ Created ${created.length} items`);
    return created;
  } catch (error) {
    console.error('❌ Failed to seed:', error);
    throw error;
  }
}

// Standalone execution
if (import.meta.url === \`file://\${process.argv[1]}\`) {
  seedYourFeature()
    .then(() => {
      console.log('✅ Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}
```

## Notes

- Seeds use the database connection pool from `../connection.js`
- All seed functions are exported and can be imported in other scripts
- The centralized runner (`index.ts`) handles proper ordering and connection cleanup
- Each seed can be run standalone for testing purposes
