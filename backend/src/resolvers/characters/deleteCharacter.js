import { connectToDatabase } from '../../db/connection.js';
import { Character } from '../../db/models/Character.js';
import { User } from '../../db/models/User.js';
import { requireAuth } from '../../middleware/auth.js';
import { appSyncError } from '../../utils/response.js';

export async function handler(event) {
  const user = requireAuth(event);
  await connectToDatabase();
  const character = await Character.findById(event.arguments.id);

  if (!character) {
    return false;
  }

  if (character.userId !== user.id) {
    appSyncError('Forbidden');
  }

  await character.deleteOne();
  const nextCount = await Character.countDocuments({ userId: user.id });
  await User.findByIdAndUpdate(user.id, { characterCount: nextCount }, { upsert: true, new: true, setDefaultsOnInsert: true });
  return true;
}
