import { connectToDatabase } from '../../db/connection.js';
import { Character } from '../../db/models/Character.js';
import { User } from '../../db/models/User.js';
import { requireAuth } from '../../middleware/auth.js';
import { toPlainDocument, appSyncError } from '../../utils/response.js';
import { validateCharacterInput } from '../../utils/validation.js';

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
  const maxHp = input.maxHp ?? 10;
  const maxStamina = input.maxStamina ?? 10;
  const maxMana = input.maxMana ?? 10;

  const character = await Character.create({
    userId: user.id,
    name: input.name,
    background: input.background ?? '',
    level: input.level ?? 1,
    currentHp: maxHp,
    maxHp,
    currentStamina: maxStamina,
    maxStamina,
    currentMana: maxMana,
    maxMana,
    strength: input.strength ?? 10,
    dexterity: input.dexterity ?? 10,
    constitution: input.constitution ?? 10,
    intelligence: input.intelligence ?? 10,
    wisdom: input.wisdom ?? 10,
    charisma: input.charisma ?? 10,
    skills: [],
  });

  await User.findByIdAndUpdate(
    user.id,
    { _id: user.id, email: user.email || `${user.username}@example.invalid`, username: user.username || user.id, characterCount: existingCount + 1 },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  return toPlainDocument(character);
}
