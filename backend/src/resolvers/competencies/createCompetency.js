import { connectToDatabase } from '../../db/connection.js';
import { Competency } from '../../db/models/Competency.js';
import { requireAuth } from '../../middleware/auth.js';
import { appSyncError, toPlainDocument } from '../../utils/response.js';
import { validateCompetencyInput } from '../../utils/validation.js';

export async function handler(event) {
  const user = requireAuth(event);
  const validationError = validateCompetencyInput(event.arguments.input);
  if (validationError) {
    appSyncError(validationError);
  }

  await connectToDatabase();
  const competency = await Competency.create({
    ownerUserId: user.id,
    name: event.arguments.input.name,
    description: event.arguments.input.description ?? '',
    tags: event.arguments.input.tags ?? [],
    isSystem: false,
    sharedCampaignIds: [],
  });

  return toPlainDocument(competency);
}
