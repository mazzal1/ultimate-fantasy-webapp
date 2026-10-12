import { randomUUID } from 'node:crypto';
import { runQuery } from '../connection.js';
import { buildOrderBy, toIsoString } from './postgresModelUtils.js';

const skillSortFields = {
  rank: 'rank',
  name: 'name',
  updatedAt: 'updated_at',
  createdAt: 'created_at',
};

function fromRow(row) {
  if (!row) {
    return null;
  }

  return new SkillDocument({
    id: row.id,
    name: row.name,
    effect: row.effect,
    rank: row.rank,
    minLevelRequirement: row.min_level_requirement,
    requiredSkillId: row.required_skill_id,
    requiredSkillRank: row.required_skill_rank,
    tags: row.tags ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

class SkillDocument {
  constructor(data) {
    Object.assign(this, data);
  }

  async save() {
    const { rows } = await runQuery(
      `
        UPDATE skills
        SET
          name = $2,
          effect = $3,
          rank = $4,
          min_level_requirement = $5,
          required_skill_id = $6,
          required_skill_rank = $7,
          tags = $8,
          updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `,
      [
        this.id,
        this.name,
        this.effect,
        this.rank,
        this.minLevelRequirement ?? null,
        this.requiredSkillId ?? null,
        this.requiredSkillRank ?? null,
        this.tags ?? [],
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
      effect: this.effect,
      rank: this.rank,
      minLevelRequirement: this.minLevelRequirement,
      requiredSkillId: this.requiredSkillId,
      requiredSkillRank: this.requiredSkillRank,
      tags: this.tags ?? [],
      createdAt: toIsoString(this.createdAt),
      updatedAt: toIsoString(this.updatedAt),
    };
  }
}

export const Skill = {
  async create(data) {
    const { rows } = await runQuery(
      `
        INSERT INTO skills (
          id, name, effect, rank, min_level_requirement, required_skill_id, required_skill_rank, tags
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `,
      [
        data.id ?? randomUUID(),
        data.name,
        data.effect,
        data.rank,
        data.minLevelRequirement ?? null,
        data.requiredSkillId ?? null,
        data.requiredSkillRank ?? null,
        data.tags ?? [],
      ],
    );

    return fromRow(rows[0]);
  },

  async findById(id) {
    const { rows } = await runQuery('SELECT * FROM skills WHERE id = $1 LIMIT 1', [id]);
    return fromRow(rows[0]);
  },

  find() {
    return {
      sort: async (sortOptions) => {
        const orderBy = buildOrderBy(sortOptions, skillSortFields, 'ORDER BY rank ASC, name ASC');
        const { rows } = await runQuery(`SELECT * FROM skills ${orderBy}`);
        return rows.map((row) => fromRow(row));
      },
    };
  },
};
