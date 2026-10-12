import { connectToDatabase } from '../../db/connection.js';
import { Character } from '../../db/models/Character.js';
import { User } from '../../db/models/User.js';
import { requireAuth } from '../../middleware/auth.js';
import { toPlainDocument } from '../../utils/response.js';

export async function handler(event) {
  const authContext = requireAuth(event);
  await connectToDatabase();
  const characterCount = await Character.countDocuments({ userId: authContext.id });
  const user = await User.findByIdAndUpdate(
    authContext.id,
    {
      _id: authContext.id,
      email: authContext.email || `${authContext.username}@example.invalid`,
      username: authContext.username || authContext.id,
      characterCount,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  return toPlainDocument(user);
}
