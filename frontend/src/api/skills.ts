import type { Competency, CompetencyInput, Item, Skill, SkillInput, Title } from '../types/skill';

const abilityFields = `
  id
  ownerUserId
  name
  description
  maxRank
  activationType
  manaCost
  staminaCost
  minLevelRequirement
  requiredAbilityIds
  requiredTitleIds
  tags
  isSystem
  sharedCampaignIds
  createdAt
  updatedAt
`;

const competencyFields = `
  id
  ownerUserId
  name
  description
  tags
  isSystem
  sharedCampaignIds
  createdAt
  updatedAt
`;

const listSkillsQuery = /* GraphQL */ `
  query ListSkills($tag: String, $search: String) {
    listSkills(tag: $tag, search: $search) {
      ${abilityFields}
    }
  }
`;

const listItemsQuery = /* GraphQL */ `
  query ListItems($tag: String, $search: String) {
    listItems(tag: $tag, search: $search) {
      ${abilityFields}
    }
  }
`;

const listCompetenciesQuery = /* GraphQL */ `
  query ListCompetencies($search: String) {
    listCompetencies(search: $search) {
      ${competencyFields}
    }
  }
`;

const listTitlesQuery = /* GraphQL */ `
  query ListTitles {
    listTitles {
      id
      name
      description
      isSystem
      createdAt
      updatedAt
    }
  }
`;

const getSkillQuery = /* GraphQL */ `
  query GetSkill($id: ID!) {
    getSkill(id: $id) {
      ${abilityFields}
    }
  }
`;

const createSkillMutation = /* GraphQL */ `
  mutation CreateSkill($input: CreateSkillInput!) {
    createSkill(input: $input) {
      ${abilityFields}
    }
  }
`;

const updateSkillMutation = /* GraphQL */ `
  mutation UpdateSkill($id: ID!, $input: UpdateSkillInput!) {
    updateSkill(id: $id, input: $input) {
      ${abilityFields}
    }
  }
`;

const createCompetencyMutation = /* GraphQL */ `
  mutation CreateCompetency($input: CreateCompetencyInput!) {
    createCompetency(input: $input) {
      ${competencyFields}
    }
  }
`;

const shareSkillMutation = /* GraphQL */ `
  mutation ShareSkill($skillId: ID!, $campaignId: ID!) {
    shareSkill(skillId: $skillId, campaignId: $campaignId) {
      ${abilityFields}
    }
  }
`;

const shareCompetencyMutation = /* GraphQL */ `
  mutation ShareCompetency($competencyId: ID!, $campaignId: ID!) {
    shareCompetency(competencyId: $competencyId, campaignId: $campaignId) {
      ${competencyFields}
    }
  }
`;

export async function listSkills(client: { graphql: Function }, filters?: { tag?: string; search?: string }): Promise<Skill[]> {
  const response = await client.graphql({ query: listSkillsQuery, variables: filters ?? {} });
  return response.data.listSkills;
}

export async function listItems(client: { graphql: Function }, filters?: { tag?: string; search?: string }): Promise<Item[]> {
  const response = await client.graphql({ query: listItemsQuery, variables: filters ?? {} });
  return response.data.listItems;
}

export async function listCompetencies(client: { graphql: Function }, filters?: { search?: string }): Promise<Competency[]> {
  const response = await client.graphql({ query: listCompetenciesQuery, variables: filters ?? {} });
  return response.data.listCompetencies;
}

export async function listTitles(client: { graphql: Function }): Promise<Title[]> {
  const response = await client.graphql({ query: listTitlesQuery });
  return response.data.listTitles;
}

export async function getSkill(client: { graphql: Function }, id: string): Promise<Skill> {
  const response = await client.graphql({ query: getSkillQuery, variables: { id } });
  return response.data.getSkill;
}

export async function createSkill(client: { graphql: Function }, input: SkillInput): Promise<Skill> {
  const response = await client.graphql({ query: createSkillMutation, variables: { input } });
  return response.data.createSkill;
}

export async function updateSkill(client: { graphql: Function }, id: string, input: Partial<SkillInput>): Promise<Skill> {
  const response = await client.graphql({ query: updateSkillMutation, variables: { id, input } });
  return response.data.updateSkill;
}

export async function createCompetency(client: { graphql: Function }, input: CompetencyInput): Promise<Competency> {
  const response = await client.graphql({ query: createCompetencyMutation, variables: { input } });
  return response.data.createCompetency;
}

export async function shareSkill(client: { graphql: Function }, skillId: string, campaignId: string): Promise<Skill> {
  const response = await client.graphql({ query: shareSkillMutation, variables: { skillId, campaignId } });
  return response.data.shareSkill;
}

export async function shareCompetency(client: { graphql: Function }, competencyId: string, campaignId: string): Promise<Competency> {
  const response = await client.graphql({ query: shareCompetencyMutation, variables: { competencyId, campaignId } });
  return response.data.shareCompetency;
}
