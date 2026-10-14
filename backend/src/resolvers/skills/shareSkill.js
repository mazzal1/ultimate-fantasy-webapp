import { connectToDatabase } from '../../db/connection.js';
import { Campaign } from '../../db/models/Campaign.js';
import { Skill } from '../../db/models/Skill.js';
import { requireAuth } from '../../middleware/auth.js';
import { appSyncError, toPlainDocument } from '../../utils/response.js';

export async function handler(event) {
  const user = requireAuth(event);
  await connectToDatabase();
  const [skill, campaign] = await Promise.all([
    Skill.findById(event.arguments.skillId),
    Campaign.findById(event.arguments.campaignId),
  ]);

  if (!skill) {
    appSyncError('Skill not found.');
  }

  if (!campaign) {
    appSyncError('Campaign not found.');
  }

  if (skill.ownerUserId !== user.id) {
    appSyncError('Forbidden');
  }

  if (!campaign.playerIds.includes(user.id) && campaign.gameMasterId !== user.id) {
    appSyncError('You can only share to campaigns you joined.');
  }

  const nextCampaignIds = new Set(skill.sharedCampaignIds ?? []);
  nextCampaignIds.add(campaign.id);
  skill.sharedCampaignIds = [...nextCampaignIds];
  await skill.save();
  return toPlainDocument(skill);
}
