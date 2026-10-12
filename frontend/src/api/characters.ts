import type { Character, CharacterInput, CharacterUpdateInput } from '../types/character';

const listMyCharactersQuery = /* GraphQL */ `
  query ListMyCharacters {
    listMyCharacters {
      id
      userId
      name
      background
      level
      currentHp
      maxHp
      currentStamina
      maxStamina
      currentMana
      maxMana
      strength
      dexterity
      constitution
      intelligence
      wisdom
      charisma
      skills
      createdAt
      updatedAt
    }
  }
`;

const getCharacterQuery = /* GraphQL */ `
  query GetCharacter($id: ID!) {
    getCharacter(id: $id) {
      id
      userId
      name
      background
      level
      currentHp
      maxHp
      currentStamina
      maxStamina
      currentMana
      maxMana
      strength
      dexterity
      constitution
      intelligence
      wisdom
      charisma
      skills
      createdAt
      updatedAt
    }
  }
`;

const createCharacterMutation = /* GraphQL */ `
  mutation CreateCharacter($input: CreateCharacterInput!) {
    createCharacter(input: $input) {
      id
      userId
      name
      level
      currentHp
      maxHp
      currentStamina
      maxStamina
      currentMana
      maxMana
      strength
      dexterity
      constitution
      intelligence
      wisdom
      charisma
      skills
      createdAt
      updatedAt
    }
  }
`;

const updateCharacterMutation = /* GraphQL */ `
  mutation UpdateCharacter($id: ID!, $input: UpdateCharacterInput!) {
    updateCharacter(id: $id, input: $input) {
      id
      userId
      name
      background
      level
      currentHp
      maxHp
      currentStamina
      maxStamina
      currentMana
      maxMana
      strength
      dexterity
      constitution
      intelligence
      wisdom
      charisma
      skills
      createdAt
      updatedAt
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
