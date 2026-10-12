import type { Campaign, CampaignInput } from '../types/campaign';

const listCampaignsQuery = /* GraphQL */ `
  query ListMyCampaigns {
    listMyCampaigns {
      id
      name
      description
      notes
      gameMasterId
      playerIds
      characterIds
      createdAt
      updatedAt
    }
  }
`;

const getCampaignQuery = /* GraphQL */ `
  query GetCampaign($id: ID!) {
    getCampaign(id: $id) {
      id
      name
      description
      notes
      gameMasterId
      playerIds
      characterIds
      createdAt
      updatedAt
    }
  }
`;

const createCampaignMutation = /* GraphQL */ `
  mutation CreateCampaign($input: CreateCampaignInput!) {
    createCampaign(input: $input) {
      id
      name
      description
      notes
      gameMasterId
      playerIds
      characterIds
      createdAt
      updatedAt
    }
  }
`;

const updateCampaignMutation = /* GraphQL */ `
  mutation UpdateCampaign($id: ID!, $input: UpdateCampaignInput!) {
    updateCampaign(id: $id, input: $input) {
      id
      name
      description
      notes
      gameMasterId
      playerIds
      characterIds
      createdAt
      updatedAt
    }
  }
`;

const joinCampaignMutation = /* GraphQL */ `
  mutation JoinCampaign($campaignId: ID!) {
    joinCampaign(campaignId: $campaignId) {
      id
      name
      playerIds
      characterIds
      updatedAt
    }
  }
`;

const assignCharacterMutation = /* GraphQL */ `
  mutation AssignCharacterToCampaign($campaignId: ID!, $characterId: ID!) {
    assignCharacterToCampaign(campaignId: $campaignId, characterId: $characterId) {
      id
      name
      playerIds
      characterIds
      updatedAt
    }
  }
`;

export async function listCampaigns(client: { graphql: Function }): Promise<Campaign[]> {
  const response = await client.graphql({ query: listCampaignsQuery });
  return response.data.listMyCampaigns;
}

export async function getCampaign(client: { graphql: Function }, id: string): Promise<Campaign> {
  const response = await client.graphql({ query: getCampaignQuery, variables: { id } });
  return response.data.getCampaign;
}

export async function createCampaign(client: { graphql: Function }, input: CampaignInput): Promise<Campaign> {
  const response = await client.graphql({ query: createCampaignMutation, variables: { input } });
  return response.data.createCampaign;
}

export async function updateCampaign(client: { graphql: Function }, id: string, input: CampaignInput): Promise<Campaign> {
  const response = await client.graphql({ query: updateCampaignMutation, variables: { id, input } });
  return response.data.updateCampaign;
}

export async function joinCampaign(client: { graphql: Function }, campaignId: string): Promise<Campaign> {
  const response = await client.graphql({ query: joinCampaignMutation, variables: { campaignId } });
  return response.data.joinCampaign;
}

export async function assignCharacterToCampaign(client: { graphql: Function }, campaignId: string, characterId: string): Promise<Campaign> {
  const response = await client.graphql({ query: assignCharacterMutation, variables: { campaignId, characterId } });
  return response.data.assignCharacterToCampaign;
}
