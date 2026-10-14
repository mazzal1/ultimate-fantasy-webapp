import { connectToDatabase } from '../../db/connection.js';
import { Title } from '../../db/models/Title.js';
import { requireAuth } from '../../middleware/auth.js';
import { toPlainDocument } from '../../utils/response.js';

export async function handler(event) {
  requireAuth(event);
  await connectToDatabase();
  const titles = await Title.listAll();
  return titles.map((title) => toPlainDocument(title));
}
