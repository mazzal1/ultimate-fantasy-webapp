import { connectToDatabase } from '../../db/connection.js';
import { Competency } from '../../db/models/Competency.js';
import { requireAuth } from '../../middleware/auth.js';
import { toPlainDocument } from '../../utils/response.js';
import { getUserCampaignIds } from '../shared/visibility.js';

export async function handler(event) {
  const user = requireAuth(event);
  await connectToDatabase();
  const campaignIds = await getUserCampaignIds(user.id);
  const competencies = await Competency.findVisible({
    viewerUserId: user.id,
    campaignIds,
    search: event.arguments?.search,
  });

  return competencies.map((entry) => toPlainDocument(entry));
}
