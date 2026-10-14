import { connectToDatabase } from '../../db/connection.js';
import { Ability } from '../../db/models/Ability.js';
import { requireAuth } from '../../middleware/auth.js';
import { toPlainDocument } from '../../utils/response.js';
import { getUserCampaignIds } from '../shared/visibility.js';

export async function handler(event) {
  const user = requireAuth(event);
  await connectToDatabase();
  const campaignIds = await getUserCampaignIds(user.id);
  const items = await Ability.findVisible({
    viewerUserId: user.id,
    campaignIds,
    kind: 'ITEM',
    tag: event.arguments?.tag,
    search: event.arguments?.search,
  });

  return items.map((item) => toPlainDocument(item));
}
