import { runQuery } from '../connection.js';
import { toIsoString } from './postgresModelUtils.js';

function fromRow(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    email: row.email,
    username: row.username,
    characterCount: row.character_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    toJSON() {
      return {
        id: this.id,
        email: this.email,
        username: this.username,
        characterCount: this.characterCount,
        createdAt: toIsoString(this.createdAt),
        updatedAt: toIsoString(this.updatedAt),
      };
    },
  };
}

export const User = {
  async findByIdAndUpdate(id, update = {}) {
    const email = update.email ?? `${id}@example.invalid`;
    const username = update.username ?? id;
    const characterCount = update.characterCount ?? 0;

    const { rows } = await runQuery(
      `
        INSERT INTO users (id, email, username, character_count)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (id)
        DO UPDATE SET
          email = COALESCE(EXCLUDED.email, users.email),
          username = COALESCE(EXCLUDED.username, users.username),
          character_count = COALESCE(EXCLUDED.character_count, users.character_count),
          updated_at = NOW()
        RETURNING *
      `,
      [id, email, username, characterCount],
    );

    return fromRow(rows[0]);
  },
};
