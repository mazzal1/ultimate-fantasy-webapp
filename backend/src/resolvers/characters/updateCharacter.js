import { connectToDatabase } from '../../db/connection.js';
import { Character } from '../../db/models/Character.js';
import { requireAuth } from '../../middleware/auth.js';
import { appSyncError } from '../../utils/response.js';
import { getResourceCapFromRank } from '../../utils/gameRules.js';
import { validateCharacterInput } from '../../utils/validation.js';
import { serializeCharacterSheet } from './serializeCharacter.js';

export async function handler(event) {
  const user = requireAuth(event);
  await connectToDatabase();
  const character = await Character.findById(event.arguments.id);
  if (!character) {
    appSyncError('Character not found.');
  }

  if (character.userId !== user.id) {
    appSyncError('Forbidden');
  }

  const input = event.arguments.input;
  const validationError = validateCharacterInput(
    {
      ...character.toJSON(),
      ...input,
      coreStats: { ...character.coreStats, ...(input.coreStats ?? {}) },
    },
    true,
  );
  if (validationError) {
    appSyncError(validationError);
  }

  const previousLevel = character.level;
  const nextLevel = input.level ?? previousLevel;
  if (nextLevel > previousLevel) {
    const gainedLevels = nextLevel - previousLevel;
    character.statPoints = (character.statPoints ?? 0) + gainedLevels;
    character.skillPoints = (character.skillPoints ?? 0) + gainedLevels;
  }

  Object.assign(character, input);

  if (input.coreStats) {
    character.coreStats = { ...character.coreStats, ...input.coreStats };
  }

  if (input.maxMana === undefined && input.coreStats?.magic) {
    character.maxMana = getResourceCapFromRank(character.coreStats.magic);
    character.currentMana = Math.min(character.currentMana, character.maxMana);
  }

  if (input.maxStamina === undefined && input.coreStats?.resilience) {
    character.maxStamina = getResourceCapFromRank(character.coreStats.resilience);
    character.currentStamina = Math.min(character.currentStamina, character.maxStamina);
  }

  await character.save();

  return serializeCharacterSheet(character);
}
