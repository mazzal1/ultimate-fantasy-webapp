import { connectToDatabase } from '../../db/connection.js';
import { Character } from '../../db/models/Character.js';
import { User } from '../../db/models/User.js';
import { requireAuth } from '../../middleware/auth.js';
import { appSyncError } from '../../utils/response.js';
import { getResourceCapFromRank } from '../../utils/gameRules.js';
import { validateCharacterInput } from '../../utils/validation.js';
import { serializeCharacterSheet } from './serializeCharacter.js';

export async function handler(event) {
  const user = requireAuth(event);
  const validationError = validateCharacterInput(event.arguments.input);
  if (validationError) {
    appSyncError(validationError);
  }

  await connectToDatabase();
  const existingCount = await Character.countDocuments({ userId: user.id });
  if (existingCount >= 20) {
    appSyncError('Character limit reached.');
  }

  const input = event.arguments.input;
  const coreStats = {
    strength: 'F',
    agility: 'F',
    dexterity: 'F',
    resilience: 'F',
    magic: 'F',
    willpower: 'F',
    acumen: 'F',
    charisma: 'F',
    luck: 'F',
    ...(input.coreStats ?? {}),
  };

  const maxMana = input.maxMana ?? getResourceCapFromRank(coreStats.magic);
  const maxStamina = input.maxStamina ?? getResourceCapFromRank(coreStats.resilience);
  const maxHp = input.maxHp ?? 8;

  const character = await Character.create({
    userId: user.id,
    name: input.name,
    playerName: input.playerName ?? '',
    gender: input.gender ?? '',
    race: input.race ?? '',
    age: input.age ?? null,
    background: input.background ?? '',
    level: input.level ?? 1,
    statPoints: input.statPoints ?? 1,
    skillPoints: input.skillPoints ?? 1,
    coreStats,
    currentHp: input.currentHp ?? maxHp,
    maxHp,
    currentStamina: input.currentStamina ?? maxStamina,
    maxStamina,
    currentMana: input.currentMana ?? maxMana,
    maxMana,
    wounds: input.wounds ?? 0,
    competencyStates: input.competencyStates ?? [],
    skillStates: input.skillStates ?? [],
    titleIds: input.titleIds ?? [],
    itemStates: input.itemStates ?? [],
  });

  await User.findByIdAndUpdate(
    user.id,
    { _id: user.id, email: user.email || `${user.username}@example.invalid`, username: user.username || user.id, characterCount: existingCount + 1 },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  return serializeCharacterSheet(character);
}
