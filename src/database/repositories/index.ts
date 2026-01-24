/**
 * Repository Pattern Entry Point
 * 
 * Exports all repository classes that serve as the data access layer
 * Each repository handles CRUD operations for a specific entity
 */


/** Repository Rules (Persistence Layer)

 * ✔ One repository = one entity / aggregate
 * ✔ CRUD or simple reads only
 * ✔ May use joins for read-only queries
 * ✔ No business rules
 * ✔ No conditional workflows
 * ✔ No cross-entity writes

 * ❌ Do NOT:

 * Write to multiple tables
 * Make business decisions
 * Handle transactions
 * Call other repositories for writes
 */

export * from './category.repo';
export * from './warehouse.repo';
export * from './product.repo';
export * from './variant.repo';
export * from './receiving-slip.repo';
export * from './receiving-slip-line.repo';
