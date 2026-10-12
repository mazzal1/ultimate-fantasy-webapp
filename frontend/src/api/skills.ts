import type { Skill, SkillInput } from '../types/skill';

const listSkillsQuery = /* GraphQL */ `
  query ListSkills {
    listSkills {
      id
      name
      effect
      rank
      minLevelRequirement
      requiredSkillId
      requiredSkillRank
      tags
      createdAt
      updatedAt
    }
  }
`;

const getSkillQuery = /* GraphQL */ `
  query GetSkill($id: ID!) {
    getSkill(id: $id) {
      id
      name
      effect
      rank
      minLevelRequirement
      requiredSkillId
      requiredSkillRank
      tags
      createdAt
      updatedAt
    }
  }
`;

const createSkillMutation = /* GraphQL */ `
  mutation CreateSkill($input: CreateSkillInput!) {
    createSkill(input: $input) {
      id
      name
      effect
      rank
      minLevelRequirement
      requiredSkillId
      requiredSkillRank
      tags
      createdAt
      updatedAt
    }
  }
`;

const updateSkillMutation = /* GraphQL */ `
  mutation UpdateSkill($id: ID!, $input: UpdateSkillInput!) {
    updateSkill(id: $id, input: $input) {
      id
      name
      effect
      rank
      minLevelRequirement
      requiredSkillId
      requiredSkillRank
      tags
      createdAt
      updatedAt
    }
  }
`;

export async function listSkills(client: { graphql: Function }): Promise<Skill[]> {
  const response = await client.graphql({ query: listSkillsQuery });
  return response.data.listSkills;
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
