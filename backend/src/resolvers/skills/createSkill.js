import { connectToDatabase } from '../../db/connection.js';
import { Skill } from '../../db/models/Skill.js';
import { requireAdmin } from '../../middleware/adminOnly.js';
import { appSyncError, toPlainDocument } from '../../utils/response.js';
import { validateSkillInput } from '../../utils/validation.js';

export async function handler(event) {
  requireAdmin(event);
  const validationError = validateSkillInput(event.arguments.input);
  if (validationError) {
    appSyncError(validationError);
  }

  await connectToDatabase();
  const skill = await Skill.create({
    ...event.arguments.input,
    tags: event.arguments.input.tags ?? [],
  });

  return toPlainDocument(skill);
}
