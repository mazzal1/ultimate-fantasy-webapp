import { Ability } from './Ability.js';

function toSkillPayload(input) {
  return {
    ...input,
    kind: 'SKILL',
    description: input.description ?? input.effect ?? '',
    maxRank: input.maxRank ?? 'F',
    activationType: input.activationType ?? 'ACTION',
    manaCost: input.manaCost ?? 0,
    staminaCost: input.staminaCost ?? 0,
    requiredAbilityIds: input.requiredAbilityIds ?? (input.requiredSkillId ? [input.requiredSkillId] : []),
  };
}

function mapSkillPayload(base) {
  return {
    id: base.id,
    ownerUserId: base.ownerUserId,
    name: base.name,
    description: base.description,
    maxRank: base.maxRank,
    activationType: base.activationType,
    manaCost: base.manaCost,
    staminaCost: base.staminaCost,
    minLevelRequirement: base.minLevelRequirement,
    requiredAbilityIds: base.requiredAbilityIds,
    requiredTitleIds: base.requiredTitleIds,
    tags: base.tags,
    isSystem: base.isSystem,
    sharedCampaignIds: base.sharedCampaignIds,
    createdAt: base.createdAt,
    updatedAt: base.updatedAt,
  };
}

function decorateSkillDocument(document) {
  if (!document) {
    return null;
  }

  const originalToJSON = document.toJSON.bind(document);
  document.toJSON = () => mapSkillPayload(originalToJSON());
  return document;
}

export const Skill = {
  async create(data) {
    const created = await Ability.create(toSkillPayload(data));
    return decorateSkillDocument(created);
  },

  async findById(id) {
    const ability = await Ability.findById(id);
    if (!ability || ability.kind !== 'SKILL') {
      return null;
    }

    return decorateSkillDocument(ability);
  },

  find(filter = {}) {
    return {
      sort: async () => {
        const items = await Ability.findVisible({
          viewerUserId: filter.viewerUserId ?? '',
          campaignIds: filter.campaignIds ?? [],
          kind: 'SKILL',
          tag: filter.tag,
          search: filter.search,
        });
        return items.map((item) => decorateSkillDocument(item));
      },
    };
  },
};
