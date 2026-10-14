import { runQuery } from '../connection.js';
import { toIsoString } from './postgresModelUtils.js';

function fromRow(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    name: row.name,
    description: row.description,
    isSystem: row.is_system ?? true,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    toJSON() {
      return {
        id: this.id,
        name: this.name,
        description: this.description,
        isSystem: this.isSystem,
        createdAt: toIsoString(this.createdAt),
        updatedAt: toIsoString(this.updatedAt),
      };
    },
  };
}

export const Title = {
  async listAll() {
    const { rows } = await runQuery('SELECT * FROM titles ORDER BY name ASC');
    return rows.map((row) => fromRow(row));
  },

  async findByIds(ids = []) {
    if (!Array.isArray(ids) || ids.length === 0) {
      return [];
    }

    const { rows } = await runQuery('SELECT * FROM titles WHERE id = ANY($1)', [ids]);
    return rows.map((row) => fromRow(row));
  },
};
