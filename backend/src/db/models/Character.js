import { randomUUID } from 'node:crypto';
import { runQuery } from '../connection.js';
import { buildOrderBy, toIsoString } from './postgresModelUtils.js';

const characterSortFields = {
  updatedAt: 'updated_at',
  createdAt: 'created_at',
  name: 'name',
  level: 'level',
};

const defaultCoreStats = {
  strength: 'F',
  agility: 'F',
  dexterity: 'F',
  resilience: 'F',
  magic: 'F',
  willpower: 'F',
  acumen: 'F',
  charisma: 'F',
  luck: 'F',
};

function normalizeStateList(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((entry) => entry && typeof entry === 'object');
}

function fromRow(row) {
  if (!row) {
    return null;
  }

  return new CharacterDocument({
    id: row.id,
    userId: row.user_id,
    name: row.name,
    playerName: row.player_name ?? '',
    gender: row.gender ?? '',
    race: row.race ?? '',
    age: row.age,
    background: row.background ?? '',
    level: row.level,
    statPoints: row.stat_points ?? 1,
    skillPoints: row.skill_points ?? 1,
    coreStats: { ...defaultCoreStats, ...(row.core_stats ?? {}) },
    currentHp: row.current_hp ?? 8,
    maxHp: row.max_hp ?? 8,
    currentMana: row.current_mana,
    maxMana: row.max_mana,
    currentStamina: row.current_stamina,
    maxStamina: row.max_stamina,
    wounds: row.wounds ?? 0,
    competencyStates: normalizeStateList(row.competency_states),
    skillStates: normalizeStateList(row.skill_states),
    titleIds: row.title_ids ?? [],
    itemStates: normalizeStateList(row.item_states),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

class CharacterDocument {
  constructor(data) {
    Object.assign(this, data);
  }

  async save() {
    const { rows } = await runQuery(
      `
        UPDATE characters
        SET
          user_id = $2,
          name = $3,
          player_name = $4,
          gender = $5,
          race = $6,
          age = $7,
          background = $8,
          level = $9,
          stat_points = $10,
          skill_points = $11,
          core_stats = $12::jsonb,
          current_hp = $13,
          max_hp = $14,
          current_mana = $15,
          max_mana = $16,
          current_stamina = $17,
          max_stamina = $18,
          wounds = $19,
          competency_states = $20::jsonb,
          skill_states = $21::jsonb,
          title_ids = $22,
          item_states = $23::jsonb,
          updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `,
      [
        this.id,
        this.userId,
        this.name,
        this.playerName ?? '',
        this.gender ?? '',
        this.race ?? '',
        this.age ?? null,
        this.background ?? '',
        this.level ?? 1,
        this.statPoints ?? 1,
        this.skillPoints ?? 1,
        JSON.stringify({ ...defaultCoreStats, ...(this.coreStats ?? {}) }),
        this.currentHp ?? 8,
        this.maxHp ?? 8,
        this.currentMana ?? 0,
        this.maxMana ?? 0,
        this.currentStamina ?? 0,
        this.maxStamina ?? 0,
        this.wounds ?? 0,
        JSON.stringify(this.competencyStates ?? []),
        JSON.stringify(this.skillStates ?? []),
        this.titleIds ?? [],
        JSON.stringify(this.itemStates ?? []),
      ],
    );

    const next = fromRow(rows[0]);
    Object.assign(this, next);
    return this;
  }

  async deleteOne() {
    await runQuery('DELETE FROM characters WHERE id = $1', [this.id]);
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      name: this.name,
      playerName: this.playerName,
      gender: this.gender,
      race: this.race,
      age: this.age,
      background: this.background,
      level: this.level,
      statPoints: this.statPoints,
      skillPoints: this.skillPoints,
      coreStats: this.coreStats,
      currentHp: this.currentHp,
      maxHp: this.maxHp,
      currentMana: this.currentMana,
      maxMana: this.maxMana,
      currentStamina: this.currentStamina,
      maxStamina: this.maxStamina,
      wounds: this.wounds,
      competencyStates: this.competencyStates ?? [],
      skillStates: this.skillStates ?? [],
      titleIds: this.titleIds ?? [],
      itemStates: this.itemStates ?? [],
      createdAt: toIsoString(this.createdAt),
      updatedAt: toIsoString(this.updatedAt),
    };
  }
}

export const Character = {
  async create(data) {
    const { rows } = await runQuery(
      `
        INSERT INTO characters (
          id, user_id, name, player_name, gender, race, age, background, level, stat_points, skill_points, core_stats,
          current_hp, max_hp, current_mana, max_mana, current_stamina, max_stamina, wounds, competency_states, skill_states, title_ids, item_states
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12::jsonb,
          $13, $14, $15, $16, $17, $18, $19, $20::jsonb, $21::jsonb, $22, $23::jsonb
        )
        RETURNING *
      `,
      [
        data.id ?? randomUUID(),
        data.userId,
        data.name,
        data.playerName ?? '',
        data.gender ?? '',
        data.race ?? '',
        data.age ?? null,
        data.background ?? '',
        data.level ?? 1,
        data.statPoints ?? 1,
        data.skillPoints ?? 1,
        JSON.stringify({ ...defaultCoreStats, ...(data.coreStats ?? {}) }),
        data.currentHp ?? 8,
        data.maxHp ?? 8,
        data.currentMana ?? 0,
        data.maxMana ?? 0,
        data.currentStamina ?? 0,
        data.maxStamina ?? 0,
        data.wounds ?? 0,
        JSON.stringify(data.competencyStates ?? []),
        JSON.stringify(data.skillStates ?? []),
        data.titleIds ?? [],
        JSON.stringify(data.itemStates ?? []),
      ],
    );

    return fromRow(rows[0]);
  },

  async findById(id) {
    const { rows } = await runQuery('SELECT * FROM characters WHERE id = $1 LIMIT 1', [id]);
    return fromRow(rows[0]);
  },

  async findByIds(ids = []) {
    if (!Array.isArray(ids) || ids.length === 0) {
      return [];
    }

    const { rows } = await runQuery('SELECT * FROM characters WHERE id = ANY($1)', [ids]);
    return rows.map((row) => fromRow(row));
  },

  async countDocuments(filter = {}) {
    const params = [];
    const whereClauses = [];

    if (filter.userId) {
      params.push(filter.userId);
      whereClauses.push(`user_id = $${params.length}`);
    }

    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    const { rows } = await runQuery(`SELECT COUNT(*)::int AS count FROM characters ${whereClause}`, params);
    return rows[0]?.count ?? 0;
  },

  find(filter = {}) {
    return {
      sort: async (sortOptions) => {
        const params = [];
        const whereClauses = [];

        if (filter.userId) {
          params.push(filter.userId);
          whereClauses.push(`user_id = $${params.length}`);
        }

        if (filter.idIn) {
          params.push(filter.idIn);
          whereClauses.push(`id = ANY($${params.length})`);
        }

        const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
        const orderBy = buildOrderBy(sortOptions, characterSortFields, 'ORDER BY updated_at DESC');
        const { rows } = await runQuery(`SELECT * FROM characters ${whereClause} ${orderBy}`, params);
        return rows.map((row) => fromRow(row));
      },
    };
  },
};
