import pool, { Pool, PoolClient } from './../connection';
import { mapRowToCamel, mapRowsToCamel } from './../utils/row-mapper.js';

import {
  buildInsertInventoryMovementQuery,
  buildBulkInsertInventoryMovementQuery,
  buildDeleteInventoryMovementsQuery,
  buildSelectInventoryMovementByIdQuery,
  buildSelectInventoryMovementsQuery,
  buildSelectInventoryMovementsBySourceQuery,
} from './../queries/index';
import {
  InventoryMovementRow,
  CreateInventoryMovementInput,
  MovementSource,
  InventoryMovementFindAllFilters
} from './../types/inventory-movement';

export const inventoryMovementRepo = {
  async create(input: CreateInventoryMovementInput, executor?: Pool | PoolClient): Promise<InventoryMovementRow> {
    const db = executor || pool;
    const { text, values } = buildInsertInventoryMovementQuery(input);
    const result = await db.query(text, values);
    return mapRowToCamel<InventoryMovementRow>(result.rows[0]);
  },

  async bulkCreate(inputs: CreateInventoryMovementInput[], executor?: Pool | PoolClient): Promise<InventoryMovementRow[]> {
    const db = executor || pool;
    const { text, values } = buildBulkInsertInventoryMovementQuery(inputs);
    const result = await db.query(text, values);
    return mapRowsToCamel<InventoryMovementRow>(result.rows);
  },

  async findById(id: string, executor?: Pool | PoolClient): Promise<InventoryMovementRow | null> {
    const db = executor || pool;
    const { text, values } = buildSelectInventoryMovementByIdQuery(id);
    const result = await db.query(text, values);
    return result.rows[0] ? mapRowToCamel<InventoryMovementRow>(result.rows[0]) : null;
  },

  async findBySource(sourceType: MovementSource, sourceId: string, executor?: Pool | PoolClient): Promise<InventoryMovementRow[]> {
    const db = executor || pool;
    const { text, values } = buildSelectInventoryMovementsBySourceQuery(sourceType, sourceId);
    const result = await db.query(text, values);
    return mapRowsToCamel<InventoryMovementRow>(result.rows);
  },

  async findAll(filters?: InventoryMovementFindAllFilters, executor?: Pool | PoolClient): Promise<InventoryMovementRow[]> {
    const db = executor || pool;
    const { text, values } = buildSelectInventoryMovementsQuery(filters);
    const result = await db.query(text, values);
    return mapRowsToCamel<InventoryMovementRow>(result.rows);
  },

  async delete(id: string, executor?: Pool | PoolClient): Promise<InventoryMovementRow> {
    const db = executor || pool;
    const { text, values } = buildDeleteInventoryMovementsQuery([id]);
    const result = await db.query(text, values);
    return mapRowToCamel<InventoryMovementRow>(result.rows[0]);
  },
};
