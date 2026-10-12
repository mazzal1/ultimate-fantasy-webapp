import { connectToDatabase } from '../../db/connection.js';
import { Campaign } from '../../db/models/Campaign.js';
import { Character } from '../../db/models/Character.js';
import { requireAuth } from '../../middleware/auth.js';
import { appSyncError, toPlainDocument } from '../../utils/response.js';

export async function handler(event) {
  const user = requireAuth(event);
  await connectToDatabase();
  const [campaign, character] = await Promise.all([
    Campaign.findById(event.arguments.campaignId),
    Character.findById(event.arguments.characterId),
  ]);

  if (!campaign) {
    appSyncError('Campaign not found.');
  }

  if (!character) {
    appSyncError('Character not found.');
  }

  const canAssign = campaign.gameMasterId === user.id || character.userId === user.id;
  if (!canAssign) {
    appSyncError('Forbidden');
  }

  if (!campaign.playerIds.includes(character.userId)) {
    appSyncError('Character owner is not part of this campaign.');
  }

  if (!campaign.characterIds.includes(character.id)) {
    campaign.characterIds.push(character.id);
    await campaign.save();
  }

  return toPlainDocument(campaign);
}
