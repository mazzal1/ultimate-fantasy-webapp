import { connectToDatabase } from '../../db/connection.js';
import { Skill } from '../../db/models/Skill.js';
import { requireAuth } from '../../middleware/auth.js';
import { appSyncError, toPlainDocument } from '../../utils/response.js';
import { getUserCampaignIds } from '../shared/visibility.js';

export async function handler(event) {
  const user = requireAuth(event);
  await connectToDatabase();
  const skill = await Skill.findById(event.arguments.id);
  if (!skill) {
    return null;
  }

  const payload = toPlainDocument(skill);
  const campaignIds = await getUserCampaignIds(user.id);
  const canAccess =
    payload.isSystem ||
    payload.ownerUserId === user.id ||
    payload.sharedCampaignIds.some((campaignId) => campaignIds.includes(campaignId));

  if (!canAccess) {
    appSyncError('Forbidden');
  }

  return payload;
}
