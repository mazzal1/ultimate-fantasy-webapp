import { Campaign } from '../../db/models/Campaign.js';

export async function getUserCampaignIds(userId) {
  const campaigns = await Campaign.find({
    $or: [{ gameMasterId: userId }, { playerIds: userId }],
  }).sort({ updatedAt: -1 });
  return campaigns.map((campaign) => campaign.id);
}
