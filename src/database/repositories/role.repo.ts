import pool, { Pool, PoolClient } from './../connection';
import { mapRowToCamel, mapRowsToCamel } from './../utils/row-mapper.js';
import {
  buildInsertRoleQuery,
  buildPatchRoleQuery,
  buildBulkDeleteRolesQuery,
  buildSelectRoleByIdQuery,
  buildSelectRoleByNameQuery,
  buildSelectRolesQuery,
} from './../queries';
import { CreateRoleInput, UpdateRoleInput, RoleRow } from '../types/role';

export const roleRepo = {
  async create(input: CreateRoleInput, executor?: Pool | PoolClient): Promise<RoleRow> {
    const db = executor || pool;
    const { text, values } = buildInsertRoleQuery(input);
    const result = await db.query(text, values);
    return mapRowToCamel<RoleRow>(result.rows[0]);
  },

  async update(id: string, input: UpdateRoleInput, executor?: Pool | PoolClient): Promise<RoleRow> {
    const db = executor || pool;
    const { text, values } = buildPatchRoleQuery(id, input);
    const result = await db.query(text, values);
    return mapRowToCamel<RoleRow>(result.rows[0]);
  },

  async findById(id: string, executor?: Pool | PoolClient): Promise<RoleRow | null> {
    const db = executor || pool;
    const { text, values } = buildSelectRoleByIdQuery(id);
    const result = await db.query(text, values);
    return result.rows[0] ? mapRowToCamel<RoleRow>(result.rows[0]) : null;
  },

  async findByName(name: string, executor?: Pool | PoolClient): Promise<RoleRow | null> {
    const db = executor || pool;
    const { text, values } = buildSelectRoleByNameQuery(name);
    const result = await db.query(text, values);
    return result.rows[0] ? mapRowToCamel<RoleRow>(result.rows[0]) : null;
  },

  async findAll(executor?: Pool | PoolClient): Promise<RoleRow[]> {
    const db = executor || pool;
    const { text, values } = buildSelectRolesQuery();
    const result = await db.query(text, values);
    return mapRowsToCamel<RoleRow>(result.rows);
  },

  async delete(id: string, executor?: Pool | PoolClient): Promise<RoleRow> {
    const db = executor || pool;
    const { text, values } = buildBulkDeleteRolesQuery([id]);
    const result = await db.query(text, values);
    return mapRowToCamel<RoleRow>(result.rows[0]);
  },
};
