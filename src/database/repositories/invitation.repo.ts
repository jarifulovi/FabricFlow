import pool, { Pool, PoolClient } from './../connection';
import { mapRowToCamel } from './../utils/row-mapper.js';
import {
  buildInsertInvitationQuery,
  buildPatchInvitationQuery,
  buildSelectInvitationByEmailQuery,
  buildSelectInvitationByTokenHashQuery,
  buildBulkDeleteInvitationsQuery,
} from './../queries';
import { CreateInvitationInput, InvitationRow, UpdateInvitationInput } from '../types/invitation';

export const invitationRepo = {
  async create(input: CreateInvitationInput, executor?: Pool | PoolClient): Promise<InvitationRow> {
    const db = executor || pool;
    const { text, values } = buildInsertInvitationQuery(input);
    const result = await db.query(text, values);
    return mapRowToCamel<InvitationRow>(result.rows[0]);
  },

  async update(id: string, input: UpdateInvitationInput, executor?: Pool | PoolClient): Promise<InvitationRow> {
    const db = executor || pool;
    const { text, values } = buildPatchInvitationQuery(id, input);
    const result = await db.query(text, values);
    return mapRowToCamel<InvitationRow>(result.rows[0]);
  },

  async findByEmail(email: string, executor?: Pool | PoolClient): Promise<InvitationRow | null> {
    const db = executor || pool;
    const { text, values } = buildSelectInvitationByEmailQuery(email);
    const result = await db.query(text, values);
    return result.rows[0] ? mapRowToCamel<InvitationRow>(result.rows[0]) : null;
  },

  async findByTokenHash(tokenHash: string, executor?: Pool | PoolClient): Promise<InvitationRow | null> {
    const db = executor || pool;
    const { text, values } = buildSelectInvitationByTokenHashQuery(tokenHash);
    const result = await db.query(text, values);
    return result.rows[0] ? mapRowToCamel<InvitationRow>(result.rows[0]) : null;
  },

  async delete(id: string, executor?: Pool | PoolClient): Promise<InvitationRow> {
    const db = executor || pool;
    const { text, values } = buildBulkDeleteInvitationsQuery([id]);
    const result = await db.query(text, values);
    return mapRowToCamel<InvitationRow>(result.rows[0]);
  },
};
