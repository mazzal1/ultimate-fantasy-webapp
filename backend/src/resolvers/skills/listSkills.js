import { connectToDatabase } from '../../db/connection.js';
import { Skill } from '../../db/models/Skill.js';
import { toPlainDocument } from '../../utils/response.js';

export async function handler() {
  await connectToDatabase();
  const skills = await Skill.find().sort({ rank: 1, name: 1 });
  return skills.map((skill) => toPlainDocument(skill));
}
