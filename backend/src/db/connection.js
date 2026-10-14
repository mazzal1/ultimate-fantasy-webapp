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
  `ALTER TABLE characters ADD COLUMN IF NOT EXISTS gender TEXT NOT NULL DEFAULT '';`,
  `ALTER TABLE characters ADD COLUMN IF NOT EXISTS race TEXT NOT NULL DEFAULT '';`,
  `ALTER TABLE characters ADD COLUMN IF NOT EXISTS age INTEGER;`,
  `ALTER TABLE characters ADD COLUMN IF NOT EXISTS player_name TEXT NOT NULL DEFAULT '';`,
  `ALTER TABLE characters ADD COLUMN IF NOT EXISTS stat_points INTEGER NOT NULL DEFAULT 1;`,
  `ALTER TABLE characters ADD COLUMN IF NOT EXISTS skill_points INTEGER NOT NULL DEFAULT 1;`,
  `ALTER TABLE characters ADD COLUMN IF NOT EXISTS wounds INTEGER NOT NULL DEFAULT 0;`,
  `
    ALTER TABLE characters
    ADD COLUMN IF NOT EXISTS core_stats JSONB NOT NULL DEFAULT
    '{"strength":"F","agility":"F","dexterity":"F","resilience":"F","magic":"F","willpower":"F","acumen":"F","charisma":"F","luck":"F"}'::jsonb;
  `,
  `ALTER TABLE characters ADD COLUMN IF NOT EXISTS competency_states JSONB NOT NULL DEFAULT '[]'::jsonb;`,
  `ALTER TABLE characters ADD COLUMN IF NOT EXISTS skill_states JSONB NOT NULL DEFAULT '[]'::jsonb;`,
  `ALTER TABLE characters ADD COLUMN IF NOT EXISTS title_ids TEXT[] NOT NULL DEFAULT '{}';`,
  `ALTER TABLE characters ADD COLUMN IF NOT EXISTS item_states JSONB NOT NULL DEFAULT '[]'::jsonb;`,
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
  `
    CREATE TABLE IF NOT EXISTS abilities (
      id TEXT PRIMARY KEY,
      owner_user_id TEXT,
      kind TEXT NOT NULL CHECK (kind IN ('SKILL', 'ITEM')),
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      max_rank TEXT NOT NULL CHECK (max_rank IN ('F', 'E', 'D', 'C', 'B', 'A', 'S')),
      activation_type TEXT NOT NULL DEFAULT 'ACTION',
      mana_cost INTEGER NOT NULL DEFAULT 0,
      stamina_cost INTEGER NOT NULL DEFAULT 0,
      min_level_requirement INTEGER NOT NULL DEFAULT 1,
      required_ability_ids TEXT[] NOT NULL DEFAULT '{}',
      required_title_ids TEXT[] NOT NULL DEFAULT '{}',
      tags TEXT[] NOT NULL DEFAULT '{}',
      is_system BOOLEAN NOT NULL DEFAULT FALSE,
      shared_campaign_ids TEXT[] NOT NULL DEFAULT '{}',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `,
  'CREATE INDEX IF NOT EXISTS abilities_kind_idx ON abilities (kind);',
  'CREATE INDEX IF NOT EXISTS abilities_owner_user_id_idx ON abilities (owner_user_id);',
  `
    CREATE TABLE IF NOT EXISTS competencies (
      id TEXT PRIMARY KEY,
      owner_user_id TEXT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      tags TEXT[] NOT NULL DEFAULT '{}',
      is_system BOOLEAN NOT NULL DEFAULT FALSE,
      shared_campaign_ids TEXT[] NOT NULL DEFAULT '{}',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `,
  'CREATE INDEX IF NOT EXISTS competencies_owner_user_id_idx ON competencies (owner_user_id);',
  `
    CREATE TABLE IF NOT EXISTS titles (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      is_system BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `,
  `
    INSERT INTO competencies (id, owner_user_id, name, description, tags, is_system)
    VALUES
      ('system-stealth', NULL, 'Stealth', 'Move silently, hide, and avoid detection.', ARRAY['exploration'], TRUE),
      ('system-historical-lore', NULL, 'Historical Lore', 'Recall events, dates, and notable historical figures.', ARRAY['knowledge'], TRUE)
    ON CONFLICT (id) DO NOTHING;
  `,
  `
    INSERT INTO titles (id, name, description, is_system)
    VALUES
      ('system-novice-adventurer', 'Novice Adventurer', 'A freshly initiated hero with great potential.', TRUE),
      ('system-quest-walker', 'Quest Walker', 'Awarded to characters who complete major campaign milestones.', TRUE)
    ON CONFLICT (id) DO NOTHING;
  `,
  `
    INSERT INTO abilities (
      id, owner_user_id, kind, name, description, max_rank, activation_type, mana_cost, stamina_cost,
      min_level_requirement, required_ability_ids, required_title_ids, tags, is_system
    )
    VALUES
      (
        'system-arcane-bolt',
        NULL,
        'SKILL',
        'Arcane Bolt',
        'Release arcane energy against a single target.',
        'C',
        'ACTION',
        1,
        0,
        1,
        ARRAY[]::TEXT[],
        ARRAY[]::TEXT[],
        ARRAY['magic', 'offense'],
        TRUE
      ),
      (
        'system-travel-ration',
        NULL,
        'ITEM',
        'Travel Ration',
        'Portable food supply useful during long travels.',
        'F',
        'PASSIVE',
        0,
        0,
        1,
        ARRAY[]::TEXT[],
        ARRAY[]::TEXT[],
        ARRAY['consumable', 'survival'],
        TRUE
      )
    ON CONFLICT (id) DO NOTHING;
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
