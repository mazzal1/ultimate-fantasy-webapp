import { logger } from '../utils/logger.js';

const starterSkills = [
  { name: 'Arc Burst', rank: 1, tags: ['Action', 'Source of Power'] },
  { name: 'Stoneguard Stance', rank: 1, tags: ['Passive'] },
  { name: 'Blink Counter', rank: 2, tags: ['Reaction'] },
];

export async function seedCommand(config) {
  logger.info(`Preparing starter skills for ${config.stage}.`);
  starterSkills.forEach((skill) => logger.info(`Seed skill: ${skill.name} (rank ${skill.rank}, ${skill.tags.join(', ')})`));
  logger.success('Seed payload prepared. Integrate this command with the GraphQL admin mutation in deployment environments.');
}
