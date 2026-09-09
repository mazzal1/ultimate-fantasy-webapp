import { connectToDatabase } from '../../db/connection.js';
import { Skill } from '../../db/models/Skill.js';
import { toPlainDocument } from '../../utils/response.js';

export async function handler(event) {
  await connectToDatabase();
  const skill = await Skill.findById(event.arguments.id);
  return toPlainDocument(skill);
}
