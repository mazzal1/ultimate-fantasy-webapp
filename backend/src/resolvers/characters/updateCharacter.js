import { connectToDatabase } from '../../db/connection.js';
import { Character } from '../../db/models/Character.js';
import { requireAuth } from '../../middleware/auth.js';
import { appSyncError, toPlainDocument } from '../../utils/response.js';
import { validateCharacterInput } from '../../utils/validation.js';

export async function handler(event) {
  const user = requireAuth(event);
  const validationError = validateCharacterInput(event.arguments.input, true);
  if (validationError) {
    appSyncError(validationError);
  }

  await connectToDatabase();
  const character = await Character.findById(event.arguments.id);
  if (!character) {
    appSyncError('Character not found.');
  }

  if (character.userId !== user.id) {
    appSyncError('Forbidden');
  }

  Object.assign(character, event.arguments.input);
  await character.save();

  return toPlainDocument(character);
}
