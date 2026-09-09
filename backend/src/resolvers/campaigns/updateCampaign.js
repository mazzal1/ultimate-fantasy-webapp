import { connectToDatabase } from '../../db/connection.js';
import { Campaign } from '../../db/models/Campaign.js';
import { requireAuth } from '../../middleware/auth.js';
import { appSyncError, toPlainDocument } from '../../utils/response.js';
import { validateCampaignInput } from '../../utils/validation.js';

export async function handler(event) {
  const user = requireAuth(event);
  const validationError = validateCampaignInput(event.arguments.input, true);
  if (validationError) {
    appSyncError(validationError);
  }

  await connectToDatabase();
  const campaign = await Campaign.findById(event.arguments.id);
  if (!campaign) {
    appSyncError('Campaign not found.');
  }

  if (campaign.gameMasterId !== user.id) {
    appSyncError('Forbidden');
  }

  Object.assign(campaign, event.arguments.input);
  await campaign.save();

  return toPlainDocument(campaign);
}
