import { connectToDatabase } from '../../db/connection.js';
import { Skill } from '../../db/models/Skill.js';
import { requireAuth } from '../../middleware/auth.js';
import { appSyncError, toPlainDocument } from '../../utils/response.js';
import { validateSkillInput } from '../../utils/validation.js';

export async function handler(event) {
  const user = requireAuth(event);
  const validationError = validateSkillInput(event.arguments.input, true);
  if (validationError) {
    appSyncError(validationError);
  }

  await connectToDatabase();
  const skill = await Skill.findById(event.arguments.id);
  if (!skill) {
    appSyncError('Skill not found.');
  }

  if (skill.ownerUserId !== user.id) {
    appSyncError('Forbidden');
  }

  Object.assign(skill, event.arguments.input);
  await skill.save();
  return toPlainDocument(skill);
}
