import { connectToDatabase } from '../../db/connection.js';
import { Campaign } from '../../db/models/Campaign.js';
import { Character } from '../../db/models/Character.js';
import { requireAuth } from '../../middleware/auth.js';
import { appSyncError } from '../../utils/response.js';
import { serializeCharacterSheet } from '../characters/serializeCharacter.js';

export async function handler(event) {
  const user = requireAuth(event);
  await connectToDatabase();
  const campaign = await Campaign.findById(event.arguments.campaignId);
  if (!campaign) {
    appSyncError('Campaign not found.');
  }

  if (campaign.gameMasterId !== user.id && !campaign.playerIds.includes(user.id)) {
    appSyncError('Forbidden');
  }

  const characters = await Character.find({ idIn: campaign.characterIds }).sort({ name: 1 });
  return Promise.all(characters.map((character) => serializeCharacterSheet(character)));
}
