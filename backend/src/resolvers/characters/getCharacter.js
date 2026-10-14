import { connectToDatabase } from '../../db/connection.js';
import { Character } from '../../db/models/Character.js';
import { requireAuth } from '../../middleware/auth.js';
import { appSyncError } from '../../utils/response.js';
import { serializeCharacterSheet } from './serializeCharacter.js';

export async function handler(event) {
  const user = requireAuth(event);
  await connectToDatabase();
  const character = await Character.findById(event.arguments.id);

  if (!character) {
    return null;
  }

  if (character.userId !== user.id) {
    appSyncError('Forbidden');
  }

  return serializeCharacterSheet(character);
}
