import { connectToDatabase } from '../../db/connection.js';
import { Campaign } from '../../db/models/Campaign.js';
import { requireAuth } from '../../middleware/auth.js';
import { appSyncError, toPlainDocument } from '../../utils/response.js';

export async function handler(event) {
  const user = requireAuth(event);
  await connectToDatabase();
  const campaign = await Campaign.findById(event.arguments.id);

  if (!campaign) {
    return null;
  }

  if (campaign.gameMasterId !== user.id && !campaign.playerIds.includes(user.id)) {
    appSyncError('Forbidden');
  }

  return toPlainDocument(campaign);
}
