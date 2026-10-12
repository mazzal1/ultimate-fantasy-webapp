import { Pool } from 'pg';

let pool;
let initializationPromise;

const bootstrapStatements = [
  `
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      username TEXT NOT NULL,
      character_count INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `,
  `
    CREATE TABLE IF NOT EXISTS characters (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      background TEXT NOT NULL DEFAULT '',
      level INTEGER NOT NULL DEFAULT 1,
      current_hp INTEGER NOT NULL DEFAULT 10,
      max_hp INTEGER NOT NULL DEFAULT 10,
      current_stamina INTEGER NOT NULL DEFAULT 10,
      max_stamina INTEGER NOT NULL DEFAULT 10,
      current_mana INTEGER NOT NULL DEFAULT 10,
      max_mana INTEGER NOT NULL DEFAULT 10,
      strength INTEGER NOT NULL DEFAULT 10,
      dexterity INTEGER NOT NULL DEFAULT 10,
      constitution INTEGER NOT NULL DEFAULT 10,
      intelligence INTEGER NOT NULL DEFAULT 10,
      wisdom INTEGER NOT NULL DEFAULT 10,
      charisma INTEGER NOT NULL DEFAULT 10,
      skills TEXT[] NOT NULL DEFAULT '{}',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `,
  'CREATE INDEX IF NOT EXISTS characters_user_id_idx ON characters (user_id);',
  `
    CREATE TABLE IF NOT EXISTS campaigns (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      notes TEXT NOT NULL DEFAULT '',
      game_master_id TEXT NOT NULL,
      player_ids TEXT[] NOT NULL DEFAULT '{}',
      character_ids TEXT[] NOT NULL DEFAULT '{}',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `,
  'CREATE INDEX IF NOT EXISTS campaigns_game_master_id_idx ON campaigns (game_master_id);',
  `
    CREATE TABLE IF NOT EXISTS skills (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      effect TEXT NOT NULL,
      rank INTEGER NOT NULL CHECK (rank BETWEEN 1 AND 5),
      min_level_requirement INTEGER,
      required_skill_id TEXT,
      required_skill_rank INTEGER,
      tags TEXT[] NOT NULL DEFAULT '{}',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `,
];

function getSslConfiguration() {
  if (process.env.POSTGRES_SSL === 'false') {
    return false;
  }

  return { rejectUnauthorized: false };
}

async function initializeSchema(databasePool) {
  const client = await databasePool.connect();

  try {
    await client.query('BEGIN');
    for (const statement of bootstrapStatements) {
      await client.query(statement);
    }
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function connectToDatabase() {
  const uri = process.env.POSTGRES_URI;
  if (!uri) {
    throw new Error('POSTGRES_URI is not configured.');
  }

  if (!pool) {
    pool = new Pool({
      connectionString: uri,
      ssl: getSslConfiguration(),
      max: 5,
      idleTimeoutMillis: 10_000,
    });
  }

  if (!initializationPromise) {
    initializationPromise = initializeSchema(pool).catch((error) => {
      initializationPromise = undefined;
      throw error;
    });
  }

  await initializationPromise;
  return pool;
}

export async function runQuery(text, params = []) {
  const databasePool = await connectToDatabase();
  return databasePool.query(text, params);
}
