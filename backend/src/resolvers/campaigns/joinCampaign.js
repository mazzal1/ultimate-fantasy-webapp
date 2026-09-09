import { connectToDatabase } from '../../db/connection.js';
import { Campaign } from '../../db/models/Campaign.js';
import { requireAuth } from '../../middleware/auth.js';
import { appSyncError, toPlainDocument } from '../../utils/response.js';

export async function handler(event) {
  const user = requireAuth(event);
  await connectToDatabase();
  const campaign = await Campaign.findById(event.arguments.campaignId);
  if (!campaign) {
    appSyncError('Campaign not found.');
  }

  if (!campaign.playerIds.includes(user.id)) {
    campaign.playerIds.push(user.id);
    await campaign.save();
  }

  return toPlainDocument(campaign);
}
