import { connectToDatabase } from '../../db/connection.js';
import { Campaign } from '../../db/models/Campaign.js';
import { Competency } from '../../db/models/Competency.js';
import { requireAuth } from '../../middleware/auth.js';
import { appSyncError, toPlainDocument } from '../../utils/response.js';

export async function handler(event) {
  const user = requireAuth(event);
  await connectToDatabase();
  const [competency, campaign] = await Promise.all([
    Competency.findById(event.arguments.competencyId),
    Campaign.findById(event.arguments.campaignId),
  ]);

  if (!competency) {
    appSyncError('Competency not found.');
  }

  if (!campaign) {
    appSyncError('Campaign not found.');
  }

  if (competency.ownerUserId !== user.id) {
    appSyncError('Forbidden');
  }

  if (!campaign.playerIds.includes(user.id) && campaign.gameMasterId !== user.id) {
    appSyncError('You can only share to campaigns you joined.');
  }

  const nextCampaignIds = new Set(competency.sharedCampaignIds ?? []);
  nextCampaignIds.add(campaign.id);
  competency.sharedCampaignIds = [...nextCampaignIds];
  await competency.save();
  return toPlainDocument(competency);
}
