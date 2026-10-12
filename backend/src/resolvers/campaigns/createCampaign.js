import { connectToDatabase } from '../../db/connection.js';
import { Campaign } from '../../db/models/Campaign.js';
import { requireAuth } from '../../middleware/auth.js';
import { appSyncError, toPlainDocument } from '../../utils/response.js';
import { validateCampaignInput } from '../../utils/validation.js';

export async function handler(event) {
  const user = requireAuth(event);
  const validationError = validateCampaignInput(event.arguments.input);
  if (validationError) {
    appSyncError(validationError);
  }

  await connectToDatabase();
  const campaign = await Campaign.create({
    name: event.arguments.input.name,
    description: event.arguments.input.description ?? '',
    notes: event.arguments.input.notes ?? '',
    gameMasterId: user.id,
    playerIds: [user.id],
    characterIds: [],
  });

  return toPlainDocument(campaign);
}
