import { randomUUID } from 'node:crypto';
import { runQuery } from '../connection.js';
import { toIsoString } from './postgresModelUtils.js';

function fromRow(row) {
  if (!row) {
    return null;
  }

  return new AbilityDocument({
    id: row.id,
    ownerUserId: row.owner_user_id,
    kind: row.kind,
    name: row.name,
    description: row.description,
    maxRank: row.max_rank,
    activationType: row.activation_type,
    manaCost: row.mana_cost,
    staminaCost: row.stamina_cost,
    minLevelRequirement: row.min_level_requirement,
    requiredAbilityIds: row.required_ability_ids ?? [],
    requiredTitleIds: row.required_title_ids ?? [],
    tags: row.tags ?? [],
    isSystem: row.is_system ?? false,
    sharedCampaignIds: row.shared_campaign_ids ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

class AbilityDocument {
  constructor(data) {
    Object.assign(this, data);
  }

  async save() {
    const { rows } = await runQuery(
      `
        UPDATE abilities
        SET
          owner_user_id = $2,
          kind = $3,
          name = $4,
          description = $5,
          max_rank = $6,
          activation_type = $7,
          mana_cost = $8,
          stamina_cost = $9,
          min_level_requirement = $10,
          required_ability_ids = $11,
          required_title_ids = $12,
          tags = $13,
          is_system = $14,
          shared_campaign_ids = $15,
          updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `,
      [
        this.id,
        this.ownerUserId ?? null,
        this.kind,
        this.name,
        this.description,
        this.maxRank,
        this.activationType ?? 'ACTION',
        this.manaCost ?? 0,
        this.staminaCost ?? 0,
        this.minLevelRequirement ?? 1,
        this.requiredAbilityIds ?? [],
        this.requiredTitleIds ?? [],
        this.tags ?? [],
        Boolean(this.isSystem),
        this.sharedCampaignIds ?? [],
      ],
    );

    Object.assign(this, fromRow(rows[0]));
    return this;
  }

  toJSON() {
    return {
      id: this.id,
      ownerUserId: this.ownerUserId,
      kind: this.kind,
      name: this.name,
      description: this.description,
      maxRank: this.maxRank,
      activationType: this.activationType,
      manaCost: this.manaCost,
      staminaCost: this.staminaCost,
      minLevelRequirement: this.minLevelRequirement,
      requiredAbilityIds: this.requiredAbilityIds ?? [],
      requiredTitleIds: this.requiredTitleIds ?? [],
      tags: this.tags ?? [],
      isSystem: this.isSystem,
      sharedCampaignIds: this.sharedCampaignIds ?? [],
      createdAt: toIsoString(this.createdAt),
      updatedAt: toIsoString(this.updatedAt),
    };
  }
}

function buildVisibilityFilter({ viewerUserId, campaignIds = [] }, offset = 0) {
  const params = [viewerUserId, campaignIds];
  return {
    text: `
      (
        is_system = TRUE
        OR owner_user_id = $${offset + 1}
        OR shared_campaign_ids && $${offset + 2}
      )
    `,
    params,
  };
}

export const Ability = {
  async create(data) {
    const { rows } = await runQuery(
      `
        INSERT INTO abilities (
          id, owner_user_id, kind, name, description, max_rank, activation_type, mana_cost, stamina_cost,
          min_level_requirement, required_ability_ids, required_title_ids, tags, is_system, shared_campaign_ids
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING *
      `,
      [
        data.id ?? randomUUID(),
        data.ownerUserId ?? null,
        data.kind,
        data.name,
        data.description,
        data.maxRank,
        data.activationType ?? 'ACTION',
        data.manaCost ?? 0,
        data.staminaCost ?? 0,
        data.minLevelRequirement ?? 1,
        data.requiredAbilityIds ?? [],
        data.requiredTitleIds ?? [],
        data.tags ?? [],
        Boolean(data.isSystem),
        data.sharedCampaignIds ?? [],
      ],
    );

    return fromRow(rows[0]);
  },

  async findById(id) {
    const { rows } = await runQuery('SELECT * FROM abilities WHERE id = $1 LIMIT 1', [id]);
    return fromRow(rows[0]);
  },

  async findVisible({ viewerUserId, campaignIds = [], kind, tag, search }) {
    const clauses = [];
    const params = [];

    const visibilityFilter = buildVisibilityFilter({ viewerUserId, campaignIds }, params.length);
    params.push(...visibilityFilter.params);
    clauses.push(visibilityFilter.text);

    if (kind) {
      params.push(kind);
      clauses.push(`kind = $${params.length}`);
    }

    if (tag) {
      params.push(tag);
      clauses.push(`$${params.length} = ANY(tags)`);
    }

    if (search) {
      params.push(`%${search.toLowerCase()}%`);
      clauses.push(`(LOWER(name) LIKE $${params.length} OR LOWER(description) LIKE $${params.length})`);
    }

    const whereClause = clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '';
    const { rows } = await runQuery(`SELECT * FROM abilities ${whereClause} ORDER BY kind ASC, name ASC`, params);
    return rows.map((row) => fromRow(row));
  },

  async findByIds(ids = []) {
    if (!Array.isArray(ids) || ids.length === 0) {
      return [];
    }

    const { rows } = await runQuery('SELECT * FROM abilities WHERE id = ANY($1)', [ids]);
    return rows.map((row) => fromRow(row));
  },
};
