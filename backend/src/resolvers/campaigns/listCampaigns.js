import { connectToDatabase } from '../../db/connection.js';
import { Campaign } from '../../db/models/Campaign.js';
import { requireAuth } from '../../middleware/auth.js';
import { toPlainDocument } from '../../utils/response.js';

export async function handler(event) {
  const user = requireAuth(event);
  await connectToDatabase();
  const campaigns = await Campaign.find({
    $or: [{ gameMasterId: user.id }, { playerIds: user.id }],
  }).sort({ updatedAt: -1 });

  return campaigns.map((campaign) => toPlainDocument(campaign));
}
