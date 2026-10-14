import { connectToDatabase } from '../../db/connection.js';
import { Character } from '../../db/models/Character.js';
import { requireAuth } from '../../middleware/auth.js';
import { serializeCharacterSheet } from './serializeCharacter.js';

export async function handler(event) {
  const user = requireAuth(event);
  await connectToDatabase();
  const characters = await Character.find({ userId: user.id }).sort({ updatedAt: -1 });
  return Promise.all(characters.map((character) => serializeCharacterSheet(character)));
}
