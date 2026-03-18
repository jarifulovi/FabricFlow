import pool, { Pool, PoolClient } from './../connection';
import { mapRowToCamel } from './../utils/row-mapper.js';
import { buildSelectActiveUserRoleQuery } from './../queries/index';
import { UserRoleLookupInput, UserRoleRow } from '../types/auth';


export const authRepo = {
  async findActiveUserRole(input: UserRoleLookupInput, executor?: Pool | PoolClient): Promise<UserRoleRow | null> {
    const db = executor || pool;
    const query = buildSelectActiveUserRoleQuery(input);
    const { text, values } = query;
    const result = await db.query(text, values);
    return result.rows[0] ? mapRowToCamel<UserRoleRow>(result.rows[0]) : null;
  },
};
