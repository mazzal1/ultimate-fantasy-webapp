import type { Character, CharacterInput, CharacterUpdateInput } from '../types/character';

const characterFields = `
  id
  userId
  name
  playerName
  gender
  race
  age
  background
  level
  statPoints
  skillPoints
  currentHp
  maxHp
  coreStats {
    strength
    agility
    dexterity
    resilience
    magic
    willpower
    acumen
    charisma
    luck
  }
  currentMana
  maxMana
  currentStamina
  maxStamina
  wounds
  competencyStates {
    competencyId
    rank
  }
  skillStates {
    skillId
    rank
  }
  titleIds
  itemStates {
    itemId
    equipped
  }
  competencies {
    rank
    competency {
      id
      name
      description
      tags
      isSystem
      sharedCampaignIds
      createdAt
      updatedAt
    }
  }
  skills {
    rank
    skill {
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
    }
  }
  titles {
    id
    name
    description
    isSystem
    createdAt
    updatedAt
  }
  items {
    equipped
    item {
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
    }
  }
  createdAt
  updatedAt
`;

const listMyCharactersQuery = /* GraphQL */ `
  query ListMyCharacters {
    listMyCharacters {
      ${characterFields}
    }
  }
`;

const getCharacterQuery = /* GraphQL */ `
  query GetCharacter($id: ID!) {
    getCharacter(id: $id) {
      ${characterFields}
    }
  }
`;

const createCharacterMutation = /* GraphQL */ `
  mutation CreateCharacter($input: CreateCharacterInput!) {
    createCharacter(input: $input) {
      ${characterFields}
    }
  }
`;

const updateCharacterMutation = /* GraphQL */ `
  mutation UpdateCharacter($id: ID!, $input: UpdateCharacterInput!) {
    updateCharacter(id: $id, input: $input) {
      ${characterFields}
    }
  }
`;

const deleteCharacterMutation = /* GraphQL */ `
  mutation DeleteCharacter($id: ID!) {
    deleteCharacter(id: $id)
  }
`;

export async function listCharacters(client: { graphql: Function }): Promise<Character[]> {
  const response = await client.graphql({ query: listMyCharactersQuery });
  return response.data.listMyCharacters;
}

export async function getCharacter(client: { graphql: Function }, id: string): Promise<Character> {
  const response = await client.graphql({ query: getCharacterQuery, variables: { id } });
  return response.data.getCharacter;
}

export async function createCharacter(client: { graphql: Function }, input: CharacterInput): Promise<Character> {
  const response = await client.graphql({ query: createCharacterMutation, variables: { input } });
  return response.data.createCharacter;
}

export async function updateCharacter(client: { graphql: Function }, id: string, input: CharacterUpdateInput): Promise<Character> {
  const response = await client.graphql({ query: updateCharacterMutation, variables: { id, input } });
  return response.data.updateCharacter;
}

export async function deleteCharacter(client: { graphql: Function }, id: string): Promise<boolean> {
  const response = await client.graphql({ query: deleteCharacterMutation, variables: { id } });
  return response.data.deleteCharacter;
}
