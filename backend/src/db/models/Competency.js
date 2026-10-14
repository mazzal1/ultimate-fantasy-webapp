import { randomUUID } from 'node:crypto';
import { runQuery } from '../connection.js';
import { toIsoString } from './postgresModelUtils.js';

function fromRow(row) {
  if (!row) {
    return null;
  }

  return new CompetencyDocument({
    id: row.id,
    ownerUserId: row.owner_user_id,
    name: row.name,
    description: row.description,
    tags: row.tags ?? [],
    isSystem: row.is_system ?? false,
    sharedCampaignIds: row.shared_campaign_ids ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

class CompetencyDocument {
  constructor(data) {
    Object.assign(this, data);
  }

  async save() {
    const { rows } = await runQuery(
      `
        UPDATE competencies
        SET
          owner_user_id = $2,
          name = $3,
          description = $4,
          tags = $5,
          is_system = $6,
          shared_campaign_ids = $7,
          updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `,
      [this.id, this.ownerUserId ?? null, this.name, this.description, this.tags ?? [], Boolean(this.isSystem), this.sharedCampaignIds ?? []],
    );

    Object.assign(this, fromRow(rows[0]));
    return this;
  }

  toJSON() {
    return {
      id: this.id,
      ownerUserId: this.ownerUserId,
      name: this.name,
      description: this.description,
      tags: this.tags ?? [],
      isSystem: this.isSystem,
      sharedCampaignIds: this.sharedCampaignIds ?? [],
      createdAt: toIsoString(this.createdAt),
      updatedAt: toIsoString(this.updatedAt),
    };
  }
}

export const Competency = {
  async create(data) {
    const { rows } = await runQuery(
      `
        INSERT INTO competencies (id, owner_user_id, name, description, tags, is_system, shared_campaign_ids)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `,
      [data.id ?? randomUUID(), data.ownerUserId ?? null, data.name, data.description, data.tags ?? [], Boolean(data.isSystem), data.sharedCampaignIds ?? []],
    );
    return fromRow(rows[0]);
  },

  async findById(id) {
    const { rows } = await runQuery('SELECT * FROM competencies WHERE id = $1 LIMIT 1', [id]);
    return fromRow(rows[0]);
  },

  async findVisible({ viewerUserId, campaignIds = [], search }) {
    const params = [viewerUserId, campaignIds];
    const conditions = [
      '(is_system = TRUE OR owner_user_id = $1 OR shared_campaign_ids && $2)',
    ];

    if (search) {
      params.push(`%${search.toLowerCase()}%`);
      conditions.push(`(LOWER(name) LIKE $${params.length} OR LOWER(description) LIKE $${params.length})`);
    }

    const { rows } = await runQuery(
      `SELECT * FROM competencies WHERE ${conditions.join(' AND ')} ORDER BY name ASC`,
      params,
    );

    return rows.map((row) => fromRow(row));
  },

  async findByIds(ids = []) {
    if (!Array.isArray(ids) || ids.length === 0) {
      return [];
    }

    const { rows } = await runQuery('SELECT * FROM competencies WHERE id = ANY($1)', [ids]);
    return rows.map((row) => fromRow(row));
  },
};
