import pool, { Pool, PoolClient } from './../connection';
import { mapRowToCamel } from './../utils/row-mapper.js';
import {
  buildInsertUserQuery,
  buildPatchUserQuery,
  buildSelectUserByIdQuery,
  buildSelectUserByExternalIdQuery,
  buildSelectUserByEmailQuery,
} from './../queries';
import { CreateUserInput, UpdateUserInput, UserRow } from '../types/user';

export const userRepo = {
  async create(input: CreateUserInput, executor?: Pool | PoolClient): Promise<UserRow> {
    const db = executor || pool;
    const { text, values } = buildInsertUserQuery(input);
    const result = await db.query(text, values);
    return mapRowToCamel<UserRow>(result.rows[0]);
  },

  async update(id: string, input: UpdateUserInput, executor?: Pool | PoolClient): Promise<UserRow> {
    const db = executor || pool;
    const { text, values } = buildPatchUserQuery(id, input);
    const result = await db.query(text, values);
    return mapRowToCamel<UserRow>(result.rows[0]);
  },

  async findById(id: string, executor?: Pool | PoolClient): Promise<UserRow | null> {
    const db = executor || pool;
    const { text, values } = buildSelectUserByIdQuery(id);
    const result = await db.query(text, values);
    return result.rows[0] ? mapRowToCamel<UserRow>(result.rows[0]) : null;
  },

  async findByExternalId(externalId: string, executor?: Pool | PoolClient): Promise<UserRow | null> {
    const db = executor || pool;
    const { text, values } = buildSelectUserByExternalIdQuery(externalId);
    const result = await db.query(text, values);
    return result.rows[0] ? mapRowToCamel<UserRow>(result.rows[0]) : null;
  },

  async findByEmail(email: string, executor?: Pool | PoolClient): Promise<UserRow | null> {
    const db = executor || pool;
    const { text, values } = buildSelectUserByEmailQuery(email);
    const result = await db.query(text, values);
    return result.rows[0] ? mapRowToCamel<UserRow>(result.rows[0]) : null;
  },
};
