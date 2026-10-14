import { connectToDatabase } from '../../db/connection.js';
import { Skill } from '../../db/models/Skill.js';
import { requireAuth } from '../../middleware/auth.js';
import { toPlainDocument } from '../../utils/response.js';
import { getUserCampaignIds } from '../shared/visibility.js';

export async function handler(event) {
  const user = requireAuth(event);
  await connectToDatabase();
  const campaignIds = await getUserCampaignIds(user.id);
  const skills = await Skill.find({
    viewerUserId: user.id,
    campaignIds,
    tag: event.arguments?.tag,
    search: event.arguments?.search,
  }).sort({ name: 1 });
  return skills.map((skill) => toPlainDocument(skill));
}
