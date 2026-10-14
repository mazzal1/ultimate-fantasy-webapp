import { Ability } from '../../db/models/Ability.js';
import { Competency } from '../../db/models/Competency.js';
import { Title } from '../../db/models/Title.js';
import { toPlainDocument } from '../../utils/response.js';

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

export async function serializeCharacterSheet(character) {
  const raw = toPlainDocument(character);
  const competencyIds = unique((raw.competencyStates ?? []).map((entry) => entry.competencyId));
  const skillIds = unique((raw.skillStates ?? []).map((entry) => entry.skillId));
  const itemIds = unique((raw.itemStates ?? []).map((entry) => entry.itemId));

  const [competencyDocs, abilityDocs, titleDocs] = await Promise.all([
    Competency.findByIds(competencyIds),
    Ability.findByIds(unique([...skillIds, ...itemIds])),
    Title.findByIds(raw.titleIds ?? []),
  ]);

  const competencyMap = new Map(competencyDocs.map((entry) => [entry.id, toPlainDocument(entry)]));
  const abilityMap = new Map(abilityDocs.map((entry) => [entry.id, toPlainDocument(entry)]));
  const titleMap = new Map(titleDocs.map((entry) => [entry.id, toPlainDocument(entry)]));

  return {
    ...raw,
    competencies: (raw.competencyStates ?? [])
      .map((entry) => ({
        rank: entry.rank,
        competency: competencyMap.get(entry.competencyId),
      }))
      .filter((entry) => entry.competency),
    skills: (raw.skillStates ?? [])
      .map((entry) => ({
        rank: entry.rank,
        skill: abilityMap.get(entry.skillId),
      }))
      .filter((entry) => entry.skill),
    titles: (raw.titleIds ?? []).map((titleId) => titleMap.get(titleId)).filter(Boolean),
    items: (raw.itemStates ?? [])
      .map((entry) => ({
        equipped: Boolean(entry.equipped),
        item: abilityMap.get(entry.itemId),
      }))
      .filter((entry) => entry.item),
  };
}
