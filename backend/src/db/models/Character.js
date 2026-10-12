import { randomUUID } from 'node:crypto';
import { runQuery } from '../connection.js';
import { buildOrderBy, toIsoString } from './postgresModelUtils.js';

const characterSortFields = {
  updatedAt: 'updated_at',
  createdAt: 'created_at',
  name: 'name',
  level: 'level',
};

function fromRow(row) {
  if (!row) {
    return null;
  }

  return new CharacterDocument({
    id: row.id,
    userId: row.user_id,
    name: row.name,
    background: row.background,
    level: row.level,
    currentHp: row.current_hp,
    maxHp: row.max_hp,
    currentStamina: row.current_stamina,
    maxStamina: row.max_stamina,
    currentMana: row.current_mana,
    maxMana: row.max_mana,
    strength: row.strength,
    dexterity: row.dexterity,
    constitution: row.constitution,
    intelligence: row.intelligence,
    wisdom: row.wisdom,
    charisma: row.charisma,
    skills: row.skills ?? [],
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
          background = $4,
          level = $5,
          current_hp = $6,
          max_hp = $7,
          current_stamina = $8,
          max_stamina = $9,
          current_mana = $10,
          max_mana = $11,
          strength = $12,
          dexterity = $13,
          constitution = $14,
          intelligence = $15,
          wisdom = $16,
          charisma = $17,
          skills = $18,
          updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `,
      [
        this.id,
        this.userId,
        this.name,
        this.background ?? '',
        this.level ?? 1,
        this.currentHp ?? 10,
        this.maxHp ?? 10,
        this.currentStamina ?? 10,
        this.maxStamina ?? 10,
        this.currentMana ?? 10,
        this.maxMana ?? 10,
        this.strength ?? 10,
        this.dexterity ?? 10,
        this.constitution ?? 10,
        this.intelligence ?? 10,
        this.wisdom ?? 10,
        this.charisma ?? 10,
        this.skills ?? [],
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
      background: this.background,
      level: this.level,
      currentHp: this.currentHp,
      maxHp: this.maxHp,
      currentStamina: this.currentStamina,
      maxStamina: this.maxStamina,
      currentMana: this.currentMana,
      maxMana: this.maxMana,
      strength: this.strength,
      dexterity: this.dexterity,
      constitution: this.constitution,
      intelligence: this.intelligence,
      wisdom: this.wisdom,
      charisma: this.charisma,
      skills: this.skills ?? [],
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
          id, user_id, name, background, level, current_hp, max_hp, current_stamina, max_stamina,
          current_mana, max_mana, strength, dexterity, constitution, intelligence, wisdom, charisma, skills
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9,
          $10, $11, $12, $13, $14, $15, $16, $17, $18
        )
        RETURNING *
      `,
      [
        data.id ?? randomUUID(),
        data.userId,
        data.name,
        data.background ?? '',
        data.level ?? 1,
        data.currentHp ?? 10,
        data.maxHp ?? 10,
        data.currentStamina ?? 10,
        data.maxStamina ?? 10,
        data.currentMana ?? 10,
        data.maxMana ?? 10,
        data.strength ?? 10,
        data.dexterity ?? 10,
        data.constitution ?? 10,
        data.intelligence ?? 10,
        data.wisdom ?? 10,
        data.charisma ?? 10,
        data.skills ?? [],
      ],
    );

    return fromRow(rows[0]);
  },

  async findById(id) {
    const { rows } = await runQuery('SELECT * FROM characters WHERE id = $1 LIMIT 1', [id]);
    return fromRow(rows[0]);
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

        const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
        const orderBy = buildOrderBy(sortOptions, characterSortFields, 'ORDER BY updated_at DESC');
        const { rows } = await runQuery(`SELECT * FROM characters ${whereClause} ${orderBy}`, params);
        return rows.map((row) => fromRow(row));
      },
    };
  },
};
