import { randomUUID } from 'node:crypto';
import { runQuery } from '../connection.js';
import { buildOrderBy, toIsoString } from './postgresModelUtils.js';

const campaignSortFields = {
  updatedAt: 'updated_at',
  createdAt: 'created_at',
  name: 'name',
};

function fromRow(row) {
  if (!row) {
    return null;
  }

  return new CampaignDocument({
    id: row.id,
    name: row.name,
    description: row.description,
    notes: row.notes,
    gameMasterId: row.game_master_id,
    playerIds: row.player_ids ?? [],
    characterIds: row.character_ids ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

class CampaignDocument {
  constructor(data) {
    Object.assign(this, data);
  }

  async save() {
    const { rows } = await runQuery(
      `
        UPDATE campaigns
        SET
          name = $2,
          description = $3,
          notes = $4,
          game_master_id = $5,
          player_ids = $6,
          character_ids = $7,
          updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `,
      [
        this.id,
        this.name,
        this.description ?? '',
        this.notes ?? '',
        this.gameMasterId,
        this.playerIds ?? [],
        this.characterIds ?? [],
      ],
    );

    const next = fromRow(rows[0]);
    Object.assign(this, next);
    return this;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      notes: this.notes,
      gameMasterId: this.gameMasterId,
      playerIds: this.playerIds ?? [],
      characterIds: this.characterIds ?? [],
      createdAt: toIsoString(this.createdAt),
      updatedAt: toIsoString(this.updatedAt),
    };
  }
}

export const Campaign = {
  async create(data) {
    const { rows } = await runQuery(
      `
        INSERT INTO campaigns (id, name, description, notes, game_master_id, player_ids, character_ids)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `,
      [
        data.id ?? randomUUID(),
        data.name,
        data.description ?? '',
        data.notes ?? '',
        data.gameMasterId,
        data.playerIds ?? [],
        data.characterIds ?? [],
      ],
    );

    return fromRow(rows[0]);
  },

  async findById(id) {
    const { rows } = await runQuery('SELECT * FROM campaigns WHERE id = $1 LIMIT 1', [id]);
    return fromRow(rows[0]);
  },

  find(filter = {}) {
    return {
      sort: async (sortOptions) => {
        const orderBy = buildOrderBy(sortOptions, campaignSortFields, 'ORDER BY updated_at DESC');
        const params = [];
        const whereClauses = [];

        if (Array.isArray(filter.$or) && filter.$or.length > 0) {
          const gameMasterCandidate = filter.$or.find((condition) => Object.hasOwn(condition, 'gameMasterId'))?.gameMasterId;
          const playerCandidate = filter.$or.find((condition) => Object.hasOwn(condition, 'playerIds'))?.playerIds;

          if (gameMasterCandidate || playerCandidate) {
            const membershipId = gameMasterCandidate ?? playerCandidate;
            params.push(membershipId);
            whereClauses.push('(game_master_id = $1 OR $1 = ANY(player_ids))');
          }
        } else {
          if (filter.gameMasterId) {
            params.push(filter.gameMasterId);
            whereClauses.push(`game_master_id = $${params.length}`);
          }

          if (filter.playerIds) {
            params.push(filter.playerIds);
            whereClauses.push(`$${params.length} = ANY(player_ids)`);
          }
        }

        const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
        const { rows } = await runQuery(`SELECT * FROM campaigns ${whereClause} ${orderBy}`, params);
        return rows.map((row) => fromRow(row));
      },
    };
  },
};
